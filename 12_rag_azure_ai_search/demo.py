import asyncio
import os

from agent_framework import Agent
from agent_framework.azure import AzureAISearchContextProvider
from agent_framework.foundry import FoundryChatClient
from azure.identity.aio import AzureCliCredential
from dotenv import load_dotenv

load_dotenv()


async def main() -> None:
    search_key = os.environ.get("AZURE_SEARCH_API_KEY") or None

    async with AzureCliCredential() as credential:
        search_provider = AzureAISearchContextProvider(
            source_id="search_provider",
            endpoint=os.environ["AZURE_SEARCH_ENDPOINT"],
            index_name=os.environ["AZURE_SEARCH_INDEX_NAME"],
            api_key=search_key,
            credential=None if search_key else credential,
            mode="semantic",
            top_k=3,
        )

        async with (
            search_provider,
            Agent(
                client=FoundryChatClient(
                    project_endpoint=os.environ["FOUNDRY_PROJECT_ENDPOINT"],
                    model=os.environ["FOUNDRY_MODEL"],
                    credential=credential,
                ),
                name="SearchAgent",
                instructions=(
                    "Answer from the retrieved knowledge-base context. "
                    "If the context does not contain the answer, say so."
                ),
                context_providers=[search_provider],
            ) as agent,
        ):
            result = await agent.run("Summarize the main topics in the knowledge base.")
            print(result.text)


if __name__ == "__main__":
    asyncio.run(main())

