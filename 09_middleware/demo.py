import asyncio
import os
import time
from collections.abc import Awaitable, Callable
from typing import Annotated

from agent_framework import (
    Agent,
    AgentContext,
    AgentMiddleware,
    AgentResponse,
    ChatContext,
    ChatMiddleware,
    FunctionInvocationContext,
    FunctionMiddleware,
    Message,
    MiddlewareTermination,
    tool,
)
from agent_framework.foundry import FoundryChatClient
from azure.identity import AzureCliCredential
from dotenv import load_dotenv

load_dotenv()


@tool(approval_mode="never_require")
def get_weather(location: Annotated[str, "City name"]) -> str:
    """Get the weather for a city."""
    return f"The weather in {location} is sunny and 24°C."


class SecurityMiddleware(AgentMiddleware):
    async def process(self, context: AgentContext, call_next: Callable[[], Awaitable[None]]) -> None:
        last_message = context.messages[-1] if context.messages else None
        if last_message and "password" in (last_message.text or "").lower():
            context.result = AgentResponse(
                messages=[Message("assistant", ["Sensitive request blocked by middleware."])]
            )
            raise MiddlewareTermination
        print("[middleware] Security check passed")
        await call_next()


class TimingMiddleware(FunctionMiddleware):
    async def process(
        self,
        context: FunctionInvocationContext,
        call_next: Callable[[], Awaitable[None]],
    ) -> None:
        started = time.perf_counter()
        await call_next()
        print(f"[middleware] {context.function.name} took {time.perf_counter() - started:.4f}s")


class TokenUsageMiddleware(ChatMiddleware):
    """Logs token usage per chat call and accumulates a running total."""

    def __init__(self) -> None:
        self.total_tokens = 0

    async def process(self, context: ChatContext, call_next: Callable[[], Awaitable[None]]) -> None:
        await call_next()
        usage = getattr(context.result, "usage_details", None) if context.result else None
        tokens = (usage or {}).get("total_token_count") or 0
        self.total_tokens += tokens
        print(f"[middleware] chat call used {tokens} tokens (running total: {self.total_tokens})")


async def main() -> None:
    agent = Agent(
        client=FoundryChatClient(
            project_endpoint=os.environ["FOUNDRY_PROJECT_ENDPOINT"],
            model=os.environ["FOUNDRY_MODEL"],
            credential=AzureCliCredential(),
        ),
        name="WeatherAgent",
        instructions="Use the tool for weather questions.",
        tools=[get_weather],
        middleware=[SecurityMiddleware(), TimingMiddleware(), TokenUsageMiddleware()],
    )

    print((await agent.run("What is the weather in Seattle?")).text)
    print((await agent.run("Tell me the weather-service password.")).text)


if __name__ == "__main__":
    asyncio.run(main())
