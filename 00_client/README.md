# Create, run, and stream your first agent

The first participant lab now combines the original client, first-agent, and streaming exercises into one coherent introduction:

1. `01_agent_creation/demo.py` creates `OpenAIChatClient` with an Azure OpenAI v1 endpoint, deployment name, and API key from `.env`, then creates and runs an `Agent`.
2. `02_streaming/demo.py` uses the same Azure OpenAI configuration and streams response updates with `async for`.
3. `gemini_demo.py` is an optional provider-comparison exercise using `GeminiChatClient` and an API key stored in `.env`.

Configure `AZURE_OPENAI_ENDPOINT`, `AZURE_OPENAI_API_KEY`, and `AZURE_OPENAI_DEPLOYMENT` in the project `.env`. These model-inference demos do not require `az login`.

`gemini_demo.py` creates `GeminiChatClient` for the Gemini Developer API using an API key:

```text
GEMINI_API_KEY=your-google-ai-studio-key
GEMINI_MODEL=gemini-3.6-flash
```

Run it from the project root:

```powershell
.\venv\Scripts\python.exe .\00_client\gemini_demo.py
```

The API key stays in the git-ignored `.env` file and is never printed by the demo.

The script loads the repository-root `.env` explicitly, prints the model before
sending the request, and waits up to 60 seconds for a response. Existing terminal
environment variables take precedence over `.env`; restart the terminal or clear
an old `GEMINI_MODEL` variable if the printed model differs from your file.

Install the optional provider in the active virtual environment if necessary:

```powershell
python -m pip install agent-framework-gemini python-dotenv
```

Google lists free-tier standard input/output for `gemini-3.6-flash`,
`gemini-2.5-flash`, and `gemini-2.5-flash-lite` (checked September 6, 2026).
The configured `gemini-3.6-flash` was tested successfully with this project's key.
Free-tier eligibility and remaining quota depend on your Google project; choosing
one of these models does not make a paid-tier project's requests free.
See [Google pricing](https://ai.google.dev/gemini-api/docs/pricing) and
[rate limits](https://ai.google.dev/gemini-api/docs/rate-limits).

If a request returns HTTP 429, check the project's quota in Google AI Studio and
wait for its reset, or select another supported model with available quota.
Changing SDKs or creating another key in the same project does not bypass quota.
An AFC recommendation warning from the Google SDK is not an API failure; a
successful response can follow it. A timeout can indicate a slow request or
network issue and does not by itself prove that free quota is exhausted.

Sources: [Agent types and clients](https://learn.microsoft.com/en-us/agent-framework/agents/), [create your first agent](https://learn.microsoft.com/en-us/agent-framework/get-started/your-first-agent), [running and streaming agents](https://learn.microsoft.com/en-us/agent-framework/agents/running-agents), [OpenAI-compatible endpoints](https://learn.microsoft.com/en-us/agent-framework/hosting/self-hosting/openai-endpoints), [Google Gemini integration](https://learn.microsoft.com/en-us/agent-framework/integrations/by-component/model-providers/google-gemini).
