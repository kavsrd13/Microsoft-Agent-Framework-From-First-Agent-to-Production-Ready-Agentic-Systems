# Four-day Copilot for Microsoft 365 presentation prompt

This revised prompt is based on the supplied four-day course outline but intentionally excludes the dedicated Microsoft Foundry fundamentals, FastAPI application-development, and generic deployment modules. Microsoft Foundry remains only as the model source used by the Agent Framework labs.

Recommended generation approach: create the presentation in four batches because PowerPoint Copilot might shorten a 176-slide request. Use the complete master prompt each time and finish it with one of these commands:

- Batch 1: `Generate slides 1-42 only. Do not summarize or include later slides.`
- Batch 2: `Generate slides 43-82 only, using exactly the same theme and numbering as Batch 1.`
- Batch 3: `Generate slides 83-135 only, using exactly the same theme and numbering.`
- Batch 4: `Generate slides 136-176 only, using exactly the same theme and numbering.`

Combine the four generated sections after creation.

---

## BEGIN MASTER PROMPT

Create a complete, instructor-led technical course presentation titled:

**Enterprise AI Agent Development with Microsoft Agent Framework, Python, MCP and RAG**

### Communication job

By the end of this four-day course, technical leaders, architects, and senior developers should be able to design, build, ground, secure, observe, evaluate, and orchestrate enterprise AI agents with Microsoft Agent Framework because they understand both the framework components and the control boundaries required for reliable enterprise use.

### Audience

- Solution architects
- Technical leads
- Engineering managers
- Senior developers
- AI platform owners
- AI and integration architects

Assume learners understand basic Python, asynchronous programming concepts, APIs, and Azure identity terminology. Do not assume prior Microsoft Agent Framework experience.

### Duration and teaching model

Design for **four days and 32 instructional hours**. Create **exactly 176 slides** using the slide sequence below. The deck combines instructor explanation, live demonstration, guided hands-on work, knowledge checks, and an end-of-course Incident Response Agent System capstone architecture.

Use this timing in speaker notes, not as visible timing scaffolding:

- Day 1, slides 1-42: opening, Module 1, Module 2 - 8 hours.
- Day 2, slides 43-82: Module 3, Module 4 - 8 hours.
- Day 3, slides 83-135: Module 5, Module 6, Module 7 - 8 hours.
- Day 4, slides 136-176: Module 8, Module 9, capstone and close - 8 hours.

### Scope boundary

This presentation focuses on **Microsoft Agent Framework**, not on teaching the Microsoft Foundry portal or platform administration.

Keep only the minimum Foundry information needed to run the labs:

- `FoundryChatClient` is the model client used by the Python demos.
- The model deployment and project endpoint already exist.
- Classroom users authenticate with `az login` and `AzureCliCredential()`.
- Endpoints and deployment names are read from `.env`.

Do not create lessons about:

- Foundry project creation, portal navigation, model deployment, connections, quotas, or environments.
- Model catalog selection or detailed model-cost comparisons.
- FastAPI fundamentals or building an API layer.
- Docker, App Service, Container Apps, CI/CD, frontend integration, or generic application deployment.
- Operating a service-managed Foundry Agent, except for one brief comparison with `FoundryChatClient`.

Do not remove Agent Framework security, identity, governance, observability, evaluation, RAG, workflow, or multi-agent design topics merely because they touch Azure services.

### Required course flow

Keep exactly these nine modules and this order:

1. Foundations, clients, authentication, and the first agent
2. Agent instructions, running agents, streaming, and structured output
3. Function tools, approval, enterprise tool design, and MCP
4. Sessions, context providers, memory, and middleware
5. Observability and evaluation
6. Classic RAG with Azure AI Search
7. Agentic retrieval and identity-aware RAG
8. Functional workflows and human-in-the-loop
9. Multi-agent architecture and orchestration patterns

The learning progression should mirror Microsoft’s documentation: first agent, tools, multi-turn conversations, memory/context, workflows, then advanced retrieval and orchestration. Treat every lab as a separate, focused demo rather than one growing codebase.

### Exact slide blueprint

