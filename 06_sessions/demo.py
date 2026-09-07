import asyncio
import os

from agent_framework import Agent
from agent_framework.openai import OpenAIChatClient
from dotenv import load_dotenv

load_dotenv()


async def main() -> None:
    agent = Agent(
        client=OpenAIChatClient(
            base_url=os.environ["AZURE_OPENAI_ENDPOINT"],
            api_key=os.environ["AZURE_OPENAI_API_KEY"],
            model=os.environ["AZURE_OPENAI_DEPLOYMENT"],
        ),
        name="ConversationAgent",
        instructions="You are a friendly assistant. Keep answers brief.",
    )

    session = agent.create_session()
    first = await agent.run("My name is Alice and I love hiking.", session=session)
    print(f"Agent: {first.text}")

    second = await agent.run("What do you remember about me?", session=session)
    print(f"Agent: {second.text}")



if __name__ == "__main__":
    asyncio.run(main())
