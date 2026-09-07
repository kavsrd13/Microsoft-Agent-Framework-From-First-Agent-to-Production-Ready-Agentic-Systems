import asyncio
import os
import sys

from agent_framework import Agent, AgentResponse
from agent_framework.openai import OpenAIChatClient
from agent_framework.orchestrations import ConcurrentBuilder
from dotenv import load_dotenv

load_dotenv()

if hasattr(sys.stdout, "reconfigure"):
    sys.stdout.reconfigure(encoding="utf-8", errors="replace")


async def main() -> None:
    client = OpenAIChatClient(
        base_url=os.environ["AZURE_OPENAI_ENDPOINT"],
        api_key=os.environ["AZURE_OPENAI_API_KEY"],
        model=os.environ["AZURE_OPENAI_DEPLOYMENT"],
    )
    participants = [
        Agent(client=client, name="researcher", instructions="Identify factual opportunities and risks."),
        Agent(client=client, name="marketer", instructions="Suggest a value proposition and target message."),
        Agent(client=client, name="reviewer", instructions="Identify compliance and customer-safety concerns."),
    ]

    workflow_instance = ConcurrentBuilder(participants=participants).build()
    result = await workflow_instance.run("Launch a budget-friendly electric bike for urban commuters.")

    for output in result.get_outputs():
        if isinstance(output, AgentResponse):
            for message in output.messages:
                print(f"\n[{message.author_name or 'assistant'}]\n{message.text}")


if __name__ == "__main__":
    asyncio.run(main())
