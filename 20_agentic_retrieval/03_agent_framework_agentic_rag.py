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
            source_id="agentic_travel_search",
            endpoint=os.environ["AZURE_SEARCH_ENDPOINT"],
            knowledge_base_name=os.environ["AZURE_SEARCH_AGENTIC_KNOWLEDGE_BASE_NAME"],
            credential=credential,
            mode="agentic",
            knowledge_base_output_mode="answer_synthesis",
            retrieval_reasoning_effort="low",
        )

        async with (
            search_provider,
            Agent(
                client=FoundryChatClient(
                    project_endpoint=os.environ["FOUNDRY_PROJECT_ENDPOINT"],
                    model=os.environ["FOUNDRY_MODEL"],
                    credential=credential,
                ),
                name="AgenticTravelAssistant",
                instructions=(
                    "Use the agentic retrieval context for fictional Contoso Travel questions. "
                    "Never invent policy details."
                ),
                context_providers=[search_provider],
            ) as agent,
        ):
            result = await agent.run(
                "Combine the Doha connection, overnight cancellation, and delayed-baggage guidance into one checklist."
            )
            print(result.text)


if __name__ == "__main__":
    asyncio.run(main())
