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
            source_id="identity_aware_search",
            endpoint=os.environ["AZURE_SEARCH_ENDPOINT"],
            knowledge_base_name=os.environ["AZURE_SEARCH_SECURE_KNOWLEDGE_BASE_NAME"],
            credential=credential,
            mode="agentic",
            knowledge_base_output_mode="answer_synthesis",
            retrieval_reasoning_effort="low",
            # Agent Framework forwards this user's Search-scoped token as
            # x-ms-query-source-authorization on every knowledge-base query.
            query_source_credential=credential,
        )

        async with (
            search_provider,
            Agent(
                client=FoundryChatClient(
                    project_endpoint=os.environ["FOUNDRY_PROJECT_ENDPOINT"],
                    model=os.environ["FOUNDRY_MODEL"],
                    credential=credential,
                ),
                name="IdentityAwareTravelAgent",
                instructions=(
                    "Answer only from authorized retrieved context. "
                    "If the answer is absent, say: No authorized document contains this answer."
                ),
                context_providers=[search_provider],
            ) as agent,
        ):
            print("AUTHORIZED QUESTION")
            allowed = await agent.run("What is my classroom traveler assistance code?")
            print(allowed.text)

            print("\nUNAUTHORIZED QUESTION")
            denied = await agent.run("What is the finance-only refund authorization code?")
            print(denied.text)


if __name__ == "__main__":
    asyncio.run(main())
