import base64
import csv
import json
import os
from pathlib import Path

from azure.identity import AzureCliCredential
from azure.core.exceptions import HttpResponseError
from azure.search.documents import SearchClient
from azure.search.documents.indexes import SearchIndexClient
from azure.search.documents.indexes.models import (
    AzureOpenAIVectorizerParameters,
    KnowledgeBase,
    KnowledgeBaseAzureOpenAIModel,
    KnowledgeSourceReference,
    SearchField,
    SearchIndex,
    SearchIndexFieldReference,
    SearchIndexKnowledgeSource,
    SearchIndexKnowledgeSourceParameters,
    SemanticConfiguration,
    SemanticField,
    SemanticPrioritizedFields,
    SemanticSearch,
)
from dotenv import load_dotenv

load_dotenv()

SEARCH_SCOPE = "https://search.azure.com/.default"
SEARCH_ENDPOINT = os.environ["AZURE_SEARCH_ENDPOINT"]
INDEX_NAME = os.environ["AZURE_SEARCH_SECURE_INDEX_NAME"]
KNOWLEDGE_SOURCE_NAME = os.environ["AZURE_SEARCH_SECURE_KNOWLEDGE_SOURCE_NAME"]
KNOWLEDGE_BASE_NAME = os.environ["AZURE_SEARCH_SECURE_KNOWLEDGE_BASE_NAME"]
AZURE_OPENAI_RESOURCE_URL = os.environ["AZURE_OPENAI_ENDPOINT"].removesuffix("/openai/v1").rstrip("/")
GPT_DEPLOYMENT = os.environ["AZURE_OPENAI_DEPLOYMENT"]
DEMO_FINANCE_GROUP = os.environ.get(
    "DEMO_FINANCE_GROUP_OBJECT_ID",
    "00000000-0000-0000-0000-000000000999",
)


def object_id_from_token(token: str) -> str:
    """Read the signed-in user's oid claim locally without logging the token."""
    payload = token.split(".")[1]
    payload += "=" * (-len(payload) % 4)
    claims = json.loads(base64.urlsafe_b64decode(payload))
    return claims["oid"]


def acl_values(value: str, current_user_id: str) -> list[str]:
    replacements = {
        "CURRENT_USER": current_user_id,
        "FINANCE_GROUP": DEMO_FINANCE_GROUP,
    }
    return [replacements.get(item, item) for item in value.split("|")]


def main() -> None:
    credential = AzureCliCredential()
    current_user_id = object_id_from_token(credential.get_token(SEARCH_SCOPE).token)
    index_client = SearchIndexClient(endpoint=SEARCH_ENDPOINT, credential=credential)

    # Official permission-filter schema: ACL fields are filterable but not retrievable.
    index = SearchIndex(
        name=INDEX_NAME,
        fields=[
            SearchField(name="id", type="Edm.String", key=True, filterable=True),
            SearchField(name="title", type="Edm.String", searchable=True, filterable=True),
            SearchField(name="category", type="Edm.String", searchable=True, filterable=True),
            SearchField(name="content", type="Edm.String", searchable=True),
            SearchField(
                name="UserIds",
                type="Collection(Edm.String)",
                filterable=True,
                retrievable=False,
                permission_filter="userIds",
            ),
            SearchField(
                name="GroupIds",
                type="Collection(Edm.String)",
                filterable=True,
                retrievable=False,
                permission_filter="groupIds",
            ),
        ],
        permission_filter_option="enabled",
        semantic_search=SemanticSearch(
            default_configuration_name="secure-travel-semantic-config",
            configurations=[
                SemanticConfiguration(
                    name="secure-travel-semantic-config",
                    prioritized_fields=SemanticPrioritizedFields(
                        title_field=SemanticField(field_name="title"),
                        content_fields=[SemanticField(field_name="content")],
                        keywords_fields=[SemanticField(field_name="category")],
                    ),
                )
            ],
        ),
    )
    index_client.create_or_update_index(index)
    print(f"Permission-enabled index '{INDEX_NAME}' created or updated.")

    csv_path = Path(__file__).parent / "data" / "secure_travel_documents.csv"
    with csv_path.open(encoding="utf-8", newline="") as csv_file:
        documents = []
        for row in csv.DictReader(csv_file):
            row["UserIds"] = acl_values(row.pop("user_ids"), current_user_id)
            row["GroupIds"] = acl_values(row.pop("group_ids"), current_user_id)
            documents.append(row)

    search_client = SearchClient(endpoint=SEARCH_ENDPOINT, index_name=INDEX_NAME, credential=credential)
    try:
        results = search_client.upload_documents(documents=documents)
    except HttpResponseError as error:
        if error.status_code == 403:
            raise SystemExit(
                "Azure AI Search denied document upload. Assign the signed-in user "
                "the Search Index Data Contributor role, wait for RBAC propagation, and rerun."
            ) from None
        raise
    if not all(result.succeeded for result in results):
        raise RuntimeError("One or more secured documents failed to upload.")
    print(f"Uploaded {len(documents)} documents with document-level ACL metadata.")

    knowledge_source = SearchIndexKnowledgeSource(
        name=KNOWLEDGE_SOURCE_NAME,
        description="Permission-aware fictional travel documents",
        search_index_parameters=SearchIndexKnowledgeSourceParameters(
            search_index_name=INDEX_NAME,
            source_data_fields=[
                SearchIndexFieldReference(name="id"),
                SearchIndexFieldReference(name="title"),
                SearchIndexFieldReference(name="category"),
            ],
        ),
    )
    index_client.create_or_update_knowledge_source(knowledge_source=knowledge_source)

    model_parameters = AzureOpenAIVectorizerParameters(
        resource_url=AZURE_OPENAI_RESOURCE_URL,
        deployment_name=GPT_DEPLOYMENT,
        model_name=GPT_DEPLOYMENT,
    )
    knowledge_base = KnowledgeBase(
        name=KNOWLEDGE_BASE_NAME,
        models=[KnowledgeBaseAzureOpenAIModel(azure_open_ai_parameters=model_parameters)],
        knowledge_sources=[KnowledgeSourceReference(name=KNOWLEDGE_SOURCE_NAME)],
        output_mode="answerSynthesis",
        answer_instructions=(
            "Answer only from documents authorized for the querying user. "
            "If no authorized document contains the answer, say exactly: "
            "No authorized document contains this answer."
        ),
    )
    index_client.create_or_update_knowledge_base(knowledge_base)
    print(f"Permission-aware knowledge base '{KNOWLEDGE_BASE_NAME}' created or updated.")


if __name__ == "__main__":
    main()