Use the following slide numbers and audience-facing titles. Every slide must advance the learning progression. Do not compress several specified slides into one slide.

#### Day 1 - Foundations and the agent runtime

##### Opening - slides 1-8

1. **Enterprise AI Agent Development with Microsoft Agent Framework** - minimal title slide with Python, MCP, RAG, and four-day course subtitle.
2. **Enterprise agents combine reasoning with controlled action** - establish why a model alone is not an enterprise agent.
3. **This course builds from one agent to governed multi-agent systems** - show the course promise and cumulative learning arc.
4. **Course objectives** - present the measurable outcomes from this prompt.
5. **Who this course is for** - audience, assumed knowledge, and expected technical depth.
6. **The four-day learning journey** - map all nine modules across four days.
7. **The complete Agent Framework system at a glance** - one architecture view showing client, agent, instructions, tools, session, context, middleware, retrieval, workflow, telemetry, evaluation, and human control.
8. **The labs use Foundry only as the model source** - explain the setup boundary, `.env`, `az login`, `AzureCliCredential()`, and the rule that no secrets appear in slides.

##### Module 1 - Foundations, clients, authentication, and the first agent - slides 9-25

9. **Module 1: Build the mental model before writing the agent** - module outcomes.
10. **Chatbots answer; agents reason, use tools, and manage state** - evolution from assistants to agents without overstating autonomy.
11. **An agent is a controlled runtime around a model** - define the Agent Framework agent abstraction.
12. **Seven components shape agent behaviour** - model/client, instructions, tools, knowledge, context, memory, and orchestration.
13. **One run passes through several control layers** - execution pipeline from caller through middleware/context/client/tools to response.
14. **Deterministic code remains the safest choice for fixed logic** - contrast deterministic functions with model-driven decisions.
15. **Use a workflow when the execution path must be explicit** - agent-versus-workflow distinction.
16. **Agent, workflow, harness, skill, or function: choose by control need** - concise selection matrix; introduce harness and skills only as awareness topics.
17. **Architecture grows from one agent to coordinated specialists** - preview single-agent, agent-as-tool, and multi-agent patterns.
18. **Agent Framework separates capabilities from providers** - integrations landscape: model providers, tools, context providers, middleware, evaluation, and UI.
19. **Choose the client that matches who owns the agent definition** - client/provider decision criteria.
20. **`FoundryChatClient` keeps agent behaviour in application code** - show the direct-inference pattern used throughout the labs.
21. **`FoundryAgent` is different because the service owns the definition** - one-slide comparison only; do not teach Foundry portal management.
22. **Classroom and production identities solve different problems** - `AzureCliCredential()` for training; managed workload identity and delegated user identity for production.
23. **Lab 1A: Connect to the model clients** - use `00_client/demo.py` and `00_client/gemini_demo.py`; objective, prerequisites, exact files, environment-variable names, run command placeholders, and expected evidence.
24. **Lab 1B: Create and invoke the first agent** - use `01_agent_creation/demo.py`; identify client, name, instructions, run call, and response; include success criteria and one troubleshooting question.
25. **Knowledge check: Foundations and first-agent choices** - three multiple-choice questions with answers and notes-based rationales.

Module 1 sources:

- https://learn.microsoft.com/en-us/agent-framework/get-started/
- https://learn.microsoft.com/en-us/agent-framework/concepts/agents/
- https://learn.microsoft.com/en-us/agent-framework/integrations/
- https://learn.microsoft.com/en-us/agent-framework/integrations/by-component/model-providers/microsoft-foundry
- https://learn.microsoft.com/en-us/agent-framework/integrations/by-component/model-providers/google-gemini
- https://learn.microsoft.com/en-us/azure/foundry/concepts/authentication-authorization-foundry
- https://learn.microsoft.com/en-us/agent-framework/get-started/harness

##### Module 2 - Agent instructions, running agents, streaming, and structured output - slides 26-42

