# Demo 23 - Basic Hosted agent

## Teaching goal

Show that the Agent Framework `Agent` remains simple. `ResponsesHostServer` adds a Responses-compatible service boundary, and Foundry supplies the deployment environment.

## Local demonstration

From this folder, activate the root environment and run:

```powershell
..\venv\Scripts\Activate.ps1
python main.py
```

The server listens on `http://localhost:8088`. Open Agent Inspector in the Foundry Toolkit, or use the official quickstart invocation flow.

## Hosted deployment flow

Use the Microsoft sample manifest to initialize the deployable project, and then compare its `main.py` with this teaching version:

```powershell
$env:AZURE_DEV_USER_AGENT='microsoft_foundry_skill'; azd ai agent init -m https://github.com/microsoft-foundry/foundry-samples/blob/main/samples/python/hosted-agents/agent-framework/responses/01-basic/azure.yaml
```

After initialization, replace only the generated agent's `main.py` and requirements with the files in this folder. Then use the quickstart's provision, local-run, and deploy steps.

## Student lab

Change only the `instructions` value so the agent:

1. Gives a short answer.
2. Does not invent travel policies.
3. Escalates policy exceptions to a human.

Keep the client and `ResponsesHostServer` structure unchanged.

## Microsoft sources

- [Hosted agents](https://learn.microsoft.com/azure/foundry/agents/concepts/hosted-agents)
- [Deploy your own code](https://learn.microsoft.com/azure/foundry/agents/quickstarts/quickstart-deploy-own-code?tabs=responses)
- [Official Agent Framework Hosted-agent sample](https://github.com/microsoft-foundry/foundry-samples/tree/main/samples/python/hosted-agents/agent-framework/responses/01-basic)

