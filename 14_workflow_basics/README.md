# Functional workflow with agents

Calls two Azure OpenAI-backed agents from a plain `@workflow`. Each model call is an `@step`, so its result can be reused during resume/checkpoint scenarios instead of paying for the call again.

Source: [Functional Workflow API](https://learn.microsoft.com/en-us/agent-framework/workflows/functional), [official agent-integration sample](https://github.com/microsoft/agent-framework/blob/main/python/samples/03-workflows/functional/agent_integration.py).
