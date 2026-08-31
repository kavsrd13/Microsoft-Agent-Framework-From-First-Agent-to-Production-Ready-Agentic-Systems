# Foundry and Gemini chat clients

`demo.py` creates `FoundryChatClient` with an explicit project endpoint, model deployment, and `AzureCliCredential()`.

Run `az login`, configure the two `FOUNDRY_*` variables in the project `.env`, then run `demo.py`.

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

Sources: [Agent types and clients](https://learn.microsoft.com/en-us/agent-framework/agents/), [official Foundry provider samples](https://github.com/microsoft/agent-framework/tree/main/python/samples/02-agents/providers/foundry), [Google Gemini integration](https://learn.microsoft.com/en-us/agent-framework/integrations/by-component/model-providers/google-gemini).
