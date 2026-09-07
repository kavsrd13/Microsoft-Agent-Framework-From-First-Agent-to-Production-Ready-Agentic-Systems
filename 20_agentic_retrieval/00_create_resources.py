import csv
import os
from pathlib import Path

from azure.core.credentials import AzureKeyCredential
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

SEARCH_ENDPOINT = os.environ["AZURE_SEARCH_ENDPOINT"]
INDEX_NAME = os.environ["AZURE_SEARCH_AGENTIC_INDEX_NAME"]
KNOWLEDGE_SOURCE_NAME = os.environ["AZURE_SEARCH_AGENTIC_KNOWLEDGE_SOURCE_NAME"]
KNOWLEDGE_BASE_NAME = os.environ["AZURE_SEARCH_AGENTIC_KNOWLEDGE_BASE_NAME"]

# The knowledge-base model expects the Azure OpenAI resource URL, not /openai/v1.
AZURE_OPENAI_RESOURCE_URL = os.environ["AZURE_OPENAI_ENDPOINT"].removesuffix("/openai/v1").rstrip("/")
GPT_DEPLOYMENT = os.environ["AZURE_OPENAI_DEPLOYMENT"]


def main() -> None:
    credential = AzureKeyCredential(os.environ["AZURE_SEARCH_ADMIN_KEY"])
    index_client = SearchIndexClient(endpoint=SEARCH_ENDPOINT, credential=credential)

    # Documentation pattern: searchable fields plus a semantic configuration.
    index = SearchIndex(
        name=INDEX_NAME,
        fields=[
            SearchField(name="id", type="Edm.String", key=True, filterable=True),
            SearchField(name="title", type="Edm.String", searchable=True, filterable=True),
            SearchField(name="category", type="Edm.String", searchable=True, filterable=True, facetable=True),
            SearchField(name="city", type="Edm.String", searchable=True, filterable=True, facetable=True),
            SearchField(name="content", type="Edm.String", searchable=True),
        ],
        semantic_search=SemanticSearch(
            default_configuration_name="travel-semantic-config",
            configurations=[
                SemanticConfiguration(
                    name="travel-semantic-config",
                    prioritized_fields=SemanticPrioritizedFields(
                        title_field=SemanticField(field_name="title"),
                        content_fields=[SemanticField(field_name="content")],
                        keywords_fields=[
                            SemanticField(field_name="category"),
                            SemanticField(field_name="city"),
                        ],
                    ),
                )
            ],
        ),
    )
    index_client.create_or_update_index(index)
    print(f"Index '{INDEX_NAME}' created or updated.")

    csv_path = Path(__file__).parent / "data" / "travel_operations.csv"
    with csv_path.open(encoding="utf-8", newline="") as csv_file:
        documents = list(csv.DictReader(csv_file))

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
        raise RuntimeError("One or more travel documents failed to upload.")
    print(f"Uploaded {len(documents)} documents.")

    # Documentation pattern: an index becomes a reusable knowledge source.
    knowledge_source = SearchIndexKnowledgeSource(
        name=KNOWLEDGE_SOURCE_NAME,
        description="Fictional Contoso Travel operations guidance",
        search_index_parameters=SearchIndexKnowledgeSourceParameters(
            search_index_name=INDEX_NAME,
            source_data_fields=[
                SearchIndexFieldReference(name="id"),
                SearchIndexFieldReference(name="title"),
                SearchIndexFieldReference(name="category"),
                SearchIndexFieldReference(name="city"),
            ],
        ),
    )
    index_client.create_or_update_knowledge_source(knowledge_source=knowledge_source)
    print(f"Knowledge source '{KNOWLEDGE_SOURCE_NAME}' created or updated.")

    # The knowledge base uses GPT for query planning and answer synthesis.
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
            "Answer only from the fictional travel documents. Cite reference IDs. "
            "If the documents do not contain the answer, say 'I don't know'."
        ),
    )
    index_client.create_or_update_knowledge_base(knowledge_base)
    print(f"Knowledge base '{KNOWLEDGE_BASE_NAME}' created or updated.")


if __name__ == "__main__":
    main()
