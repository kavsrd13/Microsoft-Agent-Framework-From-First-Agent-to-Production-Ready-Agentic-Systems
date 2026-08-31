# Demo 22 - Agent development lifecycle

## Teaching goal

Show the lifecycle as an evidence loop: define expected behavior, build a baseline, create a candidate, evaluate both, and decide whether the candidate is ready to release.

## Run the demonstration

From the project root:

```powershell
.\venv\Scripts\Activate.ps1
python .\22_development_lifecycle\demo.py
```

For each question, ask students to compare the baseline and candidate against the printed review criterion. A better prompt is not automatically a releasable agent; it must perform better on the agreed tests.

## Student lab

1. Open `lab/starter.py`.
2. Replace only the candidate instructions.
3. Run the file and review all three cases.
4. Record the release decision in `release_checklist.md`.
5. Compare with `lab/solution.py`.

## Microsoft Learn source

- [Agent development lifecycle](https://learn.microsoft.com/azure/foundry/agents/concepts/development-lifecycle)
- [Agent Framework get started](https://learn.microsoft.com/agent-framework/get-started/your-first-agent?pivots=programming-language-python)

