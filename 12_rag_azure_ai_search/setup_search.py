import os

from azure.identity import AzureCliCredential
from azure.search.documents import SearchClient
from azure.search.documents.indexes import SearchIndexClient
from azure.search.documents.indexes.models import (
    SearchField,
    SearchIndex,
    SemanticConfiguration,
    SemanticField,
    SemanticPrioritizedFields,
    SemanticSearch,
)
from dotenv import load_dotenv

load_dotenv()


def main() -> None:
    endpoint = os.environ["AZURE_SEARCH_ENDPOINT"]
    index_name = os.environ["AZURE_SEARCH_INDEX_NAME"]
    credential = AzureCliCredential()

    index = SearchIndex(
        name=index_name,
        fields=[
            SearchField(name="id", type="Edm.String", key=True, filterable=True),
            SearchField(name="title", type="Edm.String", searchable=True),
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
                    ),
                )
            ],
        ),
    )

    index_client = SearchIndexClient(endpoint=endpoint, credential=credential)
    index_client.create_or_update_index(index)

    documents = [
        {
            "id": "1",
            "title": "Doha terminal transfer",
            "content": "Allow at least 75 minutes for a terminal transfer in Doha.",
        },
        {
            "id": "2",
            "title": "Delayed baggage in Paris",
            "content": "Report delayed baggage at the airline baggage desk before leaving arrivals.",
        },
        {
            "id": "3",
            "title": "Weather cancellation",
            "content": "For an overnight weather cancellation, arrange one hotel night and ground transport.",
        },
    ]

    search_client = SearchClient(endpoint=endpoint, index_name=index_name, credential=credential)
    results = search_client.upload_documents(documents=documents)
    if not all(result.succeeded for result in results):
        raise RuntimeError("One or more classroom documents failed to upload.")

    print(f"Created '{index_name}' and uploaded {len(documents)} documents.")


if __name__ == "__main__":
    main()
