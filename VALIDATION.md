# Validation record

Originally validated on 1 September 2026. Authentication migration revalidated on 7 September 2026.

- Virtual environment: Python 3.12.12 in `venv`.
- Dependency integrity: `pip check` reported no broken requirements.
- Coverage: 27 topic folders, 39 Python files, and 28 per-topic `README.md` files.
- Syntax: all scripts passed compilation.
- API-key migration: all standard Agent Framework model clients now use `OpenAIChatClient` with the Azure OpenAI v1 endpoint, deployment, and key loaded from `.env`.
- Installed-API compatibility: all scripts executed their import and definition-time code successfully without starting their entry points.
- Secret scan: no embedded API keys or token-like secrets found outside the placeholder `.env.example`.
- Source snapshot: Microsoft Agent Framework commit `d9d3fb6252f7ae9e7f8104edce7266f0782a813c`, dated 22 August 2026.

## Installed direct dependencies

```text
agent-framework-core==1.15.0
agent-framework-openai==1.14.1
agent-framework-foundry==1.11.0
agent-framework-gemini==1.0.0b260813
agent-framework-orchestrations==1.1.1
agent-framework-azure-ai-search==1.0.0b260813
azure-search-documents==12.1.0b1
azure-identity==1.25.3
mcp==1.29.0
opentelemetry-sdk==1.43.0
```

## Live validation boundary

The 7 September migration smoke test used `AZURE_OPENAI_API_KEY` with the configured Azure OpenAI `/openai/v1` endpoint and `gpt-5` deployment. `01_agent_creation/demo.py` completed successfully without Azure CLI authentication.

The following bullets record the earlier 1 September Entra-based validation and should not be interpreted as a fresh end-to-end rerun after the API-key migration:

- Foundry demos 00-11, 13-19, and 22 passed end-to-end live execution.
- Demos 05 (tool approval) and 15 (workflow HITL) passed with their expected interactive input.
- Demo 12 and all advanced RAG demos in 20 and 21 passed after Search resources were provisioned.
- The Gemini client passed with the configured `gemini-3.6-flash` model and the key loaded only from `.env`.
- Hosted-agent demos 23, 24, and 25 start successfully on the local Responses host and load their configuration. A remote hosted-agent deployment/optimization run remains unverified because `azd` is not installed in this environment.
- The observability console demo passed. The dashboard generator produced `agent_metrics_dashboard.html`; its last captured telemetry file is an earlier failed-auth run because the current sandbox cannot read the Azure CLI token cache for a fresh dashboard call.

The local `.env` contains endpoints, deployment names, and keys and remains git-ignored. Generated lab pages contain placeholders only. Identity-aware RAG and Hosted/managed Foundry operations remain token-based because those scenarios require Entra identity, RBAC, or managed identity.

The evaluation decorators and functional workflow API produced their documented experimental warnings during import validation.

## Advanced RAG validation

- Installed `azure-search-documents==12.1.0b1`, required for the current `2026-05-01-preview` permission-filter and query-source authorization features.
- The Search endpoint accepted creation of `travel-agentic-demo` and the permission-enabled `travel-secure-demo` index.
- The secure index schema accepted `permissionFilterOption=enabled`, `UserIds` with `permissionFilter=userIds`, and `GroupIds` with `permissionFilter=groupIds`.
- All seven scripts in topics 20 and 21 compile and import successfully.
- Sample travel and ACL documents were uploaded through Entra authentication, and the retrieval demos passed against the populated resources.
- The pasted storage account key was not stored or used.

## Gemini client validation

- Installed `agent-framework-gemini==1.0.0b260813` from the official Agent Framework provider package.
- `00_client/gemini_demo.py` compiles and imports successfully.
- A live Gemini request passed with `GEMINI_API_KEY` loaded from the local `.env` file.
