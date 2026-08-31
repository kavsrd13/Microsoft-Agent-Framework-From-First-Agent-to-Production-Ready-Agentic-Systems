import asyncio
import os
from typing import Annotated

from agent_framework import Agent, Message, tool
from agent_framework.foundry import FoundryChatClient
from azure.identity import AzureCliCredential
from dotenv import load_dotenv

load_dotenv()


@tool(approval_mode="always_require")
def add_to_calendar(
    event_name: Annotated[str, "Name of the event"],
    date: Annotated[str, "Date of the event"],
) -> str:
    """Add an event to the calendar."""
    print(f">>> EXECUTING add_to_calendar('{event_name}', '{date}')")
    return f"Added '{event_name}' to the calendar on {date}."


async def main() -> None:
    agent = Agent(
        client=FoundryChatClient(
            project_endpoint=os.environ["FOUNDRY_PROJECT_ENDPOINT"],
            model=os.environ["FOUNDRY_MODEL"],
            credential=AzureCliCredential(),
        ),
        name="CalendarAgent",
        instructions="You are a helpful calendar assistant.",
        tools=[add_to_calendar],
    )
    session = agent.create_session()
    result = await agent.run("Add a dentist appointment on September 15.", session=session)

    while result.user_input_requests:
        request = result.user_input_requests[0]
        if request.function_call is None:
            break

        print(f"Approval required for: {request.function_call.name}")
        print(f"Arguments: {request.function_call.arguments}")
        decision = await asyncio.to_thread(input, "Approve? (y/n): ")
        response = request.to_function_approval_response(decision.strip().lower() == "y")
        result = await agent.run(Message("user", [response]), session=session)

    print(f"Agent: {result.text}")


if __name__ == "__main__":
    asyncio.run(main())

