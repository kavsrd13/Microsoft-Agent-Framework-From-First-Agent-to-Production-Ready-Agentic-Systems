# Build and inspect a Streamable HTTP MCP server

This folder turns the supplied enterprise-style change-risk reference into a smaller teaching example. The participant builds one Python `FastMCP` server and tests its tools, resource, and prompt with MCP Inspector. The instructor then demonstrates the same protocol against the existing authenticated **Contoso Change Risk Advisor** hosted on Azure Container Apps. No learner deploys a duplicate server.

## Required participant path

Run the server from the repository root:

```powershell
python .\13_mcp\demo.py
```

In a second PowerShell window, open MCP Inspector:

```powershell
npx -y @modelcontextprotocol/inspector@latest --server-url http://127.0.0.1:8000/mcp --transport http
```

In Inspector, verify `get_change_record`, `assess_change_risk`, `change://catalog`, and `change-readiness-review`. Call `assess_change_risk` with `CHG-1003` and confirm that it returns high risk.

For the remote validation, place the shared endpoint and key supplied by the instructor in the git-ignored `.env` file:

```text
MCP_SERVER_URL=https://<instructor-provided-hostname>/mcp
MCP_API_KEY=<instructor-provided-api-key>
```

The remote server requires the `X-API-Key` header and contains fictional read-only data. The checked-in `Dockerfile` remains a transparent teaching artifact that shows how the local server can be packaged, but the participant path reuses the already-running Azure service.

## Optional instructor demonstration: MCP Apps

`mcp_app_demo.py` and `mcp_app.html` demonstrate the official MCP Apps pattern: a tool declares `_meta.ui.resourceUri`, and a `ui://` resource returns `text/html;profile=mcp-app`. Run it on port 8001:

```powershell
python .\13_mcp\mcp_app_demo.py
```

MCP Inspector can verify the tool metadata and UI resource, but it does not replace an MCP Apps-capable host for rendering the card. For that reason, MCP Apps are kept out of the required participant lab.

## Official references

- [MCP Python SDK](https://github.com/modelcontextprotocol/python-sdk)
- [MCP Inspector](https://github.com/modelcontextprotocol/inspector)
- [Deploy Azure Container Apps with `az containerapp up`](https://learn.microsoft.com/en-us/azure/container-apps/containerapp-up) (instructor reference only)
- [MCP Apps overview](https://modelcontextprotocol.io/extensions/apps/overview)
- [Build an MCP App](https://modelcontextprotocol.io/extensions/apps/build)