26. **Module 2: Turn an agent definition into predictable behaviour** - module outcomes.
27. **Instructions are the agent's operating contract** - purpose and limits of instructions.
28. **A clear role narrows the agent's decision space** - responsibility, audience, tone, and task definition.
29. **Business rules define what the agent may and may not do** - boundaries, refusal, escalation, and unsupported requests.
30. **Response requirements should be explicit and testable** - format, completeness, citation, and abstention expectations.
31. **Grounding and abstention reduce unsupported answers** - instructions cannot replace retrieval or validation.
32. **Guardrails need code and policy, not prompt text alone** - distinguish instruction-level guidance from enforced controls.
33. **Iterative testing exposes ambiguous instructions** - draft, test, inspect, revise, regress.
34. **Non-streaming returns one complete `AgentResponse`** - core Python invocation.
35. **Streaming improves perceived responsiveness** - `agent.run(..., stream=True)` and incremental updates.
36. **A `ResponseStream` can be consumed and finalized** - async iteration and final response.
37. **Responses contain more than final answer text** - messages and content items.
38. **Content types reveal tool calls, usage, approvals, and errors** - teach safe inspection of response content.
39. **Structured output turns a response into a validated contract** - Pydantic model and JSON schema.
40. **Lab 2A: Compare streaming with a complete response** - use `02_streaming/demo.py`; show expected console behaviour and finalization.
41. **Lab 2B: Produce a validated structured object** - use `03_structured_output/demo.py`; show model schema, validation evidence, and failure discussion.
42. **Knowledge check: Instructions, streaming, and output contracts** - three multiple-choice questions.

Module 2 sources:

- https://learn.microsoft.com/en-us/agent-framework/concepts/agents/running-agents
- https://learn.microsoft.com/en-us/agent-framework/agents/structured-outputs
- https://learn.microsoft.com/en-us/agent-framework/get-started/your-first-agent

#### Day 2 - Tools, MCP, state, context, and middleware

##### Module 3 - Function tools, approval, enterprise tool design, and MCP - slides 43-62

43. **Module 3: Give agents capabilities without surrendering control** - module outcomes.
44. **Tools let an agent observe or change external systems** - why tools increase both usefulness and risk.
45. **Agent Framework supports local and provider-hosted tools** - function, code, file, web, MCP, and agent-as-tool taxonomy.
46. **A typed function becomes a model-readable contract** - name, description, annotations, schema, and return value.
47. **Good descriptions improve tool selection** - contrast vague and precise tool metadata.
48. **The tool loop alternates model decisions with deterministic execution** - user, model, call, execution, result, final answer.
49. **Validate arguments before business logic executes** - types, ranges, enums, identifiers, and tenant boundaries.
50. **Structured tool results are easier to reason about and evaluate** - stable return contracts and source metadata.
51. **Retries, timeouts, and fallbacks belong in tool implementation** - transient versus permanent failures.
52. **Idempotency limits damage when calls are retried** - side effects, correlation IDs, and duplicate prevention.
53. **Least privilege applies separately to every tool** - credentials, scopes, data access, and allow-lists.
54. **Approval pauses sensitive execution before the side effect** - approval-mode sequence.
55. **Approval is not authentication or authorization** - explain the separate controls.
56. **MCP standardizes discovery and invocation across tool servers** - what problem MCP solves.
57. **MCP exposes tools, resources, and prompts through a client-server protocol** - architecture and lifecycle.
58. **STDIO and Streamable HTTP serve different deployment boundaries** - local versus remote transports.
59. **MCP trust depends on server identity, tool allow-lists, and versioning** - authentication, authorization, approval, audit, and supply-chain considerations.
60. **Lab 3A: Add a typed function and require approval** - use `04_function_tools/demo.py` and `05_tool_approval/demo.py`; expected tool call, approval request, and outcome.
61. **Lab 3B: Connect an agent to an MCP server** - use `13_mcp/demo.py`; discovery, invocation, output, and troubleshooting.
62. **Knowledge check: Tools, approval, and MCP boundaries** - three multiple-choice questions.

Module 3 sources:

