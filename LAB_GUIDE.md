# Classroom lab guide

Every lab is independent. Run it from the project root, explain the one new idea, and finish with the small challenge. The folder number is an identifier; the order below is the recommended teaching order.

For participant delivery, start at [html_labs/index.html](html_labs/index.html). The HTML workbook expands every entry below into complete environment, resource, build, validation, and knowledge-check instructions.

## Phase 1 - Clients and agent responses

| Lab | Classroom story | Five-minute challenge |
|---|---|---|
| [00 First agent](00_client/README.md) | Configure Foundry, create and run an Agent, stream a second response, then optionally compare Gemini. | Give the complete-response and streaming agents the same prompt and compare delivery behavior. |
| [03 Structured output](03_structured_output/README.md) | Turn a city recommendation into typed data. | Add one field to the Pydantic model and ask the agent to populate it. |

## Phase 2 - Tools, approval, state, and memory

| Lab | Classroom story | Five-minute challenge |
|---|---|---|
| [04 Function tools](04_function_tools/README.md) | Let a weather agent call trusted local code. | Add one more known city to the tool. |
| [05 Tool approval](05_tool_approval/README.md) | Pause before a calendar-changing action. | Reject the request once, then explain why approval matters. |
| [13 MCP server](13_mcp/README.md) | Build a small change-risk MCP server, test it locally, then inspect the shared authenticated Azure deployment. | Compare one local and one remote fictional change record. |
| [27 MCP agent client](27_mcp_agent_client/README.md) | Let a Foundry-backed Agent Framework agent use the shared live MCP server. | Change the requested change ID and verify the answer remains grounded in tool output. |
| [06 Sessions](06_sessions/README.md) | Remember a learner preference across turns. | Start a fresh session and observe what is no longer remembered. |
| [07 Context provider](07_context_provider/README.md) | Add dynamic classroom context before a run. | Change the injected learner name or role. |
| [08 Memory](08_memory/README.md) | Carry a fact into a new session using file-backed memory. | Store a second preference and retrieve both in a new session. |

## Phase 3 - Guardrails, telemetry, and quality

| Lab | Classroom story | Five-minute challenge |
|---|---|---|
| [09 Middleware](09_middleware/README.md) | Block a sensitive request and time a tool call. | Add one more blocked keyword and verify termination. |
| [10 Observability](10_observability/README.md) | Trace an operations agent and build an HTML metrics dashboard. | Identify the slowest run and the run with the most tokens. |
| [11 Evaluation](11_evaluation/README.md) | Test a weather assistant against repeatable checks. | Add one query that should fail the keyword check. |
| [22 Development lifecycle](22_development_lifecycle/README.md) | Compare a baseline and candidate before release. | Improve only the candidate instructions and record a release decision. |

## Phase 4 - RAG progression

| Lab | Classroom story | Five-minute challenge |
|---|---|---|
| [12 Classic RAG](12_rag_azure_ai_search/README.md) | Ground an answer in an Azure AI Search index. | Ask one answerable and one unanswerable question. |
| [20 Agentic retrieval](20_agentic_retrieval/README.md) | Compare one-shot search with planned retrieval and citations. | Inspect the retrieval activity and count the subqueries. |
| [21 Identity-aware RAG](21_identity_aware_rag/README.md) | Return only documents the signed-in user can access. | Compare the allowed classroom fact with the denied finance-only fact. |

## Phase 5 - Workflows and multi-agent patterns

| Lab | Classroom story | Five-minute challenge |
|---|---|---|
| [14 Workflow basics](14_workflow_basics/README.md) | Classify a document and then summarize it. | Add a different document category. |
| [15 Workflow HITL](15_workflow_hitl/README.md) | Pause a writing workflow for human feedback. | Give two different review comments and compare revisions. |
| [16 Sequential agents](16_multi_agent_sequential/README.md) | Draft marketing copy, then review it. | Make the reviewer enforce one measurable rule. |
| [17 Concurrent agents](17_multi_agent_concurrent/README.md) | Research, market, and review a launch in parallel. | Add one specialist with a distinct perspective. |
| [18 Handoff](18_multi_agent_handoff/README.md) | Route an order question to the right specialist. | Ask an unrelated question and inspect the routing behavior. |
| [19 Group chat](19_multi_agent_group_chat/README.md) | Improve a technical answer through peer review. | Change one reviewer from safety to beginner clarity. |

## Phase 6 - Hosting and optimization

| Lab | Classroom story | Five-minute challenge |
|---|---|---|
| [23 Basic Hosted agent](23_hosted_agent_basic/README.md) | Put a simple Agent behind a Responses-compatible server. | Change only the agent instructions and keep hosting code unchanged. |
| [24 Hosted-agent identity](24_hosted_agent_identity/README.md) | Read a travel policy from Blob Storage without a key. | Remove the reader role and compare authentication with authorization. |
| [25 Agent Optimizer](25_agent_optimizer/README.md) | Improve a weak baseline using measurable evaluation cases. | Add one safety-focused evaluation case. |
| [26 Browser Automation](26_browser_automation/README.md) | Read a synthetic flight-status page without performing write actions. | Find the cancelled flight and return the documented next action. |

## Delivery rule

Keep each demonstration focused on one new concept. If an Azure prerequisite is unavailable, explain the boundary and use the source code walkthrough rather than adding fallback code that hides the real service behavior.
