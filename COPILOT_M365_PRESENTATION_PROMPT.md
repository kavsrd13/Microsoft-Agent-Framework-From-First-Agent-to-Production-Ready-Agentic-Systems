# Copilot for Microsoft 365 presentation prompt

Copy everything between **BEGIN PROMPT** and **END PROMPT** into Copilot in PowerPoint. If Copilot limits the number of slides it can generate at once, use the same prompt in three passes: slides 1-31, slides 32-69, and slides 70-90. Preserve the same theme, slide numbers, and module order across all three passes, then combine the sections.

---

## BEGIN PROMPT

Create a polished, instructor-led technical course presentation titled:

**Building Reliable AI Agents with Microsoft Agent Framework and Microsoft Foundry (Python)**

### Purpose and audience

Design the deck for Python developers, AI engineers, solution architects, and technical trainers who understand basic Python and Azure concepts but are new to Microsoft Agent Framework. The course should be suitable for approximately three instructor-led days. It must teach concepts progressively, demonstrate them with the existing Python labs listed below, and make the distinction between classroom patterns and production patterns explicit.

The primary course goal is:

> By the end of the course, learners can create, extend, ground, evaluate, secure, and orchestrate Python agents with Microsoft Agent Framework, using Microsoft Foundry for model inference and Azure AI Search for classic, agentic, and identity-aware retrieval.

Learning objectives: learners should be able to:

1. Explain the Agent Framework architecture and choose an appropriate client/provider.
2. Authenticate to Microsoft Foundry in the classroom with `az login` and `AzureCliCredential()`.
3. Create and run an `Agent` with `FoundryChatClient`, including streaming and structured output.
4. Add typed function tools, approval gates, and MCP tools.
5. Manage multi-turn sessions, context providers, persistent memory, and middleware.
6. Instrument agents with OpenTelemetry and evaluate quality, safety, correctness, and tool behavior.
7. Build classic RAG with Azure AI Search and explain chunking, vector, hybrid, and semantic retrieval.
8. Explain and demonstrate agentic retrieval, knowledge bases, query decomposition, parallel retrieval, activity records, references, and conversational retrieval.
9. Enforce identity-aware retrieval so unauthorized content is filtered by Azure AI Search before it reaches the model.
10. Build functional workflows with human-in-the-loop pause/resume behavior.
11. Select and implement sequential, concurrent, handoff, and group-chat multi-agent patterns.
12. Apply production-readiness boundaries for identity, secrets, telemetry, evaluation, preview features, and deployment.

### Documentation flow to follow

Use Microsoft’s progressive learning flow as the backbone: first agent → tools → multi-turn conversations → memory/context → workflows. Extend it with response contracts, reliability, Azure AI Search RAG, advanced retrieval security, and multi-agent orchestration. Do not organize the material as one continuously growing demo. Each topic must remain an independently understandable concept, matching the separate lab folders.

### Deck size and structure

Create a target deck of approximately 90 slides in 16:9 format. Keep each slide focused on one idea. Use the exact nine-module order below. Every module must end with:

1. a **Lab** slide based only on the specified existing files; and
2. immediately after it, a **Knowledge check** slide with three multiple-choice questions.

Do not place additional teaching content between a module’s lab and its knowledge-check slide.

Opening section, slides 1-5:

1. Title slide.
2. Why agentic applications need a framework: models, tools, state, context, control, quality, and orchestration.
3. Course objectives.
4. Audience, prerequisites, classroom environment, and authentication assumptions.
5. Course roadmap showing all nine modules as a left-to-right learning journey.

### Nine-module course outline

#### Module 1 — Foundations, clients, authentication, and the first agent

Module outcomes: explain the framework, identify the main components, choose a model client, connect to Microsoft Foundry, and create a first agent.

Content slides should cover:

