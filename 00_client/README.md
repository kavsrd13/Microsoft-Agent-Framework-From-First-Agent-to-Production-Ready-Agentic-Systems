# Create, run, and stream your first agent

The first participant lab now combines the original client, first-agent, and streaming exercises into one coherent introduction:

1. `01_agent_creation/demo.py` creates `FoundryChatClient` with an explicit project endpoint, deployment name, and `AzureCliCredential()`, then creates and runs an `Agent`.
2. `02_streaming/demo.py` uses the same Foundry configuration and streams response updates with `async for`.
3. `gemini_demo.py` is an optional provider-comparison exercise using `GeminiChatClient` and an API key stored in `.env`.

Run `az login`, configure the `FOUNDRY_*` variables in the project `.env`, and complete the Foundry parts before the optional Gemini comparison.

`gemini_demo.py` creates `GeminiChatClient` for the Gemini Developer API using an API key:

```text
GEMINI_API_KEY=your-google-ai-studio-key
GEMINI_MODEL=gemini-2.5-flash
```

Run it from the project root:

```powershell
.\venv\Scripts\python.exe .\00_client\gemini_demo.py
```

The API key stays in the git-ignored `.env` file and is never printed by the demo.

Sources: [Agent types and clients](https://learn.microsoft.com/en-us/agent-framework/agents/), [create your first agent](https://learn.microsoft.com/en-us/agent-framework/get-started/your-first-agent), [running and streaming agents](https://learn.microsoft.com/en-us/agent-framework/agents/running-agents), [official Foundry provider samples](https://github.com/microsoft/agent-framework/tree/main/python/samples/02-agents/providers/foundry), [Google Gemini integration](https://learn.microsoft.com/en-us/agent-framework/integrations/by-component/model-providers/google-gemini).
