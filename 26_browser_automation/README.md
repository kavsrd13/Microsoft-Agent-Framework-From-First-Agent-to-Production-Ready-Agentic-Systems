# Demo 26 - Browser Automation Hosted agent

## Teaching goal

Give a short overview of browser automation while keeping the code trustworthy and documentation-aligned. Browser session creation, Playwright connection, command execution, cleanup, Toolbox configuration, and RBAC are genuine infrastructure concerns. Hiding them in a simplified custom script would teach the wrong pattern.

For this reason, this lab initializes Microsoft's current official sample and changes only the task prompt.

## Initialize the official sample

```powershell
$env:AZURE_DEV_USER_AGENT='microsoft_foundry_skill'; azd ai agent init -m "https://github.com/microsoft-foundry/foundry-samples/blob/main/samples/python/hosted-agents/agent-framework/responses/14-browser-automation-agent/azure.yaml" --deploy-mode container
```

Follow the quickstart to provision the Browser Automation workspace, Toolbox, identity roles, and Hosted agent. The official sample reads its Foundry settings from environment variables and uses `DefaultAzureCredential()` in the Hosted runtime.

## Safe first demonstration

Use the text in `demo_prompt.txt`. It asks the agent to read `example.com` without clicking external links or submitting a form.

## Student lab

`training_site/index.html` is a synthetic travel-status page. Publish it to an instructor-controlled static website, then ask students to:

1. Open the page.
2. Find the cancelled flight.
3. Return the flight number, route, and next action.
4. Avoid all write actions.

Do not use a real airline or booking site for the first lab. Keep authentication, payments, bookings, and personal data out of the exercise.

## Microsoft sources

- [Browser Automation Hosted-agent quickstart](https://learn.microsoft.com/azure/foundry/agents/how-to/tools/browser-automation-hosted-agent-quickstart?pivots=python)
- [Official Browser Automation Agent Framework sample](https://github.com/microsoft-foundry/foundry-samples/tree/main/samples/python/hosted-agents/agent-framework/responses/14-browser-automation-agent)
- [Hosted agents](https://learn.microsoft.com/azure/foundry/agents/concepts/hosted-agents)