- What Microsoft Agent Framework is and where agents and workflows fit.
- Agent anatomy: client/model, instructions, tools, session, context providers, middleware, and run interface.
- The integration landscape: model providers, agent services, tools, context providers, middleware, evaluation, and UI integrations.
- Client decision: `FoundryChatClient` for direct Foundry project inference when the application owns agent behavior; `FoundryAgent` for service-managed Prompt or Hosted Agents; `GeminiChatClient` as an API-key provider example.
- Microsoft Foundry project endpoint and deployment concepts. Never place a real endpoint, tenant ID, key, token, or connection string on a slide; use placeholders or say “read from `.env`.”
- Classroom authentication: `az login` → Azure CLI identity → `AzureCliCredential()` → Microsoft Entra access token → Foundry. Contrast briefly with API keys and production managed identity.
- First-agent code anatomy: instantiate `FoundryChatClient`, pass it to `Agent`, set name/instructions, call `agent.run()`, and read the response.

Lab 1 — “Create clients and your first Foundry agent”:

- Use `00_client/demo.py`, `00_client/gemini_demo.py`, and `01_agent_creation/demo.py`.
- Show the objective, files, prerequisites, run sequence, expected outputs, and success criteria.
- Explain that Gemini uses `GEMINI_API_KEY` from `.env`, whereas the Foundry classroom path uses Entra authentication.
- Never display or invent a secret.

Knowledge-check themes: identify the correct client for direct Foundry inference, select the classroom authentication pattern, and identify the minimum components needed to create an agent.

Primary sources for this module:

- https://learn.microsoft.com/en-us/agent-framework/get-started/
- https://learn.microsoft.com/en-us/agent-framework/concepts/agents/
- https://learn.microsoft.com/en-us/agent-framework/integrations/
- https://learn.microsoft.com/en-us/agent-framework/integrations/by-component/model-providers/microsoft-foundry
- https://learn.microsoft.com/en-us/agent-framework/integrations/by-component/model-providers/google-gemini
- https://learn.microsoft.com/en-us/azure/foundry/concepts/authentication-authorization-foundry

#### Module 2 — Running agents, streaming, and structured output

Module outcomes: run agents in streaming and non-streaming modes, interpret responses and content items, and enforce typed output contracts.

Content slides should cover:

- Non-streaming `await agent.run(...)` versus `agent.run(..., stream=True)`.
- `ResponseStream`, incremental updates, finalization, and when streaming improves user experience.
- `AgentResponse`, messages, and content types such as text, function calls, function results, usage, MCP calls, and approval requests.
- Structured output as a schema contract, not merely “return JSON” in a prompt.
- Python patterns using a Pydantic model or JSON schema through `response_format`; note that support depends on the client/model.
- When to use free text versus structured output, and how to validate or handle failures.

Lab 2 — “Stream a response and return a validated object”:

- Use `02_streaming/demo.py` and `03_structured_output/demo.py`.
- Show the visible difference between streamed chunks and a final typed result.
- Include success criteria: streaming displays incrementally, and the structured response validates against the declared model.

Knowledge-check themes: streaming invocation, the purpose of `response_format`, and why provider capability matters.

Primary sources for this module:

- https://learn.microsoft.com/en-us/agent-framework/concepts/agents/running-agents
- https://learn.microsoft.com/en-us/agent-framework/agents/structured-outputs

#### Module 3 — Tools, approval, and Model Context Protocol

Module outcomes: create typed function tools, understand the model/tool execution loop, require approval for sensitive actions, and connect MCP tools safely.

Content slides should cover:

- Tool taxonomy: function tools, provider-hosted tools, file/code/web tools, MCP tools, and agent-as-tool patterns.
- Typed Python tool contracts: meaningful names, descriptions, annotated parameters, predictable return values, input validation, and idempotency.
- Tool-calling sequence diagram: user request → model selects tool → framework invokes tool → result returns to model → final answer.
- Tool approval as a control plane: `approval_mode="always_require"`, approval request content, approve/reject response, then controlled execution.
- Why approval is not authentication or authorization; production systems still need backend policy enforcement.
- MCP architecture: MCP client, server, tool discovery, invocation, and transport.
- Client-opened local/streamable HTTP MCP versus provider-hosted MCP; explain trust, network, credentials, and lifecycle differences.
- MCP safety: allow-list tools, minimize credentials, validate inputs and outputs, use timeouts, audit calls, and treat remote tool results as untrusted.

