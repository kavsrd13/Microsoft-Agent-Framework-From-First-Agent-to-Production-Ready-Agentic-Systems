# Use the shared MCP server from Agent Framework

This lab connects `MCPStreamableHTTPTool` to the instructor-provided **Contoso Change Risk Advisor** running on Azure Container Apps. A Microsoft Foundry-backed agent discovers two explicitly allowed tools, calls them, and summarizes the deterministic result. The client sends the server credential through `header_provider`, so the API key remains in the git-ignored `.env` file. It also sets `load_prompts=False`; the server prompt remains available to Inspector, but it is not converted into an LLM-callable function by the pinned Agent Framework package.

Add the values supplied by the instructor to `.env`:

```text
MCP_SERVER_NAME=Contoso Change Risk Advisor
MCP_SERVER_URL=https://<instructor-provided-hostname>/mcp
MCP_API_KEY=<instructor-provided-api-key>
```

Authenticate and run from the repository root:

```powershell
az login
python .\27_mcp_agent_client\demo.py
```

The response should identify `CHG-1003` as **Emergency payment gateway routing update**, with **High** risk and score **100**. The server contains fictional read-only data, so no production action is performed. Learners reuse this shared endpoint; they do not provision a duplicate Azure resource.

Source: [Using MCP tools with Agents](https://learn.microsoft.com/en-us/agent-framework/agents/tools/local-mcp-tools), [Microsoft Foundry model provider](https://learn.microsoft.com/en-us/agent-framework/agents/providers/microsoft-foundry).
