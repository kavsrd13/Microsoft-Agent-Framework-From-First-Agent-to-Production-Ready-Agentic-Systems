import asyncio
import os
from pathlib import Path

from agent_framework import Agent, FileMemoryProvider, FileSystemAgentFileStore
from agent_framework.foundry import FoundryChatClient
from azure.identity import AzureCliCredential
from dotenv import load_dotenv

load_dotenv()

USER_ID = "classroom-user-1"


async def main() -> None:
    client = FoundryChatClient(
        project_endpoint=os.environ["FOUNDRY_PROJECT_ENDPOINT"],
        model=os.environ["FOUNDRY_MODEL"],
        credential=AzureCliCredential(),
    )

    memory_root = Path(__file__).parent / "agent-file-memory"
    store = FileSystemAgentFileStore(memory_root)
    memory = FileMemoryProvider(store, scope=f"users/{USER_ID}")

    agent = Agent(
        client=client,
        name="TravelAssistant",
        instructions=(
            "You are a travel assistant. Remember useful preferences with the file-memory tools "
            "and recall them when making later recommendations."
        ),
        context_providers=[memory],
    )

    first_session = agent.create_session()
    print("=== First session ===")
    print(
        (await agent.run(
            "I am vegetarian and travel with my dog. Remember this for future trips.",
            session=first_session,
        )).text
    )

    second_session = agent.create_session()
    print("\n=== New session, same memory scope ===")
    print(
        (await agent.run(
            "Recommend a restaurant and hotel for Paris.",
            session=second_session,
        )).text
    )
    print(f"\nMemory folder: {memory_root / 'users' / USER_ID}")


if __name__ == "__main__":
    asyncio.run(main())