Lab 3 — “Add a tool, require approval, and call an MCP server”:

- Use `04_function_tools/demo.py`, `05_tool_approval/demo.py`, and `13_mcp/demo.py`.
- Show three independent runs, not a combined helper abstraction.
- Expected evidence: function arguments and result, a visible approval pause, and successful MCP discovery/invocation.

Knowledge-check themes: what triggers a function tool, where approval occurs, and the difference between local/client-opened and hosted MCP.

Primary sources for this module:

- https://learn.microsoft.com/en-us/agent-framework/agents/tools/
- https://learn.microsoft.com/en-us/agent-framework/agents/tools/function-tools
- https://learn.microsoft.com/en-us/agent-framework/agents/tools/tool-approval
- https://learn.microsoft.com/en-us/agent-framework/agents/tools/local-mcp-tools

#### Module 4 — Sessions, context providers, memory, and middleware

Module outcomes: preserve conversation state, inject or persist context, distinguish memory from chat history, and add cross-cutting controls without changing core agent logic.

Content slides should cover:

- Why stateless model calls lose conversational context.
- Session lifecycle: create, pass to each run, serialize, restore, and securely associate a service-side session ID with the correct application user or tenant.
- Context-provider lifecycle: before invocation, inject relevant messages/instructions/tools; after invocation, extract or persist state.
- Tools versus context providers: reactive/model-selected versus proactive/developer-controlled.
- Conversation history, user profile, RAG context, short-term state, and durable memory as different concerns.
- File-backed memory demonstration and its classroom limitations; explain production storage and data-governance concerns.
- Middleware layers: agent, function, and chat middleware; the chain/onion model; order of execution.
- Middleware use cases: logging, validation, guardrails, exception handling, result transformation, rate limiting, and policy enforcement.
- Composition diagram showing session state, context providers, middleware, model client, and tools around one agent run.

Lab 4 — “Add conversation state, custom context, durable memory, and middleware”:

- Use `06_sessions/demo.py`, `07_context_provider/demo.py`, `08_memory/demo.py`, and `09_middleware/demo.py`.
- Demonstrate each file independently.
- Success evidence: a follow-up recalls session context; a provider injects context; memory persists across a new session; middleware logs or intercepts an agent/tool call.

Knowledge-check themes: session purpose, tools versus context providers, and the correct middleware layer for intercepting a tool call.

Primary sources for this module:

- https://learn.microsoft.com/en-us/agent-framework/concepts/agents/conversations/
- https://learn.microsoft.com/en-us/agent-framework/agents/conversations/session
- https://learn.microsoft.com/en-us/agent-framework/journey/adding-context-providers
- https://learn.microsoft.com/en-us/agent-framework/integrations/by-component/context-providers/
- https://learn.microsoft.com/en-us/agent-framework/get-started/memory
- https://learn.microsoft.com/en-us/agent-framework/concepts/agents/middleware/

#### Module 5 — Observability and evaluation

Module outcomes: trace agent behavior, protect sensitive telemetry, build repeatable evaluations, and use results as an engineering feedback loop.

Content slides should cover:

- Reliability loop: instrument → collect traces/results → evaluate → diagnose → improve → rerun.
- OpenTelemetry integration and GenAI semantic conventions.
- Traces, logs, metrics, spans for agent/model/tool work, and correlation across MCP where applicable.
- Environment-driven instrumentation and exporter choices; Azure Monitor/Application Insights as a production destination and console exporters for classroom development.
- Sensitive-data warning: prompts, responses, tool arguments, and results can expose private information; enable only deliberately in controlled environments.
- Evaluation core types: `EvalItem`, evaluator, and results.
- Local deterministic checks, custom evaluators, and Microsoft Foundry cloud evaluators.
- Evaluation dimensions: relevance, coherence, groundedness, safety, task adherence, tool selection, tool input accuracy, and tool success.
- Datasets, expected outputs/tool calls, thresholds, repeated runs for consistency, and regression testing.

