import asyncio
import os

from agent_framework import Agent
from agent_framework.openai import OpenAIChatClient
from dotenv import load_dotenv
from pydantic import BaseModel

load_dotenv()


class CityInfo(BaseModel):
    city: str
    country: str
    area: str
    population: int



async def main() -> None:
    agent = Agent(
        client=OpenAIChatClient(
            base_url=os.environ["AZURE_OPENAI_ENDPOINT"],
            api_key=os.environ["AZURE_OPENAI_API_KEY"],
            model=os.environ["AZURE_OPENAI_DEPLOYMENT"],
        ),
        name="CityAgent",
        instructions="Describe cities using the requested structured response format.",
    )

    result = await agent.run(
        "Tell me about Chennai.",
        options={"response_format": CityInfo},
    )


    print(f"City: {result.value.city}")
    print(" ")
    print(f"Country: {result.value.country}")
    print(" ")
    print(f"Area: {result.value.area}")
    print(" ")
    print(f"Population: {result.value.population}")




if __name__ == "__main__":
    asyncio.run(main())
