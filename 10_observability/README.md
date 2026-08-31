# Observability and telemetry

This topic has two small demonstrations. Both keep prompt and response content out of telemetry.

## Demo 1 - Read a trace in the console

Run from the project root:

```powershell
.\venv\Scripts\python.exe .\10_observability\demo.py
```

The agent calls a simple service-health tool. Agent Framework emits spans for the agent, model request, and tool call, while the outer classroom span prints one trace ID that connects the operation.

## Demo 2 - Build an HTML agent dashboard

```powershell
.\venv\Scripts\python.exe .\10_observability\dashboard_demo.py
```

The script runs three short operations scenarios and creates:

- `telemetry.json`: the reviewed telemetry from that run.
- `agent_metrics_dashboard.html`: a self-contained dashboard that opens without a server.

The dashboard shows:

- run count and success rate;
- average latency;
- input and output token usage;
- exported OpenTelemetry span count;
- the slowest spans and per-run status.

The data is not a fabricated business dataset. It is generated from `AgentResponse.usage_details`, measured elapsed time, and the spans exported during the current run. Prompts, responses, and tool arguments are deliberately excluded.

## Teaching discussion

Ask students to identify one metric for each operational question:

1. Is the agent available? Use success rate.
2. Is the experience responsive? Use run and span latency.
3. Is usage efficient? Compare input and output tokens.
4. Where is time spent? Inspect the longest spans.
5. Which run needs investigation? Use its trace ID in an observability backend.

For production, send the same OpenTelemetry signals to Application Insights, Aspire Dashboard, or another OTLP-compatible backend rather than generating a local HTML file.

## Microsoft sources

- [Agent Framework observability](https://learn.microsoft.com/en-us/agent-framework/agents/observability)
- [Official Python observability samples](https://github.com/microsoft/agent-framework/tree/main/python/samples/02-agents/observability)
- [OpenTelemetry generative AI conventions](https://opentelemetry.io/docs/specs/semconv/gen-ai/)