- https://learn.microsoft.com/en-us/agent-framework/agents/tools/
- https://learn.microsoft.com/en-us/agent-framework/agents/tools/function-tools
- https://learn.microsoft.com/en-us/agent-framework/agents/tools/tool-approval
- https://learn.microsoft.com/en-us/agent-framework/agents/tools/local-mcp-tools

##### Module 4 - Sessions, context providers, memory, and middleware - slides 63-82

63. **Module 4: Manage state and policy around every agent run** - module outcomes.
64. **Stateless calls forget what happened before** - why conversation state must be explicit.
65. **`AgentSession` carries conversation state across runs** - core lifecycle.
66. **The same session enables coherent follow-up questions** - multi-turn example.
67. **Serialized sessions must remain bound to the correct user** - restoration and ownership security.
68. **Context providers add information before the model is invoked** - proactive context concept.
69. **Before and after hooks support retrieval and persistence** - context-provider lifecycle.
70. **Tools are reactive; context providers are proactive** - comparison table and selection rule.
71. **Context can represent user, tenant, role, and business state** - enterprise examples without inventing data.
72. **Conversation history and durable memory solve different problems** - do not conflate them.
73. **Short-term context supports the task; long-term memory spans sessions** - scope and retention.
74. **File-backed memory is useful for teaching, not enterprise governance** - classroom limitations and production storage concerns.
75. **Summarization and compaction control context growth** - token budget, relevance, and loss risk.
76. **Middleware handles concerns shared across many agents** - why cross-cutting logic belongs outside agent instructions.
77. **Agent, function, and chat middleware intercept different boundaries** - three-layer comparison.
78. **Middleware forms an ordered chain around execution** - onion model and order effects.
79. **Security middleware must fail closed and preserve traceability** - validation, tenant injection, filtering, rate limits, exceptions, and correlation.
80. **Lab 4A: Use sessions, context providers, and file memory** - use `06_sessions/demo.py`, `07_context_provider/demo.py`, and `08_memory/demo.py`; separate demonstrations and evidence.
81. **Lab 4B: Intercept an agent and tool call with middleware** - use `09_middleware/demo.py`; identify layer, before/after behaviour, and output.
82. **Knowledge check: State, context, memory, and middleware** - three multiple-choice questions.

Module 4 sources:

- https://learn.microsoft.com/en-us/agent-framework/concepts/agents/conversations/
- https://learn.microsoft.com/en-us/agent-framework/agents/conversations/session
- https://learn.microsoft.com/en-us/agent-framework/journey/adding-context-providers
- https://learn.microsoft.com/en-us/agent-framework/integrations/by-component/context-providers/
- https://learn.microsoft.com/en-us/agent-framework/get-started/memory
- https://learn.microsoft.com/en-us/agent-framework/concepts/agents/middleware/

#### Day 3 - Reliability and enterprise retrieval

##### Module 5 - Observability and evaluation - slides 83-96

83. **Module 5: Reliability starts with evidence** - module outcomes.
84. **The engineering loop is instrument, evaluate, diagnose, and improve** - connect telemetry to quality work.
85. **Agent Framework emits OpenTelemetry traces, logs, and metrics** - three signals and GenAI semantic conventions.
86. **A trace should connect model, tool, MCP, and workflow activity** - span topology.
87. **Exporters route telemetry to local or production backends** - console, OTLP, Azure Monitor/Application Insights.
88. **Correlation IDs connect distributed work across boundaries** - request, user-safe identifiers, and trace context.
89. **Sensitive telemetry can expose prompts, responses, and tool data** - safe default and controlled debugging.
90. **Evaluation converts agent behaviour into repeatable evidence** - purpose and quality gates.
91. **`EvalItem`, evaluator, and results form the evaluation model** - core types.
92. **Local checks and Foundry evaluators serve different feedback loops** - deterministic inner loop versus cloud LLM-as-judge.
93. **Datasets, expected outputs, repetitions, and thresholds enable regression testing** - evaluation design.
94. **Lab 5A: Capture an agent trace** - use `10_observability/demo.py`; expected spans/signals and privacy discussion.
95. **Lab 5B: Run built-in and custom evaluations** - use `11_evaluation/demo.py`; local versus service-backed evidence.
96. **Knowledge check: Observability and evaluation evidence** - three multiple-choice questions.

