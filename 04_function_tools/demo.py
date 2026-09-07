import asyncio
import os
from typing import Annotated

from agent_framework import Agent, tool
from agent_framework.openai import OpenAIChatClient
from dotenv import load_dotenv
from pydantic import Field

load_dotenv()


@tool(approval_mode="never_require")
def get_weather(
    location: Annotated[str, Field(description="The city whose weather is requested.")],
) -> str:
    """Get the weather for a location."""
    return f"The weather in {location} is sunny with a high of 24°C."


async def main() -> None:
    agent = Agent(
        client=OpenAIChatClient(
            base_url=os.environ["AZURE_OPENAI_ENDPOINT"],
            api_key=os.environ["AZURE_OPENAI_API_KEY"],
            model=os.environ["AZURE_OPENAI_DEPLOYMENT"],
        ),
        name="WeatherAgent",
        instructions="Use the weather tool to answer weather questions.",
        tools=[get_weather],
    )

    result = await agent.run("What is the weather in Mumbai?")
    print(result.text)


if __name__ == "__main__":
    asyncio.run(main())