Lab 5 — “Trace and evaluate a live agent”:

- Use `10_observability/demo.py` and `11_evaluation/demo.py`.
- Expected evidence: visible telemetry plus evaluation pass/fail results from built-in and custom checks.
- Clearly label which checks are local and which require Foundry services.

Knowledge-check themes: OpenTelemetry signals, safe handling of sensitive telemetry, and local versus Foundry evaluators.

Primary sources for this module:

- https://learn.microsoft.com/en-us/agent-framework/agents/observability
- https://learn.microsoft.com/en-us/agent-framework/agents/evaluation

#### Module 6 — Classic RAG with Azure AI Search

Module outcomes: explain the RAG pipeline, design searchable content, compare retrieval modes, and use Azure AI Search as proactive agent context.

Content slides should cover:

- RAG flow: ingest → chunk → enrich/vectorize → index → retrieve → ground → generate → cite.
- Index design: identifiers, content fields, metadata, source fields, filterable security fields, vector fields, and semantic configuration.
- Keyword, vector, hybrid, and semantic retrieval; explain why hybrid plus semantic ranking often improves recall and ranking.
- Chunk size, overlap, metadata, citations, and relevance trade-offs.
- `AzureAISearchContextProvider` in semantic mode and how it injects retrieved content before model invocation.
- Context-provider RAG versus a model-selected search tool.
- Grounding policy: answer from supplied evidence, cite sources, and say when evidence is missing.
- Production considerations: Entra or managed identity, tenant-aware filtering, prompt-injection risk in retrieved content, latency, token budgets, and evaluation.

Lab 6 — “Ground a Foundry agent with Azure AI Search”:

- Use `12_rag_azure_ai_search/demo.py`.
- Show prerequisites, required environment variable names without values, run steps, retrieved evidence, grounded answer, and citations/source metadata.
- Explain that a configured and populated index plus Search data-plane RBAC are required for a live run.

Knowledge-check themes: the purpose of chunking, hybrid retrieval, and why retrieved content must be treated as untrusted input.

Primary sources for this module:

- https://learn.microsoft.com/en-us/azure/search/retrieval-augmented-generation-overview
- https://learn.microsoft.com/en-us/agent-framework/integrations/by-component/context-providers/azure-ai-search

#### Module 7 — Agentic retrieval and identity-aware RAG

Module outcomes: build a knowledge-base retrieval pipeline for complex questions, interpret activity and references, and enforce document permissions before grounding reaches the model.

Use the fictional travel-operations scenario from the existing CSV data. Make the learning progression explicit: index → classic semantic retrieval → agentic retrieval → inspect activity/references → conversational follow-up → Agent Framework integration → permission metadata → delegated user identity → allowed/denied proof.

Content slides should cover:

