import asyncio
import os

from agent_framework.foundry import FoundryChatClient
from azure.identity import AzureCliCredential
from dotenv import load_dotenv

load_dotenv()


async def main() -> None:
    # Explicit settings make the Foundry endpoint, model, and credential visible in a classroom demo.
    client = FoundryChatClient(
        project_endpoint=os.environ["FOUNDRY_PROJECT_ENDPOINT"],
        model=os.environ["FOUNDRY_MODEL"],
        credential=AzureCliCredential(),
    )

    # Every supported chat client can create the standard Agent abstraction.
    agent = client.as_agent(
        name="ClientDemoAgent",
        instructions="You are a helpful assistant. Answer in one short sentence.",
    )
    result = await agent.run("What is Microsoft Agent Framework?")
    print(result.text)


if __name__ == "__main__":
    asyncio.run(main())

