# Microsoft Foundry and Agent Framework course labs

Independent, classroom-sized Python demos based on the current Microsoft Learn documentation and the official Microsoft Agent Framework Python samples. Standard model-inference demos use `OpenAIChatClient` with an Azure OpenAI v1 endpoint and a classroom API key stored only in `.env`. Identity-dependent Foundry labs retain Microsoft Entra authentication where the platform requires it.

## Participant HTML labs

Open [html_labs/index.html](html_labs/index.html) to use the complete participant workbook. The index links all 25 labs in the recommended teaching order. Participant-facing lab numbers are sequential even when the underlying source folder has a stable historical number. Each lab includes environment setup, required Azure resources and roles, code assembled in explained modules, validation checkpoints, a five-minute challenge, a three-question knowledge check, and its Microsoft documentation links.

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

## 2. Configure classroom model access

Copy `.env.example` to `.env`, then set:

- `AZURE_OPENAI_ENDPOINT`: the full Azure OpenAI endpoint ending in `/openai/v1`.
- `AZURE_OPENAI_API_KEY`: the instructor-provided classroom resource key.
- `AZURE_OPENAI_DEPLOYMENT`: the deployed model name.

Do not commit `.env`. Labs covering managed Prompt Agents, Hosted Agents, Agent Optimizer, browser automation, or identity-aware RAG explicitly retain `az login` because those operations require a Microsoft Entra identity.

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

The participant workbook begins with six official Microsoft Foundry exercises linked from `html_labs/index.html`. These cover the portal and project, model comparison and evaluation, Responses API applications, tools, content filters, and agent creation with the portal and VS Code. The local Agent Framework workbook then starts at displayed Lab 07.

Use the Agent Framework teaching order below. Folder numbers are stable identifiers, so the course can improve its flow without renaming files.

| Displayed lab | Source folder | Topic |
|---|---|---|
| 07 | `00_client`, `01_agent_creation`, `02_streaming` | Configure clients, create and run an `Agent`, then stream response updates |
| 08 | `03_structured_output` | Pydantic response format |
| 09 | `04_function_tools`, `05_tool_approval` | Local function tools and human approval before a simulated action |
| 10 | `13_mcp` | Build and inspect a Python MCP server, then validate the shared authenticated Azure deployment; optional MCP Apps instructor demo |
| 11 | `27_mcp_agent_client` | Use the shared authenticated MCP server from an Agent Framework agent |
| 12 | `06_sessions` | Multi-turn `AgentSession` |
| 13 | `07_context_provider` | Dynamic context and session state |
| 14 | `08_memory` | File-backed memory shared across sessions |
| 15 | `09_middleware` | Agent and function middleware |
| 16 | `10_observability` | OpenTelemetry tracing and a local HTML metrics dashboard |
| 17 | `11_evaluation` | Built-in and custom local evaluators |
| 18 | `22_development_lifecycle` | Baseline-versus-candidate evaluation and release decision |
| 19 | `12_rag_azure_ai_search` | RAG through Azure AI Search |
| 20 | `20_agentic_retrieval` | Classic RAG versus agentic retrieval with activity and citations |
| 21 | `21_identity_aware_rag` | Permission-aware RAG using Entra identity and Search ACL enforcement |
| 22 | `14_workflow_basics` | Functional workflow with agents |
| 23 | `15_workflow_hitl` | Paused/resumed human review workflow |
| 24 | `16_multi_agent_sequential` | Sequential orchestration |
| 25 | `17_multi_agent_concurrent` | Concurrent fan-out/fan-in |
| 26 | `18_multi_agent_handoff` | Triage-to-specialist handoff |
| 27 | `19_multi_agent_group_chat` | Round-robin group chat |
| 28 | `23_hosted_agent_basic` | Responses-compatible Hosted agent |
| 29 | `24_hosted_agent_identity` | Passwordless access from the agent to Blob Storage |
| 30 | `25_agent_optimizer` | Evaluation-driven Hosted-agent optimization |
| 31 | `26_browser_automation` | Safe Browser Automation capstone using the official sample |

See [LAB_GUIDE.md](LAB_GUIDE.md) for the classroom story and five-minute challenge for every lab.

## Verification boundary

All Python files are compiled and imported locally during validation. A standard live model call requires the configured Azure OpenAI endpoint, deployment, and API key. The RAG demo additionally requires a populated Azure AI Search index and Search key; the MCP demo requires outbound access to its configured MCP endpoint. Identity-dependent Foundry operations still require Entra sign-in and RBAC.

The local evaluation decorators and functional workflow API emit Microsoft's current `ExperimentalWarning`. They are included because they are in the latest official documentation, but their APIs may change in later releases.

## Documentation snapshot

The code was aligned on 1 September 2026 with Microsoft Learn and the official `microsoft/agent-framework` repository. Package versions are pinned in `requirements.txt` so the demonstrations remain internally consistent even as the documentation evolves. Demos 20 and 21 use the current Azure AI Search `2026-05-01-preview` SDK surface for advanced retrieval and permission filtering.

## Primary official sources

- [Microsoft Agent Framework documentation](https://learn.microsoft.com/en-us/agent-framework/)
- [Official Python samples](https://github.com/microsoft/agent-framework/tree/main/python/samples)
- [Microsoft Foundry authentication](https://learn.microsoft.com/en-us/azure/foundry/concepts/authentication-authorization-foundry)
