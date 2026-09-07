# Create and run an agent

The smallest explicit `Agent(client=..., name=..., instructions=...)` pattern, backed by Azure OpenAI API-key authentication.

`demo.py` reads `AZURE_OPENAI_ENDPOINT`, `AZURE_OPENAI_API_KEY`, and `AZURE_OPENAI_DEPLOYMENT` from the repository-root `.env`; it does not require Azure CLI authentication.

Source: [Create your first agent](https://learn.microsoft.com/en-us/agent-framework/get-started/your-first-agent), [official hello-agent sample](https://github.com/microsoft/agent-framework/blob/main/python/samples/01-get-started/01_hello_agent.py).

## Optional: create a managed agent in Foundry

The separate `../00_client/foundry_agent_demo.py` performs three teaching steps and intentionally requires Microsoft Entra authentication because it creates a service-managed Prompt Agent:

1. Foundry SDK: `AIProjectClient.agents.create_version` saves a Prompt Agent named
   `agent-framework-agent` with the configured model and instructions.
2. Agent Framework: `FoundryAgent` connects to the returned name and version.
3. `await agent.run(...)` asks a question and prints the response.

It reads `FOUNDRY_PROJECT_ENDPOINT` and `FOUNDRY_MODEL` from the single repository-root `.env`.
Use the full project endpoint and an existing model deployment name.
Each execution creates another version under the same agent name. The agent remains
visible in Foundry after the script exits. For repeated chat without version creation,
reuse the name and version with `FoundryAgent` and skip step 1.

`demo.py` creates an application-owned agent locally. This new example creates a
service-managed Prompt Agent in Foundry. Creation uses the Foundry SDK; Agent Framework
provides the run interface. It is not a Hosted Agent deployment.

Run from the repository root with the course virtual environment:

```powershell
az login
.\venv\Scripts\python.exe .\00_client\foundry_agent_demo.py
```

Requires `agent-framework-foundry`, `azure-ai-projects>=2.3.0`, `azure-identity`, and `python-dotenv`.
Your signed-in identity needs agent-creation and invocation permissions in the target project.
In Foundry, select that project, then Build > Agents > agent-framework-agent.

Source: [Microsoft Foundry Agent Service integration](https://learn.microsoft.com/en-us/agent-framework/integrations/by-component/agent-services/foundry).
Creation source: [Create a Prompt Agent](https://learn.microsoft.com/en-us/azure/foundry/agents/quickstarts/prompt-agent).