Module 5 sources:

- https://learn.microsoft.com/en-us/agent-framework/agents/observability
- https://learn.microsoft.com/en-us/agent-framework/agents/evaluation

##### Module 6 - Classic RAG with Azure AI Search - slides 97-113

97. **Module 6: Ground agent responses in retrievable evidence** - module outcomes.
98. **RAG separates enterprise knowledge from model parameters** - why retrieval exists.
99. **The RAG lifecycle starts before the user asks a question** - ingest, parse, chunk, enrich, vectorize, and index.
100. **Chunking trades context completeness against retrieval precision** - size, overlap, and document structure.
101. **Embeddings map semantic similarity into vector space** - explain conceptually without unnecessary mathematics.
102. **A useful index preserves content, metadata, source, and security fields** - schema design.
103. **Keyword, vector, semantic, and hybrid retrieval solve different matching problems** - comparison.
104. **Hybrid retrieval improves recall; semantic ranking improves ordering** - combined query rationale.
105. **Query-time retrieval must remain focused and filterable** - top-k, filters, thresholds, and metadata.
106. **`AzureAISearchContextProvider` injects evidence before model invocation** - semantic-mode Agent Framework integration.
107. **A context provider retrieves automatically; a tool retrieves on demand** - selection rule.
108. **Grounded answers should preserve citations and source metadata** - attribution flow.
109. **The agent should abstain when the retrieved evidence is insufficient** - missing-evidence behaviour.
110. **Retrieved documents are untrusted input** - indirect prompt injection, tenant filtering, latency, token budgets, and evaluation.
111. **Lab 6A: Connect an agent to an Azure AI Search index** - use `12_rag_azure_ai_search/demo.py`; configuration names, retrieval flow, and expected answer.
112. **Lab 6B: Inspect grounding, citations, and failure conditions** - verify sources, empty results, missing RBAC, and unpopulated-index symptoms.
113. **Knowledge check: Classic RAG and search quality** - three multiple-choice questions.

Module 6 sources:

- https://learn.microsoft.com/en-us/azure/search/retrieval-augmented-generation-overview
- https://learn.microsoft.com/en-us/agent-framework/integrations/by-component/context-providers/azure-ai-search

##### Module 7 - Agentic retrieval and identity-aware RAG - slides 114-135

114. **Module 7: Improve complex retrieval without weakening authorization** - module outcomes.
115. **Complex questions often require several focused searches** - motivation for agentic retrieval.
116. **Classic and agentic retrieval optimize different priorities** - compare simplicity, latency, control, query complexity, transparency, and accuracy.
117. **A knowledge base coordinates one or more knowledge sources** - architecture.
118. **The query-planning model decides how to search** - planning role and boundary.
119. **Decomposition turns one complex request into focused subqueries** - include conversational context and query expansion.
120. **Parallel retrieval, semantic reranking, and merging improve coverage** - runtime pipeline.
121. **Content, activity, and references expose both evidence and retrieval behaviour** - three-part output.
122. **Conversation history makes follow-up retrieval context-aware** - multi-turn example.
123. **Reasoning effort and output mode trade quality against latency and cost** - minimal/low/medium where supported; extractive versus answer synthesis.
124. **Source selection and filters constrain multi-source retrieval** - knowledge sources, always-query choices, and per-source filters.
125. **Agent Framework can use a knowledge base as automatic context** - agentic mode of `AzureAISearchContextProvider`.
126. **Identity-aware RAG starts with a threat model** - explain data leakage caused by retrieval without permissions.
127. **Documents carry user, group, or storage-derived permission metadata** - `userIds`, `groupIds`, and supported inheritance patterns.
128. **Three identity gates must remain separate** - end-user identity, service/application identity, and Search-side document authorization.
129. **Azure AI Search derives user and group access from a delegated token** - `x-ms-query-source-authorization` and query-time enforcement.
130. **`query_source_credential` forwards user identity through the Agent Framework provider** - service credential versus delegated query credential.
131. **A negative test proves unauthorized content never reached the model** - allowed/denied matrix, fail-closed errors, audit, and production delegated identity.
132. **Lab 7A: Build resources and compare classic retrieval** - use `20_agentic_retrieval/00_create_resources.py`, `20_agentic_retrieval/01_classic_semantic_rag.py`, and `20_agentic_retrieval/data/travel_operations.csv`.
133. **Lab 7B: Inspect agentic planning, activity, references, and follow-ups** - use `20_agentic_retrieval/02_agentic_retrieval.py` and `20_agentic_retrieval/03_agent_framework_agentic_rag.py`.
134. **Lab 7C: Prove identity-aware allowed and denied results** - use every script and CSV in `21_identity_aware_rag/`; show ordinary-user and finance-group tests; never accept ACL claims from the prompt or browser.
135. **Knowledge check: Agentic retrieval and permission enforcement** - three multiple-choice questions.

