import asyncio
import os

from agent_framework import Agent
from agent_framework.foundry import FoundryChatClient
from azure.identity import AzureCliCredential
from dotenv import load_dotenv

load_dotenv()


async def main() -> None:
    client = FoundryChatClient(
        project_endpoint=os.environ["FOUNDRY_PROJECT_ENDPOINT"],
        model=os.environ["FOUNDRY_MODEL"],
        credential=AzureCliCredential(),
    )

    agent = Agent(
        client=client,
        name="HelloAgent",
        instructions="You are a friendly assistant. Keep your answers in detail.",
    )

    result = await agent.run("What is the capital of France?")
    print(f"Agent: {result.text}")


if __name__ == "__main__":
    asyncio.run(main())

