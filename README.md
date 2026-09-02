# Microsoft Agent Framework demos with Microsoft Foundry

Independent, classroom-sized Python demos based on the current Microsoft Learn documentation and the official Microsoft Agent Framework Python samples. Every demo uses `FoundryChatClient` with a Microsoft Foundry project endpoint and classroom authentication through `AzureCliCredential()`.

## Participant HTML labs

Open [html_labs/index.html](html_labs/index.html) to use the complete participant workbook. The index links all 28 labs in the recommended teaching order. Participant-facing lab numbers are sequential even when the underlying source folder has a stable historical number. Each lab includes environment setup, required Azure resources and roles, code assembled in explained modules, validation checkpoints, a five-minute challenge, a three-question knowledge check, and its Microsoft documentation links.

The HTML pages work as local files and do not require a web server. Progress and knowledge-check state are stored only in the participant's browser.

## 1. Environment created

This project already contains a Python 3.12 virtual environment created with the equivalent of:

```powershell
python -m venv venv
```

On this computer the explicit interpreter path was required because `python` was not registered on `PATH`:

```powershell
C:\Users\kvsrd\miniforge3\python.exe -m venv venv
```

Activate it from PowerShell:

```powershell
.\venv\Scripts\Activate.ps1
```

Or run it without activation:

```powershell
.\venv\Scripts\python.exe --version
```

## 2. Authenticate and configure

Sign in with the classroom identity:

```powershell
az login
```

Copy `.env.example` to `.env`, then set:

- `FOUNDRY_PROJECT_ENDPOINT`: the project endpoint from the Foundry portal.
- `FOUNDRY_MODEL`: the deployed chat model name.

Do not commit `.env`. Production applications should replace `AzureCliCredential` with a managed identity or another specific workload credential.

## 3. Install dependencies

Dependencies have already been installed into `venv`. To reproduce the setup:

```powershell
.\venv\Scripts\python.exe -m pip install -r requirements.txt
```

## 4. Run demos

Run each demo from the project root so the shared `.env` file is found:

```powershell
.\venv\Scripts\python.exe .\01_agent_creation\demo.py
```

Use the teaching order below. Folder numbers are stable identifiers, so the course can improve its flow without renaming files.

| Folder | Topic |
|---|---|
| `00_client` | Explicit `FoundryChatClient` and `GeminiChatClient` configuration |
| `01_agent_creation` | Create and run an `Agent` |
| `02_streaming` | Stream response updates |
| `03_structured_output` | Pydantic response format |
| `04_function_tools` | Local function tool |
| `05_tool_approval` | Human approval before a tool runs |
| `13_mcp` | Build and inspect a Python MCP server, then validate the shared authenticated Azure deployment; optional MCP Apps instructor demo |
| `27_mcp_agent_client` | Use the shared authenticated MCP server from an Agent Framework agent |
| `06_sessions` | Multi-turn `AgentSession` |
| `07_context_provider` | Dynamic context and session state |
| `08_memory` | File-backed memory shared across sessions |
| `09_middleware` | Agent and function middleware |
| `10_observability` | OpenTelemetry tracing and a local HTML metrics dashboard |
| `11_evaluation` | Built-in and custom local evaluators |
| `22_development_lifecycle` | Baseline-versus-candidate evaluation and release decision |
| `12_rag_azure_ai_search` | RAG through Azure AI Search |
| `20_agentic_retrieval` | Classic RAG versus agentic retrieval with activity and citations |
| `21_identity_aware_rag` | Permission-aware RAG using Entra identity and Search ACL enforcement |
| `14_workflow_basics` | Functional workflow with agents |
| `15_workflow_hitl` | Paused/resumed human review workflow |
| `16_multi_agent_sequential` | Sequential orchestration |
| `17_multi_agent_concurrent` | Concurrent fan-out/fan-in |
| `18_multi_agent_handoff` | Triage-to-specialist handoff |
| `19_multi_agent_group_chat` | Round-robin group chat |
| `23_hosted_agent_basic` | Responses-compatible Hosted agent |
| `24_hosted_agent_identity` | Passwordless access from the agent to Blob Storage |
| `25_agent_optimizer` | Evaluation-driven Hosted-agent optimization |
| `26_browser_automation` | Safe Browser Automation capstone using the official sample |

See [LAB_GUIDE.md](LAB_GUIDE.md) for the classroom story and five-minute challenge for every lab.

## Verification boundary

All Python files are compiled and imported locally during validation. A live model call still requires your Foundry project, deployed model, RBAC access, and an active `az login` session. The RAG demo additionally requires a populated Azure AI Search index; the MCP demo requires outbound access to its configured MCP endpoint.

The local evaluation decorators and functional workflow API emit Microsoft's current `ExperimentalWarning`. They are included because they are in the latest official documentation, but their APIs may change in later releases.

## Documentation snapshot

The code was aligned on 1 September 2026 with Microsoft Learn and the official `microsoft/agent-framework` repository. Package versions are pinned in `requirements.txt` so the demonstrations remain internally consistent even as the documentation evolves. Demos 20 and 21 use the current Azure AI Search `2026-05-01-preview` SDK surface for advanced retrieval and permission filtering.

## Primary official sources

- [Microsoft Agent Framework documentation](https://learn.microsoft.com/en-us/agent-framework/)
- [Official Python samples](https://github.com/microsoft/agent-framework/tree/main/python/samples)
- [Microsoft Foundry authentication](https://learn.microsoft.com/en-us/azure/foundry/concepts/authentication-authorization-foundry)
