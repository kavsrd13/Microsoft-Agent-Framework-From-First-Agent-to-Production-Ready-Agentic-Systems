# Evaluation

This demo now shows a practical evaluation setup for an Agent Framework agent with:

- Knowledge checks against expected outputs
- Tool-calling checks (expected tool-call presence)
- Prompt-injection resilience checks
- Red-team safety checks for harmful prompts

## What It Uses

- Local checks via `LocalEvaluator`, `tool_calls_present`, and custom `@evaluator` functions
- Azure OpenAI API-key authentication for the live Agent Framework model calls

## Run

From the repo root:

```powershell
python .\11_evaluation\demo.py
```

The script now always writes structured results to:

- `11_evaluation/eval_results.json`

The evaluation checks run locally, so this classroom lab does not require an Azure CLI sign-in.

## Dashboard

Open `11_evaluation/eval_dashboard.html` after running `demo.py`.

- Summary cards show pass totals and pass rate
- Per-provider section shows evaluator-level pass counts
- Per-query rows show response text plus PASS/FAIL by check

## Sources

- Agent Framework evaluation docs: https://learn.microsoft.com/en-us/agent-framework/agents/evaluation
- Official local eval sample: https://github.com/microsoft/agent-framework/blob/main/python/samples/02-agents/evaluation/evaluate_agent.py
