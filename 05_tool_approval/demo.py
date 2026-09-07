import asyncio
import os
from typing import Annotated

from agent_framework import Agent, Message, ToolApprovalMiddleware, tool
from agent_framework.openai import OpenAIChatClient
from dotenv import load_dotenv

load_dotenv()


@tool(approval_mode="always_require")
def add_to_calendar(
    event_name: Annotated[str, "Name of the event"],
    date: Annotated[str, "Date of the event"],
) -> str:
    """Add an event to the calendar or create a meeting in calendar whenevr asked by user."""
    print(f">>> EXECUTING add_to_calendar('{event_name}', '{date}')")
    return f"Added '{event_name}' to the calendar on {date}."


@tool
def get_current_date_info() -> str:
    """Return today's date details to help with scheduling."""
    from datetime import datetime

    now = datetime.now()
    print(
        f">>> EXECUTING get_current_date_info() -> {now.strftime('%A, %B %d, %Y')}"
    )
    return f"Today is {now.strftime('%A, %B %d, %Y')}."


async def main() -> None:
    agent = Agent(
        client=OpenAIChatClient(
            base_url=os.environ["AZURE_OPENAI_ENDPOINT"],
            api_key=os.environ["AZURE_OPENAI_API_KEY"],
            model=os.environ["AZURE_OPENAI_DEPLOYMENT"],
        ),
        name="CalendarAgent",
        instructions="You are a helpful assistant.",
        tools=[add_to_calendar, get_current_date_info],
        middleware=[ToolApprovalMiddleware()],
    )
    session = agent.create_session()
    user_prompt = input("Enter your request: ").strip()
    result = await agent.run(user_prompt, session=session)

    while result.user_input_requests:
        approval_responses = []
        for request in result.user_input_requests:
            if request.function_call is None:
                continue
            print(f"Approval needed for: {request.function_call.name}")
            print(f"Arguments: {request.function_call.arguments}")
            approved = input("Approve tool call? (y/n): ").strip().lower() == "y"
            approval_responses.append(request.to_function_approval_response(approved=approved))

        result = await agent.run(Message(role="user", contents=approval_responses), session=session)

    print(f"Agent: {result.text}")


if __name__ == "__main__":
    asyncio.run(main())
