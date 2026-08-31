import asyncio
import os

from agent_framework import Agent
from agent_framework.azure import AzureAISearchContextProvider
from agent_framework.foundry import FoundryChatClient
from azure.identity.aio import AzureCliCredential
from dotenv import load_dotenv

load_dotenv()


async def main() -> None:
    async with AzureCliCredential() as credential:
        search_provider = AzureAISearchContextProvider(
            source_id="travel_search",
            endpoint=os.environ["AZURE_SEARCH_ENDPOINT"],
            index_name=os.environ["AZURE_SEARCH_AGENTIC_INDEX_NAME"],
            credential=credential,
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
                name="ClassicRAGAgent",
                instructions=(
                    "Answer only from retrieved fictional travel context. "
                    "Say 'I don't know' when the context is insufficient."
                ),
                context_providers=[search_provider],
            ) as agent,
        ):
            result = await agent.run(
                "For a Mumbai-to-Paris connection in Doha, how long is the terminal transfer?"
            )
            print(result.text)


if __name__ == "__main__":
    asyncio.run(main())
