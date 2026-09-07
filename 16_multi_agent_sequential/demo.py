import asyncio
import os
from typing import cast

from agent_framework import Agent, AgentResponse, Message
from agent_framework.openai import OpenAIChatClient
from agent_framework.orchestrations import SequentialBuilder
from dotenv import load_dotenv

load_dotenv()


async def main() -> None:
    client = OpenAIChatClient(
        base_url=os.environ["AZURE_OPENAI_ENDPOINT"],
        api_key=os.environ["AZURE_OPENAI_API_KEY"],
        model=os.environ["AZURE_OPENAI_DEPLOYMENT"],
    )
    writer = Agent(
        client=client,
        name="writer",
        instructions="Write one punchy marketing sentence from the user's prompt.",
    )
    reviewer = Agent(
        client=client,
        name="reviewer",
        instructions="Give brief, practical feedback on the previous assistant message.",
    )

    workflow_instance = SequentialBuilder(participants=[writer, reviewer], output_from="all").build()
    prompt = "Write a tagline for a budget-friendly eBike."
    result = await workflow_instance.run(prompt)

    conversation = [Message(role="user", contents=[prompt])]
    for output in result.get_outputs():
        conversation.extend(cast(AgentResponse, output).messages)

    for message in conversation:
        print(f"[{message.author_name or message.role}] {message.text}")


if __name__ == "__main__":
    asyncio.run(main())
