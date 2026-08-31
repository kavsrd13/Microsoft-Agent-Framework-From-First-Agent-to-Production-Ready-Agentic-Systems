import os

from azure.identity import AzureCliCredential, get_bearer_token_provider
from azure.search.documents.knowledgebases import KnowledgeBaseRetrievalClient
from azure.search.documents.knowledgebases.models import (
    KnowledgeBaseMessage,
    KnowledgeBaseMessageTextContent,
    KnowledgeBaseRetrievalRequest,
)
from dotenv import load_dotenv

load_dotenv()


def retrieve_as_signed_in_user(client: KnowledgeBaseRetrievalClient, user_token: str, question: str):
    request = KnowledgeBaseRetrievalRequest(
        messages=[
            KnowledgeBaseMessage(
                role="user",
                content=[KnowledgeBaseMessageTextContent(text=question)],
            )
        ]
    )
    # This is the documented query-time permission-enforcement parameter.
    return client.retrieve(
        retrieval_request=request,
            query_source_authorization=user_token,
    )


def response_text(result) -> str:
    return "\n\n".join(
        content.text for message in result.response for content in message.content
    )


def main() -> None:
    # Classroom: Azure CLI supplies both identities. In production, the service
    # credential and delegated end-user token are separate security principals.
    service_credential = AzureCliCredential()
    user_token_provider = get_bearer_token_provider(
        service_credential,
        "https://search.azure.com/.default",
    )
    user_token = user_token_provider()

    client = KnowledgeBaseRetrievalClient(
        endpoint=os.environ["AZURE_SEARCH_ENDPOINT"],
        knowledge_base_name=os.environ["AZURE_SEARCH_SECURE_KNOWLEDGE_BASE_NAME"],
        credential=service_credential,
    )

    allowed = retrieve_as_signed_in_user(
        client,
        user_token,
        "What is my classroom traveler assistance code?",
    )
    print("AUTHORIZED USER-SPECIFIC QUERY\n", response_text(allowed))

    denied = retrieve_as_signed_in_user(
        client,
        user_token,
        "What is the finance-only refund authorization code?",
    )
    print("\nUNAUTHORIZED FINANCE QUERY\n", response_text(denied))


if __name__ == "__main__":
    main()
