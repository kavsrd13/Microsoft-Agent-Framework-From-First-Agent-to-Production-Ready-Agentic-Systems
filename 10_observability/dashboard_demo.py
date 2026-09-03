import asyncio
import json
import os
import time
import webbrowser
from datetime import datetime, timezone
from pathlib import Path
from typing import Annotated

from agent_framework import Agent, tool
from agent_framework.foundry import FoundryChatClient
from agent_framework.observability import configure_otel_providers, get_tracer
from azure.identity import AzureCliCredential
from dotenv import load_dotenv
from opentelemetry import trace
from opentelemetry.sdk.trace.export.in_memory_span_exporter import InMemorySpanExporter
from opentelemetry.trace import SpanKind
from opentelemetry.trace.span import format_span_id, format_trace_id

load_dotenv()


@tool(approval_mode="never_require")
def check_service_health(service: Annotated[str, "Service name"]) -> str:
    """Return the classroom status of a service."""
    return f"{service} is operational. No active incidents."


def token_count(usage: dict, name: str) -> int:
    value = usage.get(name, 0)
    return value if isinstance(value, int) else 0


async def main() -> None:
    # Keep spans in memory so the demo can turn this run into a local dashboard.
    span_exporter = InMemorySpanExporter()
    configure_otel_providers(
        enable_sensitive_data=False,
        enable_console_exporters=False,
        exporters=[span_exporter],
    )

    agent = Agent(
        client=FoundryChatClient(
            project_endpoint=os.environ["FOUNDRY_PROJECT_ENDPOINT"],
            model=os.environ["FOUNDRY_MODEL"],
            credential=AzureCliCredential(),
        ),
        name="OperationsAgent",
        instructions=(
            "Use check_service_health for service-status questions. "
            "Give concise updates suitable for an operations team."
        ),
        tools=[check_service_health],
    )

    scenarios = [
        ("Service health", "Check the payment service and give a one-line status update."),
        ("Customer update", "Write a two-sentence customer update about the payment service status."),
        ("Telemetry lesson", "Explain why latency and token usage are useful agent metrics."),
    ]

    runs = []
    with get_tracer().start_as_current_span("classroom-dashboard-session", kind=SpanKind.CLIENT):
        for label, prompt in scenarios:
            started = time.perf_counter()
            try:
                result = await agent.run(prompt)
                usage = result.usage_details or {}
                prompt_tokens = token_count(usage, "prompt_token_count") or token_count(usage, "input_token_count")
                input_tokens = token_count(usage, "input_token_count")
                output_tokens = token_count(usage, "output_token_count")
                total_tokens = token_count(usage, "total_token_count")
                runs.append(
                    {
                        "label": label,
                        "success": True,
                        "latency_ms": round((time.perf_counter() - started) * 1000, 1),
                        "prompt_tokens": prompt_tokens,
                        "input_tokens": input_tokens,
                        "output_tokens": output_tokens,
                        "total_tokens": total_tokens,
                        "error_type": "",
                    }
                )
                print(f"\n{label}: {result.text}")
                print(
                    f"  tokens -> prompt: {prompt_tokens}, input: {input_tokens}, "
                    f"output: {output_tokens}, total: {total_tokens}"
                )
            except Exception as error:
                runs.append(
                    {
                        "label": label,
                        "success": False,
                        "latency_ms": round((time.perf_counter() - started) * 1000, 1),
                        "prompt_tokens": 0,
                        "input_tokens": 0,
                        "output_tokens": 0,
                        "total_tokens": 0,
                        "error_type": type(error).__name__,
                    }
                )
                print(f"\n{label}: failed with {type(error).__name__}")

    trace.get_tracer_provider().force_flush()
    spans = []
    for span in span_exporter.get_finished_spans():
        spans.append(
            {
                "name": span.name,
                "duration_ms": round((span.end_time - span.start_time) / 1_000_000, 1),
                "status": span.status.status_code.name,
                "trace_id": format_trace_id(span.context.trace_id),
                "span_id": format_span_id(span.context.span_id),
            }
        )

    payload = {
        "generated_at": datetime.now(timezone.utc).isoformat(),
        "service_name": os.getenv("OTEL_SERVICE_NAME", "agent-framework-course-demos"),
        "source": "Actual telemetry from this local dashboard_demo.py run",
        "runs": runs,
        "spans": spans,
    }

    folder = Path(__file__).parent
    (folder / "telemetry.json").write_text(json.dumps(payload, indent=2), encoding="utf-8")
    template = (folder / "dashboard_template.html").read_text(encoding="utf-8")
    dashboard = template.replace("__TELEMETRY_DATA__", json.dumps(payload))
    output = folder / "agent_metrics_dashboard.html"
    output.write_text(dashboard, encoding="utf-8")
    print(f"\nDashboard created: {output.resolve()}")
    webbrowser.open(output.resolve().as_uri())


if __name__ == "__main__":
    asyncio.run(main())
