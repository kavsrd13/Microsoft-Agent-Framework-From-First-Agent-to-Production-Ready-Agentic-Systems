import asyncio
import os
from typing import Any

from agent_framework import Agent, AgentSession, ContextProvider, SessionContext
from agent_framework.foundry import FoundryChatClient
from azure.identity import AzureCliCredential
from dotenv import load_dotenv

load_dotenv()


class UserMemoryProvider(ContextProvider):
    """Store a name in provider-owned session state and inject it before later runs."""

    DEFAULT_SOURCE_ID = "user_memory"

    def __init__(self) -> None:
        super().__init__(self.DEFAULT_SOURCE_ID)

    async def before_run(
        self,
        *,
        agent: Any,
        session: AgentSession | None,
        context: SessionContext,
        state: dict[str, Any],
    ) -> None:
        user_name = state.get("user_name")
        instruction = (
            f"The user's name is {user_name}. Address them by name."
            if user_name
            else "You do not know the user's name yet. Ask for it politely."
        )
        context.extend_instructions(self.source_id, instruction)

    async def after_run(
        self,
        *,
        agent: Any,
        session: AgentSession | None,
        context: SessionContext,
        state: dict[str, Any],
    ) -> None:
        for message in context.input_messages:
            text = message.text or ""
            if "my name is" in text.lower():
                state["user_name"] = text.lower().split("my name is", 1)[1].strip().split()[0].capitalize()


async def main() -> None:
    agent = Agent(
        client=FoundryChatClient(
            project_endpoint=os.environ["FOUNDRY_PROJECT_ENDPOINT"],
            model=os.environ["FOUNDRY_MODEL"],
            credential=AzureCliCredential(),
        ),
        name="ContextAgent",
        instructions="You are a friendly assistant.",
        context_providers=[UserMemoryProvider()],
    )
    session = agent.create_session()

    print((await agent.run("Hello. My name is Alice.", session=session)).text)
    print((await agent.run("What is 2 + 2?", session=session)).text)
    print("Provider state:", session.state["user_memory"])


if __name__ == "__main__":
    asyncio.run(main())

