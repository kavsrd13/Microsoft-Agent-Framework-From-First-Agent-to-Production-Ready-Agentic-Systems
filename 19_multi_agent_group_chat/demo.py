import asyncio
import os
from typing import cast

from agent_framework import Agent, Message
from agent_framework.foundry import FoundryChatClient
from agent_framework.orchestrations import GroupChatBuilder, GroupChatState
from azure.identity import AzureCliCredential
from dotenv import load_dotenv

load_dotenv()


def round_robin_selector(state: GroupChatState) -> str:
    participant_names = list(state.participants.keys())
    return participant_names[state.current_round % len(participant_names)]


async def main() -> None:
    client = FoundryChatClient(
        project_endpoint=os.environ["FOUNDRY_PROJECT_ENDPOINT"],
        model=os.environ["FOUNDRY_MODEL"],
        credential=AzureCliCredential(),
    )
    expert = Agent(
        client=client,
        name="PythonExpert",
        instructions="Answer the Python question, then improve your answer using peer feedback.",
    )
    verifier = Agent(
        client=client,
        name="Verifier",
        instructions="Review the expert's answer for technically correct but risky advice.",
    )
    clarifier = Agent(
        client=client,
        name="Clarifier",
        instructions="Identify jargon and suggest a clearer beginner explanation.",
    )

    workflow_instance = GroupChatBuilder(
        participants=[expert, verifier, clarifier],
        selection_func=round_robin_selector,
        termination_condition=lambda conversation: len(conversation) >= 5,
    ).build()

    result = await workflow_instance.run("How does a Python Protocol differ from an abstract base class?")
    for output in result.get_outputs():
        if isinstance(output, list):
            for message in cast(list[Message], output):
                print(f"\n[{message.author_name or message.role}]\n{message.text}")


if __name__ == "__main__":
    asyncio.run(main())

