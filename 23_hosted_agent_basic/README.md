# Deploy your Agent Framework agent to Foundry

This exercise uses the Python SDK source-upload path from [Microsoft Learn](https://learn.microsoft.com/azure/foundry/agents/quickstarts/quickstart-hosted-agent).
The existing Foundry project and model are reused. No Azure Developer CLI or local Docker build is needed for this path.
Running deploy.py creates a billable hosted version and routes 100% of this lab agent's endpoint traffic to it.
It deliberately keeps the version deployed for the classroom; repeating it creates another version.

## 1. Prepare

Use Python 3.13 or later and an existing Foundry project in a region supporting Hosted Agents.
The deploying user needs Foundry Project Manager at project scope, plus the permissions listed in
[Hosted agent permissions](https://learn.microsoft.com/azure/foundry/agents/concepts/hosted-agents).


From the repository root, reuse your course environment (or create it once):

```powershell
python -m venv venv
.\venv\Scripts\Activate.ps1
python -m pip install -r 23_hosted_agent_basic/requirements-deploy.txt
az login
```

## 2. Configure one .env file

Edit only the repository-root .env. The scripts explicitly load it regardless of the current working directory.
Use the full project endpoint copied from Foundry, including /api/projects/<project>.
Use the actual deployment name for FOUNDRY_MODEL.

```dotenv
FOUNDRY_PROJECT_ENDPOINT=https://<account>.services.ai.azure.com/api/projects/<project>
FOUNDRY_MODEL=<your-model-deployment-name>
```

Do not add storage keys. Existing process environment variables take precedence over .env; clear stale values before running.
The upload contains only main.py and requirements.txt. Settings are supplied explicitly to the hosted runtime.

## 3. Understand and test main.py

FoundryChatClient calls the model. Agent defines instructions.
ResponsesHostServer exposes the agent through the Responses protocol.
DefaultAzureCredential can use your developer sign-in locally and the agent identity in Foundry.

```powershell
cd 23_hosted_agent_basic
python main.py
```

Use Foundry Toolkit's Agent Inspector against localhost:8088. Ask:
"How should I request an exception to my company's travel policy?"

Stop the server with Ctrl+C.

## 4. Deploy the same code

```powershell
python deploy.py
```

Teach deploy.py in its numbered sequence:
1. Read the shared .env and select the lab agent name.
2. ZIP only main.py and requirements.txt into memory.
3. Upload with create_version_from_code. Foundry builds dependencies remotely using Python 3.13.
4. Poll until the version is active (up to ten minutes).
5. Route the agent endpoint to the new version and print its URL.

The script uses AzureCliCredential for deployment. The uploaded runtime uses DefaultAzureCredential.
If provisioning fails or times out, inspect the created version in Foundry before rerunning.
The script does not delete failed versions or replace an existing route before a version becomes active.

## 5. Invoke in Azure

```powershell
python invoke.py
```

The local main.py server can remain stopped. invoke.py calls the deployed agent endpoint using your CLI sign-in.
Open your project in Foundry, find travel-policy-hosted-agent, and inspect the version and logs.

Completion: a hosted version is active, its endpoint is routed, and invoke.py returns a real model answer.


## Student exercise

Change the instructions to give brief answers, avoid invented policies, and refer exceptions to a human. Put the finished code in main.py before deployment.
deploy.py always packages main.py, not student_main.py or lab/starter.py.

## Cleanup

Delete only these classroom hosted-agent versions when finished. Do not delete a shared Foundry project or resource group.
This example intentionally leaves the deployed version available until you remove it.

## References

- [Hosted Agents](https://learn.microsoft.com/azure/foundry/agents/concepts/hosted-agents)
- [Python deployment quickstart](https://learn.microsoft.com/azure/foundry/agents/quickstarts/quickstart-hosted-agent)
- [Agent identity](https://learn.microsoft.com/azure/foundry/agents/concepts/agent-identity)
