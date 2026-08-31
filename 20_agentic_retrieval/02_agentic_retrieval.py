import json
import os

from azure.identity import AzureCliCredential
from azure.search.documents.knowledgebases import KnowledgeBaseRetrievalClient
from azure.search.documents.knowledgebases.models import (
    KnowledgeBaseMessage,
    KnowledgeBaseMessageTextContent,
    KnowledgeBaseRetrievalRequest,
    KnowledgeRetrievalLowReasoningEffort,
    SearchIndexKnowledgeSourceParams,
)
from dotenv import load_dotenv

load_dotenv()


def retrieve(client: KnowledgeBaseRetrievalClient, messages: list[dict[str, str]]):
    request = KnowledgeBaseRetrievalRequest(
        messages=[
            KnowledgeBaseMessage(
                role=message["role"],
                content=[KnowledgeBaseMessageTextContent(text=message["content"])],
            )
            for message in messages
            if message["role"] != "system"
        ],
        knowledge_source_params=[
            SearchIndexKnowledgeSourceParams(
                knowledge_source_name=os.environ["AZURE_SEARCH_AGENTIC_KNOWLEDGE_SOURCE_NAME"],
                include_references=True,
                include_reference_source_data=True,
                always_query_source=True,
            )
        ],
        include_activity=True,
        retrieval_reasoning_effort=KnowledgeRetrievalLowReasoningEffort(),
    )
    return client.retrieve(retrieval_request=request)


def print_result(result) -> str:
    response_text = "\n\n".join(
        content.text for message in result.response for content in message.content
    )
    print("\nANSWER\n", response_text)
    print("\nQUERY PLANNING AND SEARCH ACTIVITY")
    print(json.dumps([activity.as_dict() for activity in result.activity or []], indent=2))
    print("\nREFERENCES")
    print(json.dumps([reference.as_dict() for reference in result.references or []], indent=2))
    return response_text


def main() -> None:
    credential = AzureCliCredential()
    client = KnowledgeBaseRetrievalClient(
        endpoint=os.environ["AZURE_SEARCH_ENDPOINT"],
        knowledge_base_name=os.environ["AZURE_SEARCH_AGENTIC_KNOWLEDGE_BASE_NAME"],
        credential=credential,
    )

    messages = [
        {
            "role": "user",
            "content": (
                "My fictional Mumbai-to-Paris trip connects in Doha. The flight is cancelled "
                "overnight because of weather and my bag is delayed. What should the agent "
                "arrange, and what timing applies?"
            ),
        }
    ]
    first_response = print_result(retrieve(client, messages))

    # Conversation history lets the knowledge base interpret this follow-up.
    messages.append({"role": "assistant", "content": first_response})
    messages.append({"role": "user", "content": "Where do I report the bag in Paris?"})
    print_result(retrieve(client, messages))


if __name__ == "__main__":
    main()