- Classic RAG versus agentic retrieval: complexity, latency, control, conversational queries, accuracy, citations, and recommended use cases.
- Agentic retrieval architecture: knowledge base, one or more knowledge sources, query-planning model, retrieval settings, Search indexes or remote sources, and the consuming agent/application.
- Runtime sequence: complex user request → use chat history → decompose/expand into focused subqueries → execute in parallel → semantic reranking → merge → return grounding response.
- The three-part retrieval output: content, activity, and references; show why transparency helps debugging and evaluation.
- Advanced controls: retrieval reasoning effort, extractive data versus answer synthesis, reranker thresholds, source selection, per-source filters, multi-source retrieval, conversation history, cost, and latency.
- Agent Framework integration using `AzureAISearchContextProvider` in agentic mode with a knowledge-base name.
- Identity-aware RAG threat model: why application-side filtering or user-supplied ACL claims are not a security boundary.
- Secure document metadata such as `userIds` and `groupIds`, or storage-derived permissions where supported.
- Query-time enforcement: the application sends a delegated end-user Search token in `x-ms-query-source-authorization`; Azure AI Search derives the user object ID and group memberships and removes unauthorized results.
- The three identity gates: authenticated end user, application/service credential to Search, and Search-side document authorization. Keep these visually separate.
- Agent Framework’s identity-aware retrieval path using a service credential plus `query_source_credential` for the user token.
- Negative proof: demonstrate that finance-only content is absent for a nonmember and visible to an authorized user. Unauthorized content must be filtered before the model invocation.
- Production boundary: classroom `AzureCliCredential()` is not a delegated multi-user web sign-in design. Production needs proper user authentication/OBO or delegated token acquisition, managed workload identity, protected token cache, current ACL ingestion, audit logs, retrieval evaluation, and fail-closed behavior.
- Clearly mark preview or version-sensitive features and advise checking current SDK/API documentation immediately before delivery.

Lab 7 — “Compare classic and agentic RAG, then enforce user access”:

- Use `20_agentic_retrieval/00_create_resources.py`, `20_agentic_retrieval/01_classic_semantic_rag.py`, `20_agentic_retrieval/02_agentic_retrieval.py`, `20_agentic_retrieval/03_agent_framework_agentic_rag.py`, and `20_agentic_retrieval/data/travel_operations.csv`.
- Then use `21_identity_aware_rag/00_create_secure_resources.py`, `21_identity_aware_rag/01_sdk_authorized_retrieval.py`, `21_identity_aware_rag/02_agent_framework_identity_rag.py`, and `21_identity_aware_rag/data/secure_travel_documents.csv`.
- Show the run order and expected evidence at every stage.
- Include an allowed/denied test matrix for an ordinary learner and a finance-group learner.
- Emphasize that the browser or prompt never supplies trusted user IDs or ACL filters.

Knowledge-check themes: what a knowledge base adds, what the activity/references outputs provide, and where document authorization must be enforced.

Primary sources for this module:

- https://learn.microsoft.com/en-us/azure/search/agentic-retrieval-overview?tabs=quickstarts
- https://learn.microsoft.com/en-us/azure/search/search-get-started-agentic-retrieval?pivots=python
- https://learn.microsoft.com/en-us/azure/search/agentic-retrieval-how-to-retrieve
- https://learn.microsoft.com/en-us/agent-framework/integrations/by-component/context-providers/azure-ai-search
- https://learn.microsoft.com/en-us/azure/search/search-query-access-control-rbac-enforcement
- https://learn.microsoft.com/en-us/azure/search/search-index-access-control-lists-and-rbac-push-api

#### Module 8 — Functional workflows and human-in-the-loop

Module outcomes: decide when an explicit workflow is more appropriate than a free-form agent, create steps and events, and pause/resume for human input.

Content slides should cover:

- Agent versus workflow decision: open-ended reasoning versus explicit, inspectable execution paths; explain that production systems often combine both.
- Functional workflow API: `@workflow`, `@step`, inputs/outputs, context, events, and typed state.
- Step sequence and data flow; streaming workflow events and terminal outputs.
- Error handling, retries, checkpoints, and durable-resume concepts.
- Human-in-the-loop request/response pattern: `ctx.request_info`, emitted request event, application collects human response, and workflow resumes.
- Tool approval inside orchestrations versus free-form user interaction; handoff is the built-in interactive orchestration.
- Design guidance: put deterministic business rules, policy, and irreversible actions in controlled code/workflow boundaries; use agents where language reasoning adds value.

Lab 8 — “Build a functional workflow and pause for review”:

- Use `14_workflow_basics/demo.py` and `15_workflow_hitl/demo.py`.
- Expected evidence: ordered step events, a visible information/approval request, and successful resume with the human response.

Knowledge-check themes: when to choose a workflow, how a request event pauses execution, and what must be persisted to resume safely.

Primary sources for this module:

