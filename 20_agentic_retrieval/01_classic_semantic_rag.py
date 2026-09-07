import asyncio
import os

from agent_framework import Agent
from agent_framework.azure import AzureAISearchContextProvider
from agent_framework.openai import OpenAIChatClient
from dotenv import load_dotenv

load_dotenv()


async def main() -> None:
    search_provider = AzureAISearchContextProvider(
        source_id="travel_search",
        endpoint=os.environ["AZURE_SEARCH_ENDPOINT"],
        index_name=os.environ["AZURE_SEARCH_AGENTIC_INDEX_NAME"],
        api_key=os.environ["AZURE_SEARCH_API_KEY"],
        mode="semantic",
        top_k=3,
    )

    async with (
        search_provider,
        Agent(
            client=OpenAIChatClient(
                base_url=os.environ["AZURE_OPENAI_ENDPOINT"],
                api_key=os.environ["AZURE_OPENAI_API_KEY"],
                model=os.environ["AZURE_OPENAI_DEPLOYMENT"],
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