Module 7 sources:

- https://learn.microsoft.com/en-us/azure/search/agentic-retrieval-overview?tabs=quickstarts
- https://learn.microsoft.com/en-us/azure/search/search-get-started-agentic-retrieval?pivots=python
- https://learn.microsoft.com/en-us/azure/search/agentic-retrieval-how-to-retrieve
- https://learn.microsoft.com/en-us/agent-framework/integrations/by-component/context-providers/azure-ai-search
- https://learn.microsoft.com/en-us/azure/search/search-query-access-control-rbac-enforcement
- https://learn.microsoft.com/en-us/azure/search/search-index-access-control-lists-and-rbac-push-api

#### Day 4 - Controlled workflows and multi-agent architecture

##### Module 8 - Functional workflows and human-in-the-loop - slides 136-152

136. **Module 8: Make complex execution explicit and resumable** - module outcomes.
137. **Agents choose dynamically; workflows define inspectable paths** - core distinction.
138. **Production systems often put agents inside controlled workflows** - combined design.
139. **Functional workflows express steps, context, inputs, and outputs** - `@workflow` and `@step`.
140. **Executors, edges, events, and routing make data flow visible** - conceptual workflow model.
141. **Sequential, conditional, and parallel patterns shape control flow** - pattern comparison.
142. **Streaming events reveal intermediate work and terminal output** - event handling.
143. **Errors, retries, and timeouts need explicit workflow policy** - failure design.
144. **Checkpoints make interruption and recovery durable** - state and resume.
145. **A workflow can combine agents, Python functions, APIs, and MCP tools** - composition.
146. **Human-in-the-loop starts with an explicit information request** - `ctx.request_info` and request event.
147. **The application responds, then the workflow resumes from controlled state** - pause/respond/resume sequence.
148. **Tool approval and conversational handoff solve different human-control needs** - comparison.
149. **Irreversible actions belong behind deterministic and auditable boundaries** - approval, policy, and evidence.
150. **Lab 8A: Build and stream a functional workflow** - use `14_workflow_basics/demo.py`; steps, events, and terminal output.
151. **Lab 8B: Pause for human review and resume safely** - use `15_workflow_hitl/demo.py`; pending request, response, and resumed output.
152. **Knowledge check: Workflows, checkpoints, and HITL** - three multiple-choice questions.

Module 8 sources:

- https://learn.microsoft.com/en-us/agent-framework/journey/workflows
- https://learn.microsoft.com/en-us/agent-framework/concepts/workflows/
- https://learn.microsoft.com/en-us/agent-framework/workflows/functional
- https://learn.microsoft.com/en-us/agent-framework/workflows/human-in-the-loop

##### Module 9 - Multi-agent architecture and orchestration patterns - slides 153-171