- https://learn.microsoft.com/en-us/agent-framework/journey/workflows
- https://learn.microsoft.com/en-us/agent-framework/concepts/workflows/
- https://learn.microsoft.com/en-us/agent-framework/workflows/functional
- https://learn.microsoft.com/en-us/agent-framework/workflows/human-in-the-loop

#### Module 9 — Multi-agent orchestration patterns

Module outcomes: select the correct orchestration pattern, explain context flow, and demonstrate four documented multi-agent designs.

Content slides should cover:

- Why multiple agents: specialization, isolation of instructions/tools, parallel work, routing, iterative refinement, and independent evaluation.
- Do not imply that more agents automatically improve quality; discuss cost, latency, context drift, debugging, and evaluation overhead.
- Pattern comparison matrix:
  - Sequential: each agent builds on the previous output.
  - Concurrent: independent agents work in parallel and results are aggregated.
  - Handoff: an agent transfers control to a more appropriate specialist.
  - Group chat: a central manager selects speakers for iterative collaboration with shared conversation context.
  - Magentic: a manager dynamically plans and coordinates complex work; introduce conceptually because there is no current lab in this project.
- Sequential pipeline diagram and writer→reviewer example.
- Concurrent fan-out/fan-in diagram and independent specialist example.
- Handoff routing diagram, interactive behavior, specialist boundaries, and termination.
- Group-chat star topology, round-robin or custom speaker selection, shared transcript synchronization, maximum iterations, and termination.
- Context synchronization: agents do not simply share one session object; orchestrations keep relevant histories aligned according to the documented pattern.
- Pattern-selection decision tree based on dependency, independence, routing, iterative refinement, or dynamic planning.
- Multi-agent safety: least-privilege tools, limits on turns/cost, approval for high-impact actions, trace correlation, per-agent evaluation, and deterministic exit conditions.

Lab 9 — “Run four multi-agent orchestration patterns”:

- Use `16_multi_agent_sequential/demo.py`, `17_multi_agent_concurrent/demo.py`, `18_multi_agent_handoff/demo.py`, and `19_multi_agent_group_chat/demo.py`.
- Present them as four small demonstrations with the same business question where practical, so learners can compare the control flow.
- Expected evidence: pipeline output, parallel specialist outputs, a routed handoff, and an iterative group-chat transcript.

Knowledge-check themes: choose the correct pattern for dependent versus independent tasks, distinguish handoff from group chat, and identify why explicit termination matters.

Primary sources for this module:

- https://learn.microsoft.com/en-us/agent-framework/workflows/orchestrations/
- https://learn.microsoft.com/en-us/agent-framework/workflows/orchestrations/sequential
- https://learn.microsoft.com/en-us/agent-framework/workflows/orchestrations/concurrent
- https://learn.microsoft.com/en-us/agent-framework/user-guide/workflows/orchestrations/handoff
- https://learn.microsoft.com/en-us/agent-framework/workflows/orchestrations/group-chat

### Closing section

End with three closing slides:

1. **Capstone architecture — Incident Response Agent System.** Show how the concepts combine without changing the earlier labs: a triage agent, RAG over runbooks, identity-aware retrieval, diagnostic tools with approval, session and memory, middleware, telemetry, evaluation, HITL workflow, and specialist-agent handoffs. Clearly label this as the final integration proposal, not an already implemented lab.
2. **Production-readiness checklist.** Include workload identity, delegated user identity, secret management, least privilege, prompt-injection defenses, data minimization, session ownership, tool allow-lists, approval, retries/timeouts, telemetry privacy, eval gates, cost/turn limits, preview-version checks, and incident/audit evidence.
3. **Where to go next.** Point to the current Microsoft Learn Get Started additions for Agent Harness and Hosting. State that these are extension topics because this lab project does not yet contain matching demos.

Sources for the extension slide:

- https://learn.microsoft.com/en-us/agent-framework/get-started/harness
- https://learn.microsoft.com/en-us/agent-framework/get-started/hosting

