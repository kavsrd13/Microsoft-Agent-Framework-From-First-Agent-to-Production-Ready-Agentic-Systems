# Use the shared MCP server from Agent Framework

This lab connects `MCPStreamableHTTPTool` to the instructor-provided **Contoso Change Risk Advisor** running on Azure Container Apps. An Azure OpenAI-backed agent discovers two explicitly allowed tools, calls them, and summarizes the deterministic result. The client sends the MCP credential through `header_provider`, while the model uses the separate Azure OpenAI API key. Both keys remain in the git-ignored `.env` file. It also sets `load_prompts=False`; the server prompt remains available to Inspector, but it is not converted into an LLM-callable function by the pinned Agent Framework package.

Add the values supplied by the instructor to `.env`:

```text
MCP_SERVER_NAME=Contoso Change Risk Advisor
MCP_SERVER_URL=https://ca-copilot-dev-e925.redpond-16f6bb64.centralindia.azurecontainerapps.io/mcp
MCP_API_KEY=<instructor-provided-api-key>
```

Authenticate and run from the repository root:

```powershell
AZURE_OPENAI_ENDPOINT=https://YOUR-RESOURCE.openai.azure.com/openai/v1
AZURE_OPENAI_API_KEY=YOUR-CLASSROOM-KEY
AZURE_OPENAI_DEPLOYMENT=gpt-5
python .\27_mcp_agent_client\demo.py
```

The response should identify `CHG-1003` as **Emergency payment gateway routing update**, with **High** risk and score **100**. The server contains fictional read-only data, so no production action is performed. Learners reuse this shared endpoint; they do not provision a duplicate Azure resource.

Source: [Using MCP tools with Agents](https://learn.microsoft.com/en-us/agent-framework/agents/tools/local-mcp-tools), [OpenAI-compatible endpoints](https://learn.microsoft.com/en-us/agent-framework/hosting/self-hosting/openai-endpoints).
