# Verified classroom deployment

Verified on 2026-09-06 using the repository-root .env and Azure CLI authentication.

| Setting | Verified value |
| --- | --- |
| Foundry account | foundrydemo213 |
| Project | proj-default |
| Agent | travel-policy-hosted-agent |
| Version | 1 |
| Deployment status | active |
| Model deployment | gpt-5 |
| Hosting | Python source upload, remote build, Python 3.13 |
| Resources | 0.5 CPU, 1 GiB |

Endpoint: https://foundrydemo213.services.ai.azure.com/api/projects/proj-default/agents/travel-policy-hosted-agent/endpoint/protocols/openai/responses

Open https://ai.azure.com, select proj-default, then Build > Agents > travel-policy-hosted-agent.

## Teaching sequence

1. Show main.py: FoundryChatClient, Agent, ResponsesHostServer.
2. Show deploy.py: package two runtime files, upload, wait, route the endpoint.
3. Run invoke.py: call the cloud agent with the local server stopped.

The live prompt was: "How should I request an exception to my company's travel policy?"
The agent returned an answer with a business-case checklist and an example exception-request email.
The final invocation exited successfully. This basic agent has no private policy data; its response is general advice.

Two issues were corrected during the live test: the upload stream now has a .zip filename, and invoke.py prints UTF-8 text on Windows.
The deployed version was retained. Re-running deploy.py creates a new version and routes this agent's endpoint to it.

## Official sources

- https://learn.microsoft.com/azure/foundry/agents/quickstarts/quickstart-hosted-agent
- https://github.com/microsoft-foundry/foundry-samples/tree/main/samples/python/hosted-agents/agent-framework/responses/01-basic

The agent follows the Microsoft sample structure. The deployment adapts the SDK quickstart to retain the version for teaching and includes only main.py and requirements.txt in the upload.
