# Research source: Microsoft Agent Framework course presentation plan

Checked: 2026-08-29

## Research question

What is the strongest documentation-aligned teaching sequence for a Python course that uses Microsoft Foundry, covers the 22 existing Microsoft Agent Framework demos, ends every module with a lab and knowledge check, and gives Microsoft Learn references for slide creation?

## Assumptions

- Audience: developers and solution architects who know basic Python and Azure concepts but are new to Microsoft Agent Framework.
- Delivery: instructor-led, approximately three days. The course can be shortened by treating Modules 7 and 9 as advanced sections.
- Runtime: Python, `OpenAIChatClient`, an Azure OpenAI v1 model endpoint, and a classroom API key loaded from the git-ignored `.env`.
- Lab code is authoritative for demonstrations. Slides must not invent code that is not present in the project.
- The presentation is an independently authored course, not an official Microsoft deck. It should cite Microsoft Learn but must not imply Microsoft endorsement or use a Microsoft copyright footer without permission.

## Evidence-led course flow

Microsoft's Get Started path builds one concept at a time: first agent, tools, multi-turn conversations, memory and persistence, workflows, agent harness, and hosting. The proposed course follows the same dependency order, while inserting response contracts after the first agent, reliability topics before retrieval, and the existing Azure AI Search and orchestration labs as advanced modules.

Recommended flow:

1. Foundations, providers, clients, authentication, and the first agent.
2. Agent execution, streaming, messages, and structured outputs.
3. Function tools, tool approval, and MCP.
4. Sessions, context providers, memory, and middleware.
5. Observability and evaluation.
6. Classic RAG with Azure AI Search.
7. Agentic retrieval and identity-aware RAG.
8. Functional workflows and human-in-the-loop.
9. Multi-agent orchestration patterns.
10. Closing integration architecture, production boundaries, and current next topics such as harnesses and hosting.

## Key findings to preserve in the deck

- An agent combines a model/client, instructions, tools, middleware, context providers, and session state behind a consistent run interface.
- `OpenAIChatClient` is the classroom path for direct Azure OpenAI inference when the application owns instructions, tools, and conversation flow. `FoundryAgent` remains the path for service-managed Prompt or Hosted Agents.
- Basic model-inference labs use the instructor-provided Azure OpenAI key. Identity-aware RAG, service-managed Prompt Agents, Hosted Agents, Toolbox, and Agent Optimizer retain Microsoft Entra authentication because API keys cannot supply user identity, RBAC, or managed-identity behavior.
- Streaming and non-streaming use the same agent abstraction. Streaming yields updates and can be finalized into a complete response.
- Structured output is a contract, not prompt formatting. Python uses a Pydantic model or JSON schema through `response_format`, subject to provider support.
- Function tools are model-selected executable capabilities. Approval is a separate control that pauses execution before a sensitive call.
- MCP standardizes tool discovery and invocation. Distinguish client-opened local MCP transports from provider-hosted MCP configurations and discuss their different trust and tracing boundaries.
- Sessions carry conversation state. Context providers proactively inject or persist context around each invocation; tools are reactive and model-selected. Middleware handles cross-cutting concerns at the agent, function, or chat layer.
- Agent Framework observability uses OpenTelemetry traces, logs, and metrics. Sensitive prompt and tool data should only be enabled deliberately in development or controlled testing.
- The evaluation framework supports local deterministic checks, custom evaluators, and Microsoft Foundry evaluation. Evaluation should cover quality, safety, tool behavior, groundedness, and consistency.
- Classic RAG queries an index directly. Good retrieval design includes chunking, vectorization where appropriate, hybrid retrieval, semantic ranking, focused grounding, and citations.
- Agentic retrieval uses a knowledge base to plan and decompose complex or conversational questions, run focused subqueries in parallel, semantically rerank and merge results, and return grounding content plus activity and references.
- Identity-aware RAG must fail closed before model invocation. The application authenticates to Search, forwards a delegated end-user token, and Search derives `userIds` and `groupIds` for permission enforcement. The browser and prompt must never supply trusted ACL claims.
- Workflows provide explicit, inspectable execution paths. Human-in-the-loop uses request/response events so a workflow can pause and resume safely.
- Built-in orchestrations include sequential, concurrent, handoff, group chat, and magentic. Pattern choice should follow task dependency, independence, routing needs, iteration needs, and planning complexity.
- The current Get Started path also includes agent harnesses and hosting. These are documented as next topics, but no corresponding lab exists in this project, so they belong in a clearly labeled roadmap/extension slide rather than a fabricated lab.

## Primary Microsoft sources

### Foundations and clients

- Agent Framework home: https://learn.microsoft.com/en-us/agent-framework/
- Get started learning path: https://learn.microsoft.com/en-us/agent-framework/get-started/
- Agent concepts: https://learn.microsoft.com/en-us/agent-framework/concepts/agents/
- Integrations overview: https://learn.microsoft.com/en-us/agent-framework/integrations/
- Microsoft Foundry model provider: https://learn.microsoft.com/en-us/agent-framework/integrations/by-component/model-providers/microsoft-foundry
- Google Gemini provider: https://learn.microsoft.com/en-us/agent-framework/integrations/by-component/model-providers/google-gemini
- Microsoft Foundry authentication: https://learn.microsoft.com/en-us/azure/foundry/concepts/authentication-authorization-foundry

