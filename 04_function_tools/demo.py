import asyncio
import os
from typing import Annotated

from agent_framework import Agent, tool
from agent_framework.foundry import FoundryChatClient
from azure.identity import AzureCliCredential
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
        client=FoundryChatClient(
            project_endpoint=os.environ["FOUNDRY_PROJECT_ENDPOINT"],
            model=os.environ["FOUNDRY_MODEL"],
            credential=AzureCliCredential(),
        ),
        name="WeatherAgent",
        instructions="Use the weather tool to answer weather questions.",
        tools=[get_weather],
    )

    result = await agent.run("What is the weather in Bengaluru?")
    print(result.text)


if __name__ == "__main__":
    asyncio.run(main())