### Lab-slide design rules

Every lab slide must contain these six clearly labeled elements:

1. Learning objective.
2. Files used.
3. Prerequisites and environment variable names only—never values.
4. Run sequence.
5. Expected evidence/output.
6. One discussion or troubleshooting prompt.

Use the code from the supplied project exactly as the demonstration source. Do not invent helper modules, renamed methods, deployment names, endpoints, API keys, ACL identities, or successful outputs. Keep code excerpts between 6 and 12 lines. If the actual file content is not available to you, create a code-placeholder box labeled with the exact file path instead of fabricating code.

### Knowledge-check slide design rules

Match the attached sample’s overall feel without copying Microsoft-owned artwork:

- Large title: **Knowledge check**.
- White background.
- One large, very light-gray rounded rectangle holding all questions.
- Three numbered multiple-choice questions.
- Purple circular number badges and one simple purple lightbulb-style accent.
- Three options per question.
- Mark the correct answer with a purple checkmark, as in the sample.
- Put a one-sentence rationale for each correct answer in speaker notes.
- Use source-backed questions only; no trick questions and no “all of the above.”
- Do not add a Microsoft copyright line, Microsoft logo, or statement implying this is an official Microsoft course.

### Visual and instructional design

- Use a clean, modern, Microsoft-Fluent-inspired but independently branded visual system.
- Palette: white, very light gray, near-black text, and one purple accent. Use an additional Azure blue only for architecture lines or Azure service labels.
- Use a consistent module-number badge, course title footer, and slide number.
- Prefer diagrams, process arrows, decision trees, comparison tables, and annotated code over dense bullet lists.
- Use one main idea per slide and no more than five concise bullets unless a comparison table is essential.
- Use original diagrams rather than copied screenshots. Cite the Microsoft Learn source that informed each diagram.
- Use monospace type for code and configuration names.
- Use accessible contrast, at least 24-point body text, alt text for meaningful visuals, and do not rely on color alone.
- In speaker notes, include: a 60–120 second teaching script, one misconception to address, and the complete source URL(s).

### Source and accuracy rules

- Every content slide must include a small, clickable **Source: Microsoft Learn** hyperlink in the bottom-right footer. Use the most specific source from that module’s source list.
- Put the full URL again in speaker notes. For a slide that synthesizes multiple pages, include all relevant URLs in the notes but only one or two concise source links in the footer.
- Add a final references appendix only if needed for convenience; it does not replace per-slide citations.
- Prefer the current Microsoft Learn pages listed in this prompt. Do not use blogs, unofficial tutorials, Stack Overflow, or marketing summaries for technical claims.
- Do not mix C# syntax into Python slides.
- Preserve the current Python shapes used by these labs, including `Agent`, `FoundryChatClient`, `AzureCliCredential`, `AgentSession`, `AzureAISearchContextProvider`, `@workflow`, `@step`, and the documented orchestration builders.
- Clearly mark preview, beta, or version-sensitive features. Add “Verify current SDK/API before class” where appropriate.
- Never claim a cloud-dependent lab succeeded unless the provided project contains validation evidence for that exact run. Phrase expected results as expectations, not historical proof.
- Never display real secrets, tokens, storage keys, connection strings, user object IDs, group IDs, or real customer data.

### Final quality check before presenting the deck

Before returning the presentation, verify that:

1. There are exactly nine modules in the requested order.
2. Each module ends with its lab and then immediately its knowledge-check slide.
3. All 22 existing lab topics are represented.
4. Every content slide has a specific Microsoft Learn link.
5. All lab paths match the names in this prompt.
6. No secrets or real endpoint values appear.
7. RAG, agentic retrieval, and identity-aware RAG are clearly distinguished.
8. The identity-aware RAG slide says authorization happens in Azure AI Search before model invocation.
9. Tool approval is not presented as a replacement for backend authorization.
10. The presentation does not imply that it is an official Microsoft course.

## END PROMPT
