import asyncio
import os
import sys
from typing import Annotated

from agent_framework import Agent, tool
from agent_framework.foundry import FoundryChatClient
from agent_framework.observability import configure_otel_providers, get_tracer
from azure.identity import AzureCliCredential
from dotenv import load_dotenv
from opentelemetry.trace import SpanKind
from opentelemetry.trace.span import format_trace_id

load_dotenv()

if hasattr(sys.stdout, "reconfigure"):
    sys.stdout.reconfigure(encoding="utf-8", errors="replace")


@tool(approval_mode="never_require")
def check_service_health(service: Annotated[str, "Service name"]) -> str:
    """Return the classroom status of a service."""
    return f"{service} is operational. No active incidents."


async def main() -> None:
    # Console exporters keep the first observability demo self-contained.
    configure_otel_providers(enable_console_exporters=True)

    agent = Agent(
        client=FoundryChatClient(
            project_endpoint=os.environ["FOUNDRY_PROJECT_ENDPOINT"],
            model=os.environ["FOUNDRY_MODEL"],
            credential=AzureCliCredential(),
        ),
        name="ObservedAgent",
        instructions="Use check_service_health for status questions. Keep answers brief.",
        tools=[check_service_health],
    )

    with get_tracer().start_as_current_span("classroom-agent-demo", kind=SpanKind.CLIENT) as span:
        print(f"Trace ID: {format_trace_id(span.get_span_context().trace_id)}")
        result = await agent.run(
            "Check the payment service and explain in one sentence why tracing helps support teams."
        )
        print(result.text)


if __name__ == "__main__":
    asyncio.run(main())