### Running agents, outputs, tools, and MCP

- Running agents: https://learn.microsoft.com/en-us/agent-framework/concepts/agents/running-agents
- Structured outputs: https://learn.microsoft.com/en-us/agent-framework/agents/structured-outputs
- Tools overview: https://learn.microsoft.com/en-us/agent-framework/agents/tools/
- Function tools: https://learn.microsoft.com/en-us/agent-framework/agents/tools/function-tools
- Tool approval: https://learn.microsoft.com/en-us/agent-framework/agents/tools/tool-approval
- Local MCP tools: https://learn.microsoft.com/en-us/agent-framework/agents/tools/local-mcp-tools

### Sessions, context, memory, middleware, and quality

- Conversations and memory: https://learn.microsoft.com/en-us/agent-framework/concepts/agents/conversations/
- Sessions: https://learn.microsoft.com/en-us/agent-framework/agents/conversations/session
- Adding context providers: https://learn.microsoft.com/en-us/agent-framework/journey/adding-context-providers
- Context-provider integrations: https://learn.microsoft.com/en-us/agent-framework/integrations/by-component/context-providers/
- Memory and persistence: https://learn.microsoft.com/en-us/agent-framework/get-started/memory
- Middleware: https://learn.microsoft.com/en-us/agent-framework/concepts/agents/middleware/
- Observability: https://learn.microsoft.com/en-us/agent-framework/agents/observability
- Evaluation: https://learn.microsoft.com/en-us/agent-framework/agents/evaluation

### RAG and Azure AI Search

- Azure AI Search RAG overview: https://learn.microsoft.com/en-us/azure/search/retrieval-augmented-generation-overview
- Agent Framework Azure AI Search provider: https://learn.microsoft.com/en-us/agent-framework/integrations/by-component/context-providers/azure-ai-search
- Agentic retrieval overview: https://learn.microsoft.com/en-us/azure/search/agentic-retrieval-overview?tabs=quickstarts
- Python agentic retrieval quickstart: https://learn.microsoft.com/en-us/azure/search/search-get-started-agentic-retrieval?pivots=python
- Query a knowledge base: https://learn.microsoft.com/en-us/azure/search/agentic-retrieval-how-to-retrieve
- Query-time ACL and RBAC enforcement: https://learn.microsoft.com/en-us/azure/search/search-query-access-control-rbac-enforcement
- Index ACLs with the push API: https://learn.microsoft.com/en-us/azure/search/search-index-access-control-lists-and-rbac-push-api

### Workflows and multi-agent orchestration

- Workflow journey and agent-vs-workflow guidance: https://learn.microsoft.com/en-us/agent-framework/journey/workflows
- Workflow concepts: https://learn.microsoft.com/en-us/agent-framework/concepts/workflows/
- Functional workflows: https://learn.microsoft.com/en-us/agent-framework/workflows/functional
- Human-in-the-loop: https://learn.microsoft.com/en-us/agent-framework/workflows/human-in-the-loop
- Orchestration overview: https://learn.microsoft.com/en-us/agent-framework/workflows/orchestrations/
- Sequential: https://learn.microsoft.com/en-us/agent-framework/workflows/orchestrations/sequential
- Concurrent: https://learn.microsoft.com/en-us/agent-framework/workflows/orchestrations/concurrent
- Handoff: https://learn.microsoft.com/en-us/agent-framework/user-guide/workflows/orchestrations/handoff
- Group chat: https://learn.microsoft.com/en-us/agent-framework/workflows/orchestrations/group-chat

### Current extension topics

- Agent harness: https://learn.microsoft.com/en-us/agent-framework/get-started/harness
- Hosting: https://learn.microsoft.com/en-us/agent-framework/get-started/hosting

## Existing lab inventory used by the presentation plan

- Module 1: `00_client/demo.py`, `00_client/gemini_demo.py`, `01_agent_creation/demo.py`
- Module 2: `02_streaming/demo.py`, `03_structured_output/demo.py`
- Module 3: `04_function_tools/demo.py`, `05_tool_approval/demo.py`, `13_mcp/demo.py`
- Module 4: `06_sessions/demo.py`, `07_context_provider/demo.py`, `08_memory/demo.py`, `09_middleware/demo.py`
- Module 5: `10_observability/demo.py`, `11_evaluation/demo.py`
- Module 6: `12_rag_azure_ai_search/demo.py`
- Module 7: all scripts and CSVs in `20_agentic_retrieval/` and `21_identity_aware_rag/`
- Module 8: `14_workflow_basics/demo.py`, `15_workflow_hitl/demo.py`
- Module 9: `16_multi_agent_sequential/demo.py`, `17_multi_agent_concurrent/demo.py`, `18_multi_agent_handoff/demo.py`, `19_multi_agent_group_chat/demo.py`

## Verification boundary

The source links and current documentation flow were checked on 2026-08-29. Microsoft Agent Framework and several Azure AI Search capabilities evolve quickly; recheck preview status, package names, and method signatures immediately before teaching. The presentation plan is evidence-backed, but it does not itself prove that every cloud-dependent lab will run in a specific tenant without correct deployment, Search data, permissions, and quota.
