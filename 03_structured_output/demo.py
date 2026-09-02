import asyncio
import os

from agent_framework import Agent
from agent_framework.foundry import FoundryChatClient
from azure.identity import AzureCliCredential
from dotenv import load_dotenv
from pydantic import BaseModel

load_dotenv()


class CityInfo(BaseModel):
    city: str
    country: str
    summary: str


async def main() -> None:
    agent = Agent(
        client=FoundryChatClient(
            project_endpoint=os.environ["FOUNDRY_PROJECT_ENDPOINT"],
            model=os.environ["FOUNDRY_MODEL"],
            credential=AzureCliCredential(),
        ),
        name="CityAgent",
        instructions="Describe cities using the requested structured response format.",
    )

    result = await agent.run(
        "Tell me about Paris, France.",
        options={"response_format": CityInfo},
    )


    print(f"City: {result.value.city}")
    print(" ")
    print(f"Country: {result.value.country}")
    print(" ")
    print(f"Summary: {result.value.summary}")



if __name__ == "__main__":
    asyncio.run(main())