153. **Module 9: Coordinate specialists only when the task justifies them** - module outcomes.
154. **Multiple agents create specialization, not automatic intelligence** - benefits and limits.
155. **Extra agents add latency, cost, context drift, and debugging work** - anti-pattern warning.
156. **Specialist, router, supervisor, reviewer, and aggregator are distinct roles** - role map.
157. **The orchestration pattern should follow task dependency** - overview of sequential, concurrent, handoff, group chat, and magentic.
158. **Sequential orchestration builds one result through a pipeline** - dependent tasks and writer-reviewer example.
159. **Concurrent orchestration reduces latency for independent work** - fan-out/fan-in and aggregation.
160. **Handoff routes the conversation to the right specialist** - dynamic transfer and interactive behaviour.
161. **Group chat supports iterative refinement with managed speaker selection** - star topology, shared transcript, and termination.
162. **Magentic orchestration adds manager-led planning for complex work** - awareness only because no corresponding project lab exists.
163. **Agent-as-tool offers delegation without a full orchestration** - when a parent agent should invoke a specialist.
164. **Context synchronization does not mean sharing one session object** - documented orchestration behaviour.
165. **A decision tree prevents over-engineered multi-agent designs** - choose by dependency, independence, routing, iteration, or planning.
166. **Safe orchestration needs least privilege, turn limits, and deterministic exits** - oversight and cost controls.
167. **Evaluate both each specialist and the complete trajectory** - per-agent quality, routing accuracy, tool behaviour, and final outcome.
168. **Lab 9A: Compare sequential and concurrent coordination** - use `16_multi_agent_sequential/demo.py` and `17_multi_agent_concurrent/demo.py`.
169. **Lab 9B: Compare handoff and group-chat interaction** - use `18_multi_agent_handoff/demo.py` and `19_multi_agent_group_chat/demo.py`.
170. **Lab 9C: Select the pattern for four enterprise scenarios** - guided comparison using the four executed demos; do not invent a fifth implementation.
171. **Knowledge check: Multi-agent pattern selection** - three multiple-choice questions.

Module 9 sources:

- https://learn.microsoft.com/en-us/agent-framework/workflows/orchestrations/
- https://learn.microsoft.com/en-us/agent-framework/workflows/orchestrations/sequential
- https://learn.microsoft.com/en-us/agent-framework/workflows/orchestrations/concurrent
- https://learn.microsoft.com/en-us/agent-framework/user-guide/workflows/orchestrations/handoff
- https://learn.microsoft.com/en-us/agent-framework/workflows/orchestrations/group-chat

##### Capstone and close - slides 172-176

172. **Capstone challenge: Design a governed Incident Response Agent System** - business problem, users, high-impact decisions, data sources, and desired outcome.
173. **The capstone combines every framework control layer** - architecture with triage agent, identity-aware runbook retrieval, diagnostic tools, approval, session/context, middleware, workflow, specialists, telemetry, and evaluation.
174. **One incident should be traceable from request to resolution** - end-to-end sequence from authentication and retrieval to tool approval, workflow resume, specialist handoff, final answer, trace, and evaluation.
175. **Production readiness is a system property** - workload identity, delegated user token, secret management, least privilege, prompt-injection defence, session ownership, approvals, retries, privacy-safe telemetry, eval gates, cost limits, and preview-version checks.
176. **The course ends with a repeatable engineering method** - synthesize choose control level → build small → ground → secure → observe → evaluate → orchestrate; include next links for harness and hosting as optional future learning.

Closing sources:

- https://learn.microsoft.com/en-us/agent-framework/get-started/harness
- https://learn.microsoft.com/en-us/agent-framework/get-started/hosting

### Lab slide requirements

Every lab slide must include these elements:

1. Learning objective.
2. Exact project files used.
3. Prerequisites and environment-variable names only - never their values.
4. Run sequence.
5. Expected evidence or output.
6. Success criteria.
7. One troubleshooting or reflection question.

Use only the existing code from the supplied lab project. Do not invent helper files, endpoints, deployment names, API keys, user IDs, group IDs, command output, or successful cloud results. Keep code excerpts to 6-12 lines. If the actual code is unavailable, create an accurately labelled code-placeholder box containing the exact file path instead of fabricating source code.

Use `FoundryChatClient` and `AzureCliCredential()` consistently for Foundry-backed Python demos. The Gemini client is only a client-comparison example and reads `GEMINI_API_KEY` from `.env`.

### Knowledge-check design

Every module must end with one knowledge-check slide immediately after its final lab slide.

