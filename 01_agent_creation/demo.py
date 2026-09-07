import asyncio
import os

from agent_framework import Agent
from agent_framework.openai import OpenAIChatClient
from dotenv import load_dotenv

load_dotenv()


async def main() -> None:
    client = OpenAIChatClient(
        base_url=os.environ["AZURE_OPENAI_ENDPOINT"],
        api_key=os.environ["AZURE_OPENAI_API_KEY"],
        model=os.environ["AZURE_OPENAI_DEPLOYMENT"],
    )

    agent = Agent(
        client=client,
        name="HelloAgent",
        instructions="You are a friendly assistant. Keep your answers in detail.",
    )

    result = await agent.run("What is the capital of France?")
    print(f"Agent: {result}")
if __name__ == "__main__":
    asyncio.run(main())
