import asyncio
import os

from agent_framework import Agent
from agent_framework.foundry import FoundryChatClient
from azure.identity import AzureCliCredential
from dotenv import load_dotenv

load_dotenv()


async def main() -> None:
    agent = Agent(
        client=FoundryChatClient(
            project_endpoint=os.environ["FOUNDRY_PROJECT_ENDPOINT"],
            model=os.environ["FOUNDRY_MODEL"],
            credential=AzureCliCredential(),
        ),
        name="StreamingAgent",
        instructions="You are a friendly assistant. Keep your answers brief.",
    )

    print("Agent: ", end="", flush=True)
    async for update in agent.run("Tell me a one-sentence fun fact.", stream=True):
        if update.text:
            print(update.text, end="", flush=True)
    print()


if __name__ == "__main__":
    asyncio.run(main())