Match the supplied example’s feel without copying Microsoft-owned branding:

- Large title: **Knowledge check**.
- White background.
- One large light-gray rounded rectangle containing all questions.
- Three numbered multiple-choice questions.
- Purple circular number markers.
- Three options for every question.
- Purple checkmark on the correct answer.
- One simple purple lightbulb-style accent.
- One-sentence rationale per answer in speaker notes.
- No trick questions, no “all of the above,” and no unsupported claims.
- Do not use a Microsoft logo, Microsoft copyright footer, or wording that implies this is official Microsoft courseware.

### Visual system

- 16:9 widescreen.
- Clean, modern, Microsoft-Fluent-inspired but independently branded style.
- White and very-light-gray foundation, near-black text, purple accent, and restrained Azure blue for service boundaries.
- At least 50-point deck title, 35-point slide titles, 24-point subheads, and 16-point body text.
- Use takeaway-style slide titles that state the teaching point, not generic labels.
- Prefer one strong composition per slide. Avoid dense dashboards, card grids, pills, tabs, or fake application interfaces.
- Use diagrams only when they materially improve comprehension: agent pipeline, tool loop, context lifecycle, middleware chain, RAG flow, identity gates, workflow pause/resume, and orchestration patterns.
- Use comparison tables for exact mappings and pattern selection.
- Use original diagrams, not copied Microsoft documentation screenshots.
- Use monospace typography for Python, class names, method names, headers, and environment variables.
- Use accessible contrast and alt text. Never rely on color alone.
- Do not reuse the same decorative image repeatedly.

### Speaker notes

For every content slide, add speaker notes containing:

- A 90-180 second teaching explanation.
- The connection to the previous and next slide.
- One common misconception or likely learner question.
- One practical enterprise example when useful.
- A `[Sources]` block containing the complete Microsoft Learn URL or URLs.

For lab slides, add facilitation notes, expected observations, likely errors, and a reminder not to display secrets.

### Source and accuracy rules

- Every content slide must contain a small clickable **Source: Microsoft Learn** link in the bottom-right footer.
- Use the most specific source in that module’s source list.
- Repeat full URLs in the `[Sources]` block of speaker notes.
- The final references do not replace per-slide links.
- Use Microsoft Learn and the existing labs as the primary technical authorities. Do not use blogs or unofficial tutorials for implementation claims.
- Use Python syntax only. Do not mix in C# examples.
- Preserve the current lab API shapes: `Agent`, `FoundryChatClient`, `AzureCliCredential`, `AgentSession`, `AzureAISearchContextProvider`, `@workflow`, `@step`, and documented orchestration builders.
- Clearly label preview, beta, experimental, or version-sensitive capabilities and add “Verify current SDK/API before class” in speaker notes.
- Never claim that a live cloud lab succeeded unless the supplied validation evidence proves that exact run.
- Treat retrieved content and MCP output as untrusted input.
- State explicitly that tool approval is not a substitute for backend authorization.
- State explicitly that identity-aware retrieval is enforced by Azure AI Search before unauthorized content can reach the model.
- Never display a real endpoint, storage key, connection string, token, object ID, group ID, tenant ID, or customer record.

### Final quality audit

Before returning the presentation, verify all of the following:

1. The deck contains exactly 176 slides.
2. Slides 1-42 are Day 1, 43-82 are Day 2, 83-135 are Day 3, and 136-176 are Day 4.
3. All nine modules appear once and in the specified order.
4. Every module’s labs are immediately followed by its knowledge check.
5. All existing demo folders from `00_client` through `21_identity_aware_rag` are represented where mapped.
6. Foundry portal administration, FastAPI, and generic deployment content are absent.
7. Foundry appears only as the existing model source and authentication dependency for Agent Framework labs.
8. Every non-trivial technical slide has a specific Microsoft Learn source link.
9. RAG, agentic retrieval, and identity-aware RAG are visibly distinct.
10. Identity-aware retrieval is described as Search-side enforcement before model invocation.
11. No secrets or real configuration values appear.
12. The deck does not imply that it is official Microsoft courseware.

## END MASTER PROMPT

