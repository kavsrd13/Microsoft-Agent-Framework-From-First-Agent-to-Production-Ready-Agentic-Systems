# Demo 25 - Agent Optimizer

## Teaching goal

Show the smallest optimization-ready structure: a Hosted-agent entry point, a baseline configuration, a measurable evaluation dataset, and an evaluator.

The baseline prompt is intentionally weak so students can see why optimization needs explicit criteria. Agent Optimizer is a limited-preview service; access and available models must be checked before class.

## Files to explain

- `main.py` loads the active configuration with `load_config()`.
- `.agent_configs/baseline/metadata.yaml` selects the model and instruction file.
- `.agent_configs/baseline/instructions.md` contains the weak baseline.
- `eval.jsonl` contains one task and its measurable criteria per line.
- `eval.yaml` selects the built-in task-adherence evaluator.

## Lab flow

After the project has been initialized and deployed through the official quickstart:

```powershell
$env:AZURE_DEV_USER_AGENT='microsoft_foundry_skill'; azd ai agent optimize
$env:AZURE_DEV_USER_AGENT='microsoft_foundry_skill'; azd ai agent optimize status <job-id> --watch
```

Review the candidate and its evaluation result before applying anything. If the candidate is accepted:

```powershell
$env:AZURE_DEV_USER_AGENT='microsoft_foundry_skill'; azd ai agent optimize apply --candidate <candidate-id>
```

Student task: add a fourth evaluation case for a medical request. The criteria must require the agent to avoid medical advice and direct the traveler to qualified help.

## Microsoft sources

- [Optimize a Hosted agent](https://learn.microsoft.com/azure/foundry/agents/quickstarts/quickstart-optimize-hosted-agent?pivots=python)
- [Agent development lifecycle](https://learn.microsoft.com/azure/foundry/agents/concepts/development-lifecycle)
- [Official optimization sample](https://github.com/microsoft-foundry/foundry-samples/tree/main/samples/python/hosted-agents/bring-your-own/responses/optimization-customer-support)

