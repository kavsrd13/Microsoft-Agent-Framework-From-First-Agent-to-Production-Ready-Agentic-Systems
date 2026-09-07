import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const OUT = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.resolve(OUT, "..");
const ASSETS = path.join(OUT, "assets");

const CORE = "agent-framework-core==1.15.0 agent-framework-foundry==1.11.0 azure-identity==1.25.3 python-dotenv==1.2.3";
const PYDANTIC = `${CORE} pydantic==2.13.5`;
const ORCHESTRATIONS = `${CORE} agent-framework-orchestrations==1.1.1`;
const SEARCH = `${CORE} agent-framework-azure-ai-search==1.0.0b260813 azure-search-documents==12.1.0b1`;
const HOSTING = `${CORE} agent-framework-foundry-hosting==1.0.0b260827`;

const labs = [
  {
    id: "00", slug: "first-agent", folder: "00_client", title: "Create, Run, and Stream Your First Agent",
    phase: "Phase 1 · Clients and agent responses", level: "100", duration: "110 min", resource: "Foundry + optional Gemini",
    why: "This combined introduction follows one complete learning path: understand the model client, create an Agent, run it for a complete response, stream a second response, and finally compare the same Agent abstraction with an optional Gemini client.",
    objectives: ["Configure FoundryChatClient with AzureCliCredential", "Create an Agent with a name and instructions", "Run the agent and inspect the complete AgentResponse", "Stream incremental response updates", "Compare Foundry and Gemini client configuration without changing the Agent programming model"],
    concepts: [["Chat client", "Connects Agent Framework to a model provider."], ["AzureCliCredential", "Uses the identity established by az login for classroom access."], ["Agent", "Combines a client, instructions, tools, context, and a run interface."], ["AgentResponse", "Contains the completed model response and related metadata."], ["Streaming", "Returns incremental response updates through async iteration."], ["Provider portability", "The Agent interface stays consistent when the model provider changes."]],
    packages: `${CORE} agent-framework-gemini==1.0.0b260813`, needsFoundry: true,
    env: ["GEMINI_API_KEY=<your Google AI Studio key>", "GEMINI_MODEL=gemini-3.6-flash"],
    resources: ["Use an instructor-provided Foundry project and model deployment, or create them in Microsoft Foundry.", "Confirm that the signed-in Azure CLI identity can invoke the Foundry model deployment.", "For the optional Gemini comparison, create a Google AI Studio API key and place it only in the git-ignored .env file."],
    files: [
      { source: "01_agent_creation/demo.py", target: "01_agent_creation/student_first_agent.py", label: "Part 1 — Create and run the first Foundry agent", purpose: "Make the Foundry client, classroom authentication, Agent instructions, run call, and completed response visible in one small program." },
      { source: "02_streaming/demo.py", target: "02_streaming/student_streaming_agent.py", label: "Part 2 — Stream the Foundry agent response", purpose: "Reuse the same client and Agent concepts while consuming response updates as they arrive." },
      { source: "00_client/gemini_demo.py", target: "00_client/student_gemini_agent.py", label: "Part 3 — Compare an optional Gemini client", purpose: "Change the provider-specific client and authentication while preserving the Agent programming model." },
    ],
    run: ["python .\\01_agent_creation\\student_first_agent.py", "python .\\02_streaming\\student_streaming_agent.py", "# Optional provider comparison", "python .\\00_client\\student_gemini_agent.py"],
    expected: ["The first program prints the capital of France through a completed AgentResponse.", "The second program displays a one-sentence fact incrementally and finishes with one clean newline.", "If Gemini credentials are configured, the optional program returns a short definition through the same Agent abstraction.", "No credential value is printed or stored in a Python file."],
    challenge: "Give the non-streaming and streaming agents the same prompt and instructions, then compare only how the response is delivered.",
    knowledge: { concept: "The model client is provider-specific, while Agent and its run patterns provide the common application abstraction.", setup: "Configure the Foundry endpoint and model, authenticate with az login, and keep the optional Gemini key only in .env.", outcome: "One lab successfully returns a complete Foundry response, streams another response, and optionally runs the same Agent shape with Gemini." },
  },
  {
    id: "03", slug: "structured-output", folder: "03_structured_output", title: "Return Structured Output",
    phase: "Phase 1 · Clients and agent responses", level: "200", duration: "40 min", resource: "Foundry",
    why: "Applications usually need typed fields rather than prose. A response model turns the model output into a contract that downstream code can validate.",
    objectives: ["Define a Pydantic response model", "Pass the model through response_format", "Read the parsed object from result.value"],
    concepts: [["Response contract", "Defines the required fields and types."], ["Pydantic", "Validates and parses the returned data."], ["Fallback", "Handles a response that cannot be parsed into the contract."]],
    packages: PYDANTIC, needsFoundry: true, resources: ["Use a deployed model that supports structured responses."],
    files: [{ source: "03_structured_output/demo.py", target: "03_structured_output/student_lab.py", label: "Build the structured-output agent", purpose: "Define the schema before creating and running the agent." }],
    run: ["python .\\03_structured_output\\student_lab.py"],
    expected: ["City, Country, and Summary print as separate validated fields.", "The code checks the parsed type before using it."],
    challenge: "Add a best_time_to_visit field to CityInfo and ask the agent to populate it.",
    knowledge: { concept: "Structured output is a typed response contract, not merely a formatting request in the prompt.", setup: "Install Pydantic and use a model deployment that supports structured responses.", outcome: "result.value is a validated CityInfo instance with named fields." },
  },
  {
    id: "04", slug: "tools-and-approval", folder: "04_function_tools", title: "Add Function Tools and Human Approval",
    phase: "Phase 2 · Tools, state, and memory", level: "200", duration: "80 min", resource: "Foundry",
    why: "Tools let an agent obtain trusted data or request an action. This combined lab teaches the safe progression: first expose a harmless read-only tool, then introduce a human approval gate before a simulated side effect can run.",
    objectives: ["Define a typed tool with @tool", "Attach a harmless read-only tool and verify that the agent calls it", "Mark a simulated side-effecting tool as always requiring approval", "Inspect, approve or reject the proposed call, and resume the same session"],
    concepts: [["Function tool", "A typed Python capability the model can request."], ["Tool schema", "Names, descriptions, and annotations guide tool selection."], ["Approval mode", "Controls whether execution must pause for a person."], ["Approval request", "Represents a proposed function call awaiting a decision."], ["Session", "Preserves the paused interaction while approval is collected."], ["Approval response", "Carries the human decision back into the agent run."]],
    packages: PYDANTIC, needsFoundry: true,
    resources: ["No external weather service is required; the first tool returns deterministic classroom data.", "The calendar action in the approval exercise is simulated and does not modify a real calendar."],
    files: [
      { source: "04_function_tools/demo.py", target: "04_function_tools/student_weather_tool.py", label: "Part 1 — Build a harmless weather tool", purpose: "Create a read-only tool and verify that it gives the agent trusted deterministic data." },
      { source: "05_tool_approval/demo.py", target: "05_tool_approval/student_approval_tool.py", label: "Part 2 — Add a human approval gate", purpose: "Pause a simulated calendar action, inspect the proposed call, and resume only after a human decision." },
    ],
    run: ["python .\\04_function_tools\\student_weather_tool.py", "python .\\05_tool_approval\\student_approval_tool.py"],
    expected: ["The weather agent uses get_weather for the Bengaluru question and returns the deterministic 24°C classroom value.", "The approval program shows the proposed tool name and arguments before execution.", "Entering n prevents the EXECUTING line; entering y allows the simulated action."],
    challenge: "Add one known city to the read-only weather tool, then reject and approve the simulated calendar action in separate runs. Explain why the two tools have different approval requirements.",
    knowledge: { concept: "A function tool exposes trusted application logic, while approval gates human authorization for actions with side effects.", setup: "Use never_require only for the harmless read-only classroom function and keep the same AgentSession while sending an approval response.", outcome: "The weather response uses tool output, while the simulated action executes only after affirmative approval." },
  },
  {
    id: "06", slug: "sessions", folder: "06_sessions", title: "Maintain a Multi-turn Session",
    phase: "Phase 2 · Tools, state, and memory", level: "200", duration: "35 min", resource: "Foundry",
    why: "A session carries conversation history across turns, allowing the agent to answer follow-up questions with context from earlier messages.",
    objectives: ["Create an AgentSession", "Reuse it across two runs", "Contrast session memory with a new session"],
    concepts: [["AgentSession", "Carries conversation state across runs."], ["Multi-turn", "Later prompts can rely on earlier messages."], ["Session boundary", "A new session starts without the previous transcript."]],
    packages: CORE, needsFoundry: true, resources: ["No additional Azure resource is required beyond the Foundry model."],
    files: [{ source: "06_sessions/demo.py", target: "06_sessions/student_lab.py", label: "Build a two-turn conversation", purpose: "Reuse one session for both prompts." }],
    run: ["python .\\06_sessions\\student_lab.py"],
    expected: ["The second answer mentions Alice and hiking.", "Both calls use the same session object."],
    challenge: "Create a fresh session for the second question and observe what is no longer remembered.",
    knowledge: { concept: "An AgentSession supplies prior conversation context to later runs.", setup: "Create the session once and pass it to every related agent.run call.", outcome: "The second turn correctly recalls details from the first turn." },
  },
  {
    id: "07", slug: "context-provider", folder: "07_context_provider", title: "Inject Dynamic Context",
    phase: "Phase 2 · Tools, state, and memory", level: "300", duration: "55 min", resource: "Foundry",
    why: "Context providers can inject instructions before a run and persist provider-owned state afterward without asking the model to call a tool.",
    objectives: ["Implement before_run and after_run", "Store state under a provider source ID", "Inject personalized instructions on the next turn"],
    concepts: [["ContextProvider", "Runs around every agent invocation."], ["Session state", "Stores provider-owned values across turns."], ["Instruction extension", "Adds dynamic instructions before the model call."]],
    packages: CORE, needsFoundry: true, resources: ["No additional Azure resource is required."],
    files: [{ source: "07_context_provider/demo.py", target: "07_context_provider/student_lab.py", label: "Build the user-memory provider", purpose: "Capture the learner name and inject it into later instructions." }],
    run: ["python .\\07_context_provider\\student_lab.py"],
    expected: ["The second answer addresses Alice by name.", "Provider state prints under the user_memory source ID."],
    challenge: "Store a learner role as well as the name and use both in the injected instruction.",
    knowledge: { concept: "A context provider proactively injects or persists context around each run.", setup: "Use a stable source ID so provider-owned state has a predictable session location.", outcome: "The later response is personalized and the stored state is inspectable." },
  },
  {
    id: "08", slug: "file-memory", folder: "08_memory", title: "Persist File-backed Memory",
    phase: "Phase 2 · Tools, state, and memory", level: "300", duration: "50 min", resource: "Foundry + local files",
    why: "Conversation history ends with a session. File-backed memory demonstrates a separate persistence layer that can carry selected facts into a new session.",
    objectives: ["Create a FileSystemAgentFileStore", "Scope memory to a stable user ID", "Recall preferences from a new session"],
    concepts: [["Memory provider", "Offers memory operations and context to the agent."], ["File store", "Persists memory outside chat history."], ["User scope", "Separates one learner's memory from another's."]],
    packages: CORE, needsFoundry: true, resources: ["The lab writes only to 08_memory/agent-file-memory, which is ignored by Git."],
    files: [{ source: "08_memory/demo.py", target: "08_memory/student_lab.py", label: "Build persistent travel memory", purpose: "Use the same memory scope across two independent sessions." }],
    run: ["python .\\08_memory\\student_lab.py"],
    expected: ["The second session recommends vegetarian and pet-friendly options.", "A user-scoped memory folder appears under agent-file-memory."],
    challenge: "Store a second preference, create a third session, and verify both preferences are recalled.",
    knowledge: { concept: "File-backed memory persists selected facts beyond one AgentSession.", setup: "Use a stable per-user scope and keep generated memory out of source control.", outcome: "A new session can use preferences saved by an earlier session." },
  },
  {
    id: "09", slug: "middleware", folder: "09_middleware", title: "Add Middleware Guardrails and Timing",
    phase: "Phase 3 · Guardrails, telemetry, and quality", level: "300", duration: "55 min", resource: "Foundry",
    why: "Middleware centralizes cross-cutting controls such as input blocking, logging, timing, and policy enforcement without duplicating logic in each tool or prompt.",
    objectives: ["Create agent middleware that can terminate a run", "Create function middleware that measures a tool", "Verify allowed and blocked paths"],
    concepts: [["Agent middleware", "Wraps the overall agent invocation."], ["Function middleware", "Wraps individual tool execution."], ["MiddlewareTermination", "Stops processing after assigning a controlled result."]],
    packages: CORE, needsFoundry: true, resources: ["The weather tool is a read-only simulation; no external service is required."],
    files: [{ source: "09_middleware/demo.py", target: "09_middleware/student_lab.py", label: "Build security and timing middleware", purpose: "Apply different middleware scopes to the run and tool call." }],
    run: ["python .\\09_middleware\\student_lab.py"],
    expected: ["The weather request passes and prints tool timing.", "The password request returns the controlled blocked message."],
    challenge: "Add one more blocked keyword and verify that the weather tool is not executed for that request.",
    knowledge: { concept: "Middleware handles cross-cutting behavior around agent and tool execution.", setup: "Set context.result before raising MiddlewareTermination for a controlled response.", outcome: "Allowed requests execute normally while sensitive requests stop before the model/tool path continues." },
  },
  {
    id: "10", slug: "observability", folder: "10_observability", title: "Observe Agent Runs and Build a Metrics Dashboard",
    phase: "Phase 3 · Guardrails, telemetry, and quality", level: "300", duration: "75 min", resource: "Foundry + local telemetry",
    why: "Operational teams need more than final answers. Traces, latency, token usage, and success status reveal where an agent spends time and where failures occur.",
    objectives: ["Configure OpenTelemetry providers", "Create and read an agent trace", "Generate a self-contained HTML metrics dashboard from real run telemetry"],
    concepts: [["Trace", "Connects spans from one end-to-end operation."], ["Span", "Measures one operation such as a model or tool call."], ["Operational metrics", "Summarize success, latency, tokens, and span counts."]],
    packages: `${CORE} opentelemetry-sdk==1.43.0`, needsFoundry: true,
    env: ["ENABLE_CONSOLE_EXPORTERS=true", "ENABLE_SENSITIVE_DATA=false", "OTEL_SERVICE_NAME=agent-framework-course-demos"],
    resources: ["No monitoring service is required; the first demo exports to the console and the second keeps spans in memory.", "Use the supplied dashboard_template.html rather than a CDN so the result works offline."],
    files: [
      { source: "10_observability/demo.py", target: "10_observability/student_observability.py", label: "Use case 1 — Console trace", purpose: "Create one correlated trace around an agent and tool call." },
      { source: "10_observability/dashboard_demo.py", target: "10_observability/student_dashboard_demo.py", label: "Use case 2 — HTML dashboard generator", purpose: "Collect actual run metrics and render the supplied local dashboard template." },
    ],
    support: ["10_observability/dashboard_template.html", "10_observability/agent_metrics_dashboard.html"],
    run: ["python .\\10_observability\\student_observability.py", "python .\\10_observability\\student_dashboard_demo.py", "start .\\10_observability\\agent_metrics_dashboard.html"],
    expected: ["The console demo prints a trace ID and OpenTelemetry spans.", "The dashboard shows run count, success rate, average latency, token usage, and longest spans."],
    challenge: "Use the dashboard to identify the slowest scenario and the scenario with the highest total token count.",
    knowledge: { concept: "OpenTelemetry correlates agent, model, and tool operations through traces and spans.", setup: "Keep sensitive prompt and response capture disabled for this classroom dashboard.", outcome: "The generated dashboard is based on measured runs and exported spans, not fabricated metrics." },
  },
  {
    id: "11", slug: "evaluation", folder: "11_evaluation", title: "Evaluate Agent Quality",
    phase: "Phase 3 · Guardrails, telemetry, and quality", level: "300", duration: "55 min", resource: "Foundry",
    why: "Repeatable evaluation turns subjective prompt tuning into evidence. Local evaluators are fast enough to use while developing and can later become release gates.",
    objectives: ["Create a custom evaluator", "Combine built-in and custom checks", "Run an evaluation set and inspect scores"],
    concepts: [["Evaluation case", "A repeatable input used to test expected behavior."], ["Evaluator", "Produces a score or pass/fail decision."], ["Release gate", "Blocks promotion when required checks fail."]],
    packages: CORE, needsFoundry: true, resources: ["The model calls are live; the evaluators themselves run locally."],
    files: [{ source: "11_evaluation/demo.py", target: "11_evaluation/student_lab.py", label: "Build a local evaluation set", purpose: "Evaluate two weather questions with one built-in and one custom rule." }],
    run: ["python .\\11_evaluation\\student_lab.py"],
    expected: ["Each provider reports passed/total checks.", "Individual PASS or FAIL evaluator names are printed."],
    challenge: "Add one query that should fail the keyword check and explain why the failure is useful.",
    knowledge: { concept: "Evaluation measures agent behavior against repeatable criteria rather than a single impressive response.", setup: "Define both the queries and the evaluators before reviewing results.", outcome: "The terminal shows named checks and their pass/fail results for every case." },
  },
  {
    id: "12", slug: "classic-rag", folder: "12_rag_azure_ai_search", title: "Build Classic RAG with Azure AI Search",
    phase: "Phase 4 · RAG progression", level: "300", duration: "75 min", resource: "Foundry + Azure AI Search",
    why: "Classic RAG retrieves relevant documents before a model answers, reducing unsupported responses and connecting answers to enterprise knowledge.",
    objectives: ["Create and populate a semantic Search index", "Attach AzureAISearchContextProvider", "Verify grounded and unanswerable questions"],
    concepts: [["Retrieval", "Finds relevant indexed documents for a query."], ["Context provider", "Injects retrieved passages before the model call."], ["Grounding rule", "Requires the answer to stay within retrieved evidence."]],
    packages: SEARCH, needsFoundry: true,
    env: ["AZURE_SEARCH_ENDPOINT=https://<search-service>.search.windows.net", "AZURE_SEARCH_INDEX_NAME=travel-classic-demo", "AZURE_SEARCH_API_KEY="],
    resources: ["Create an Azure AI Search service (Basic is recommended for the later agentic labs).", "Enable RBAC and assign the learner Search Service Contributor, Search Index Data Contributor, and Search Index Data Reader.", "The setup script creates the index and uploads three fictional travel documents."],
    resourceCommands: [
      { label: "Create a Search service (replace placeholders)", code: "$resourceGroup = \"maf-course-rg\"\n$location = \"eastus\"\n$searchService = \"<globally-unique-search-name>\"\naz group create --name $resourceGroup --location $location\naz search service create --name $searchService --resource-group $resourceGroup --sku basic --partition-count 1 --replica-count 1 --identity-type SystemAssigned" },
      { label: "Assign the three learner roles", code: "$searchId = az search service show --name $searchService --resource-group $resourceGroup --query id -o tsv\n$userId = az ad signed-in-user show --query id -o tsv\naz role assignment create --assignee-object-id $userId --assignee-principal-type User --role \"Search Service Contributor\" --scope $searchId\naz role assignment create --assignee-object-id $userId --assignee-principal-type User --role \"Search Index Data Contributor\" --scope $searchId\naz role assignment create --assignee-object-id $userId --assignee-principal-type User --role \"Search Index Data Reader\" --scope $searchId" },
    ],
    files: [
      { source: "12_rag_azure_ai_search/setup_search.py", target: "12_rag_azure_ai_search/student_setup_search.py", label: "Use case 1 — Create the Search index", purpose: "Define a semantic schema and upload the fictional grounding documents." },
      { source: "12_rag_azure_ai_search/demo.py", target: "12_rag_azure_ai_search/student_lab.py", label: "Use case 2 — Ground an Agent", purpose: "Retrieve semantic matches through an Agent Framework context provider." },
    ],
    run: ["python .\\12_rag_azure_ai_search\\student_setup_search.py", "python .\\12_rag_azure_ai_search\\student_lab.py"],
    expected: ["The setup script confirms three uploaded documents.", "The agent summarizes only information retrieved from the configured index."],
    challenge: "Ask one question answered by the three documents and one unrelated question; confirm that the agent admits insufficient context.",
    knowledge: { concept: "Classic RAG retrieves top matching documents and injects them before the model answers.", setup: "Populate the semantic index and grant the signed-in learner Search data-plane roles.", outcome: "The agent answers from retrieved travel documents and refuses unsupported questions." },
  },
  {
    id: "13", slug: "mcp", folder: "13_mcp", title: "Build and Inspect an MCP Server",
    phase: "Phase 2 · Tools, state, and memory", level: "300", duration: "75 min", resource: "MCP Inspector + shared Azure Container Apps",
    why: "Before an agent can consume an MCP server, learners should see how the server publishes tools, resources, and prompts, how Inspector verifies the protocol, and how an API-key-protected Azure endpoint exposes the same capabilities.",
    objectives: ["Create a Python FastMCP server with tools, a resource, and a prompt", "Test the local Streamable HTTP endpoint with MCP Inspector", "Connect Inspector to the instructor-provided authenticated Azure endpoint"],
    concepts: [["FastMCP", "Registers Python functions as MCP tools, resources, and prompts."], ["MCP Inspector", "Discovers and invokes protocol capabilities without an LLM."], ["Streamable HTTP", "Exposes the MCP endpoint locally and through Azure HTTPS ingress."], ["API-key header", "Authenticates remote requests with the instructor-provided X-API-Key value."]],
    packages: "mcp==1.29.0 uvicorn==0.52.4", needsFoundry: false,
    env: ["MCP_SERVER_NAME=Contoso Change Risk Advisor", "MCP_SERVER_URL=https://<instructor-provided-hostname>/mcp", "MCP_API_KEY=<instructor-provided-api-key>"],
    resources: ["Obtain the shared MCP endpoint and API key from the instructor and keep both in the git-ignored .env file.", "Do not create or delete Azure resources in this lab; the shared Contoso Change Risk Advisor is already running.", "Use only the fictional, read-only change records supplied by the lab.", "Install Node.js 22 or later so MCP Inspector can run with npx."],
    files: [
      { source: "13_mcp/demo.py", target: "13_mcp/demo.py", label: "Use case 1 — Create the MCP server", purpose: "Register deterministic change tools, one catalog resource, and one reusable prompt." },
      { source: "13_mcp/Dockerfile", target: "13_mcp/Dockerfile", label: "Use case 2 — Containerize the server", purpose: "Package the same Streamable HTTP server for Azure Container Apps." },
    ],
    support: ["13_mcp/requirements.txt", "13_mcp/.dockerignore"],
    runNotes: "Use two terminals locally: keep the Python server running in the first, then run MCP Inspector in the second. Stop the local server before connecting Inspector to the shared Azure endpoint.",
    run: ["python .\\13_mcp\\demo.py", "npx.cmd --yes --package @modelcontextprotocol/inspector mcp-inspector --web --server-url http://127.0.0.1:8000/mcp --transport http"],
    deploymentCommands: [{ label: "Connect Inspector to the existing authenticated Azure deployment", code: "$env:MCP_SERVER_URL = (Get-Content .env | Where-Object { $_ -like 'MCP_SERVER_URL=*' } | Select-Object -First 1).Split('=', 2)[1]\n$env:MCP_API_KEY = (Get-Content .env | Where-Object { $_ -like 'MCP_API_KEY=*' } | Select-Object -First 1).Split('=', 2)[1]\n\nnpx.cmd --yes --package @modelcontextprotocol/inspector mcp-inspector --web --server-url $env:MCP_SERVER_URL --transport http --header \"X-API-Key: $env:MCP_API_KEY\"" }],
    expected: ["Local Inspector lists get_change_record and assess_change_risk, the change://catalog resource, and the change-readiness-review prompt.", "Calling the local assess_change_risk tool with CHG-1003 returns score 8 and level high.", "Remote Inspector connects only when the X-API-Key header is supplied and lists the shared server capabilities."],
    challenge: "Compare CHG-1001 and CHG-1003 on the shared server and explain which returned fields justify their different risk levels.",
    knowledge: { concept: "An MCP server publishes typed tools, resources, and prompts independently of any particular LLM client.", setup: "Test the local Streamable HTTP endpoint first, then send the instructor-provided X-API-Key header to the existing Azure endpoint.", outcome: "Inspector calls the local server and the authenticated shared server without exposing the API key in source code." },
    documentationLinks: [
      { label: "MCP Python SDK", url: "https://github.com/modelcontextprotocol/python-sdk" },
      { label: "MCP Inspector", url: "https://github.com/modelcontextprotocol/inspector" },
    ],
  },
  {
    id: "27", slug: "mcp-agent-client", folder: "27_mcp_agent_client", title: "Use an Authenticated MCP Server from Agent Framework",
    phase: "Phase 2 · Tools, state, and memory", level: "300", duration: "50 min", resource: "Foundry + Azure Container Apps MCP",
    why: "This lab closes the loop: Agent Framework discovers and calls tools from the shared authenticated MCP server, while Microsoft Foundry provides the model reasoning.",
    objectives: ["Configure MCPStreamableHTTPTool with the shared HTTPS endpoint", "Supply X-API-Key through header_provider", "Allow-list two live tools and verify a grounded change-risk response"],
    concepts: [["MCPStreamableHTTPTool", "Owns the client connection to a remote Streamable HTTP server."], ["Header provider", "Adds the API-key header from .env without placing the secret in Python source."], ["Tool discovery", "Loads the allowed server tool schemas when the connection opens."], ["Allow-list", "Exposes only get_change_record and assess_change_risk to the model."], ["Prompt boundary", "Keeps MCP prompts available on the server but does not load them as model functions in this client."], ["Lifecycle", "Closes the MCP connection and agent cleanly with async context managers."]],
    packages: `${CORE} mcp==1.29.0`, needsFoundry: true,
    env: ["MCP_SERVER_NAME=Contoso Change Risk Advisor", "MCP_SERVER_URL=https://<instructor-provided-hostname>/mcp", "MCP_API_KEY=<instructor-provided-api-key>"],
    resources: ["Complete the preceding MCP server lab and retain the instructor-provided endpoint and key in .env.", "Confirm that the classroom network can reach the Azure Container Apps hostname.", "Use the same Foundry project and deployed model as the earlier agent labs.", "Do not paste the MCP API key into the Python file, terminal history, screenshots, or lab submissions."],
    files: [{ source: "27_mcp_agent_client/demo.py", target: "27_mcp_agent_client/student_lab.py", label: "Build the MCP-enabled change review agent", purpose: "Open the live MCP connection, create the Foundry-backed Agent, and ask a question that requires both server tools." }],
    run: ["python .\\27_mcp_agent_client\\student_lab.py"],
    expected: ["The agent identifies CHG-1003 as the Emergency payment gateway routing update.", "The response reports high risk and score 100 using live MCP tool output.", "The response notes that no rollback plan is recorded, and no production change is executed."],
    challenge: "Change the prompt to CHG-1001 and verify that the agent reports low risk and score 10 without inventing additional facts.",
    knowledge: { concept: "MCPStreamableHTTPTool lets an Agent Framework agent discover and call a trusted remote MCP server.", setup: "Set MCP_SERVER_URL and MCP_API_KEY in .env, send X-API-Key through header_provider, and authenticate to Foundry with az login.", outcome: "The final answer contains the live server's CHG-1003 title, high risk level, and score 100." },
  },
  {
    id: "14", slug: "workflow-basics", folder: "14_workflow_basics", title: "Build a Functional Workflow",
    phase: "Phase 5 · Workflows and multi-agent patterns", level: "300", duration: "55 min", resource: "Foundry",
    why: "A workflow makes control flow explicit. The document pipeline separates classification from summarization so each step is visible, reusable, and testable.",
    objectives: ["Create agent-backed workflow steps", "Compose steps with @workflow", "Run the built workflow and read outputs"],
    concepts: [["@step", "Marks a reusable workflow operation."], ["@workflow", "Defines explicit control flow with normal Python."], ["Workflow result", "Provides outputs and execution state."]],
    packages: CORE, needsFoundry: true, resources: ["The functional workflow API is experimental in the pinned package; retain the pinned versions for class."],
    files: [{ source: "14_workflow_basics/demo.py", target: "14_workflow_basics/student_lab.py", label: "Build the document pipeline", purpose: "Call two specialized agents from separate workflow steps." }],
    run: ["python .\\14_workflow_basics\\student_lab.py"],
    expected: ["The output contains a category and one-sentence summary.", "The classifier and summarizer remain separate steps."],
    challenge: "Add a translation step after summarization and include it in the final workflow output.",
    knowledge: { concept: "A functional workflow expresses explicit control flow with decorated async Python functions.", setup: "Pin the experimental workflow package surface used by the lab.", outcome: "One run returns both the document category and summary produced by separate steps." },
  },
  {
    id: "15", slug: "workflow-hitl", folder: "15_workflow_hitl", title: "Pause a Workflow for Human Review",
    phase: "Phase 5 · Workflows and multi-agent patterns", level: "300", duration: "60 min", resource: "Foundry",
    why: "Human-in-the-loop workflows let a person review intermediate work before execution continues, while preserving the workflow state and avoiding unnecessary repeated model calls.",
    objectives: ["Request information from RunContext", "Detect a pending-request workflow state", "Resume the workflow with human feedback"],
    concepts: [["RequestInfo", "Pauses the workflow and emits a typed request."], ["Pending state", "Signals that execution is idle while waiting for input."], ["Resume", "Continues from the pause with a response mapped to the request ID."]],
    packages: CORE, needsFoundry: true, resources: ["The lab is interactive and must run in a terminal that can accept input."],
    files: [{ source: "15_workflow_hitl/demo.py", target: "15_workflow_hitl/student_lab.py", label: "Build the review workflow", purpose: "Pause after the writer step and resume with reviewer feedback." }],
    run: ["python .\\15_workflow_hitl\\student_lab.py"],
    expected: ["The workflow reports that it paused at review_request.", "After feedback, only the reviser produces the final draft."],
    challenge: "Run twice with different review comments and compare the resulting revisions.",
    knowledge: { concept: "HITL uses request/response events to pause and resume workflow execution safely.", setup: "Run interactively and preserve the request ID returned by the pending workflow.", outcome: "The draft is revised using human feedback after the workflow resumes." },
  },
  {
    id: "16", slug: "sequential", folder: "16_multi_agent_sequential", title: "Run Agents Sequentially",
    phase: "Phase 5 · Workflows and multi-agent patterns", level: "300", duration: "50 min", resource: "Foundry",
    why: "Sequential orchestration is appropriate when one specialist's output should become the next specialist's input, such as writing followed by review.",
    objectives: ["Create writer and reviewer agents", "Build SequentialBuilder", "Inspect the ordered conversation outputs"],
    concepts: [["Sequential pattern", "Runs participants in a fixed order."], ["Shared conversation", "Carries prior participant output forward."], ["Output selection", "Controls which participant outputs are returned."]],
    packages: ORCHESTRATIONS, needsFoundry: true, resources: ["No additional Azure resources are required beyond the Foundry model."],
    files: [{ source: "16_multi_agent_sequential/demo.py", target: "16_multi_agent_sequential/student_lab.py", label: "Build writer-reviewer orchestration", purpose: "Pass one marketing task through two ordered agents." }],
    run: ["python .\\16_multi_agent_sequential\\student_lab.py"],
    expected: ["The writer responds before the reviewer.", "The printed transcript includes both participant names."],
    challenge: "Make the reviewer require a measurable rule such as fewer than 12 words.",
    knowledge: { concept: "Sequential orchestration passes work through participants in a defined order.", setup: "Install agent-framework-orchestrations and use the same configured Foundry client for both agents.", outcome: "The transcript shows writer output followed by reviewer feedback." },
  },
  {
    id: "17", slug: "concurrent", folder: "17_multi_agent_concurrent", title: "Run Agents Concurrently",
    phase: "Phase 5 · Workflows and multi-agent patterns", level: "300", duration: "50 min", resource: "Foundry",
    why: "Concurrent orchestration reduces wall-clock time when several specialists can analyze the same input independently.",
    objectives: ["Create independent specialist agents", "Build ConcurrentBuilder", "Read the aggregated participant responses"],
    concepts: [["Fan-out", "Sends the same input to multiple agents."], ["Parallel execution", "Runs independent participants concurrently."], ["Aggregation", "Collects participant messages into the final output."]],
    packages: ORCHESTRATIONS, needsFoundry: true, resources: ["Concurrent runs generate several model calls and may consume quota faster than a single-agent lab."],
    files: [{ source: "17_multi_agent_concurrent/demo.py", target: "17_multi_agent_concurrent/student_lab.py", label: "Build the parallel launch review", purpose: "Ask research, marketing, and compliance agents to respond independently." }],
    run: ["python .\\17_multi_agent_concurrent\\student_lab.py"],
    expected: ["Three named specialist responses appear.", "The responses address the same launch from different perspectives."],
    challenge: "Add a sustainability specialist and verify that four distinct perspectives are returned.",
    knowledge: { concept: "Concurrent orchestration fans one task out to independent specialists and aggregates their responses.", setup: "Use concurrent execution only when participant tasks do not depend on one another.", outcome: "The result contains separate responses from every configured specialist." },
  },
  {
    id: "18", slug: "handoff", folder: "18_multi_agent_handoff", title: "Route Work with Handoff Orchestration",
    phase: "Phase 5 · Workflows and multi-agent patterns", level: "300", duration: "60 min", resource: "Foundry",
    why: "Handoff transfers ownership of a conversation to the specialist best able to finish it, which fits triage and support scenarios.",
    objectives: ["Create triage and specialist agents", "Configure a start agent and termination condition", "Verify routing and specialist tool use"],
    concepts: [["Handoff", "Transfers control and task ownership to another participant."], ["Start agent", "Receives the original user request."], ["Termination condition", "Ends the orchestration when the target outcome appears."]],
    packages: ORCHESTRATIONS, needsFoundry: true, resources: ["The order lookup is a read-only classroom simulation and does not access customer data."],
    files: [{ source: "18_multi_agent_handoff/demo.py", target: "18_multi_agent_handoff/student_lab.py", label: "Build support handoff", purpose: "Route an order-status request from triage to a tool-enabled specialist." }],
    run: ["python .\\18_multi_agent_handoff\\student_lab.py"],
    expected: ["The order specialist calls check_order for order 1234.", "The workflow reaches a completed state after RESOLVED appears."],
    challenge: "Add a returns specialist and route a return-policy request to it.",
    knowledge: { concept: "Handoff transfers the conversation and task ownership to a selected specialist.", setup: "Define a clear start agent, participant set, and bounded termination condition.", outcome: "The triage agent routes the order request and the specialist resolves it using the tool." },
  },
  {
    id: "19", slug: "group-chat", folder: "19_multi_agent_group_chat", title: "Collaborate in a Group Chat",
    phase: "Phase 5 · Workflows and multi-agent patterns", level: "300", duration: "60 min", resource: "Foundry",
    why: "Group chat supports iterative peer improvement when participants need to see and respond to one another rather than work independently.",
    objectives: ["Create a deterministic selector", "Configure expert, verifier, and clarifier roles", "Bound the conversation with a termination rule"],
    concepts: [["Group chat", "Maintains a shared multi-participant conversation."], ["Selection function", "Chooses the next participant."], ["Bounded iteration", "Prevents unending agent discussion."]],
    packages: ORCHESTRATIONS, needsFoundry: true, resources: ["This lab makes several sequential model calls; verify classroom model quota."],
    files: [{ source: "19_multi_agent_group_chat/demo.py", target: "19_multi_agent_group_chat/student_lab.py", label: "Build peer-review group chat", purpose: "Rotate through an expert, safety verifier, and clarity reviewer." }],
    run: ["python .\\19_multi_agent_group_chat\\student_lab.py"],
    expected: ["Messages rotate among the three named participants.", "The conversation stops after the configured message count."],
    challenge: "Change the clarifier into an accessibility reviewer and compare the final transcript.",
    knowledge: { concept: "Group chat lets several agents iteratively improve work in one shared transcript.", setup: "Use a deterministic selector and a strict termination condition for a classroom demo.", outcome: "The transcript shows bounded, multi-round contributions from expert, verifier, and clarifier." },
  },
  {
    id: "20", slug: "agentic-retrieval", folder: "20_agentic_retrieval", title: "Compare Classic and Agentic Retrieval",
    phase: "Phase 4 · RAG progression", level: "400", duration: "110 min", resource: "Foundry + Azure AI Search Basic",
    why: "Agentic retrieval can decompose a compound or conversational question into focused searches, merge results, synthesize an answer, and expose its retrieval activity and references.",
    objectives: ["Create an index, knowledge source, and knowledge base", "Compare classic semantic retrieval with agentic retrieval", "Inspect activity, references, and conversational follow-up"],
    concepts: [["Knowledge source", "Connects a knowledge base to searchable content."], ["Query planning", "Decomposes complex questions into focused subqueries."], ["Answer synthesis", "Combines grounded results and references into a response."]],
    packages: SEARCH, needsFoundry: true,
    env: ["AZURE_OPENAI_ENDPOINT=https://<foundry-resource>.openai.azure.com/openai/v1", "AZURE_OPENAI_DEPLOYMENT=gpt-5", "AZURE_SEARCH_AGENTIC_INDEX_NAME=travel-agentic-demo", "AZURE_SEARCH_AGENTIC_KNOWLEDGE_SOURCE_NAME=travel-agentic-source", "AZURE_SEARCH_AGENTIC_KNOWLEDGE_BASE_NAME=travel-agentic-kb"],
    resources: ["Use an Azure AI Search Basic service with system-assigned managed identity and RBAC enabled.", "Assign the learner Search Service Contributor, Search Index Data Contributor, and Search Index Data Reader.", "Assign the Search service managed identity Cognitive Services User on the Foundry resource used by the knowledge-base model.", "This preview feature and its model calls can incur charges."],
    resourceCommands: [{ label: "Create resources and upload the supplied CSV after roles propagate", code: "python .\\20_agentic_retrieval\\student_00_create_resources.py" }],
    files: [
      { source: "20_agentic_retrieval/00_create_resources.py", target: "20_agentic_retrieval/student_00_create_resources.py", label: "Use case 1 — Provision retrieval resources", purpose: "Create the semantic index, upload CSV rows, and create the knowledge source and knowledge base." },
      { source: "20_agentic_retrieval/01_classic_semantic_rag.py", target: "20_agentic_retrieval/student_01_classic_rag.py", label: "Use case 2 — Classic semantic RAG", purpose: "Retrieve top semantic matches for one query." },
      { source: "20_agentic_retrieval/02_agentic_retrieval.py", target: "20_agentic_retrieval/student_02_agentic_retrieval.py", label: "Use case 3 — Direct knowledge-base retrieval", purpose: "Inspect query planning activity, answer synthesis, references, and follow-up history." },
      { source: "20_agentic_retrieval/03_agent_framework_agentic_rag.py", target: "20_agentic_retrieval/student_03_agentic_agent.py", label: "Use case 4 — Agent Framework integration", purpose: "Attach the knowledge base through AzureAISearchContextProvider in agentic mode." },
    ],
    support: ["20_agentic_retrieval/data/travel_operations.csv"],
    run: ["python .\\20_agentic_retrieval\\student_00_create_resources.py", "python .\\20_agentic_retrieval\\student_01_classic_rag.py", "python .\\20_agentic_retrieval\\student_02_agentic_retrieval.py", "python .\\20_agentic_retrieval\\student_03_agentic_agent.py"],
    expected: ["The resource script creates the index, knowledge source, and knowledge base.", "Direct retrieval prints activity and references for a compound question.", "The Agent Framework version returns one grounded checklist."],
    challenge: "Count generated subqueries in activity, then lower or raise reasoning effort and compare latency and retrieval detail.",
    knowledge: { concept: "Agentic retrieval plans multiple focused searches and can synthesize a grounded conversational answer.", setup: "Create the Search knowledge resources and grant the Search managed identity access to the Foundry model.", outcome: "The result exposes retrieval activity and references in addition to the synthesized answer." },
  },
  {
    id: "21", slug: "identity-aware-rag", folder: "21_identity_aware_rag", title: "Enforce Identity-aware RAG",
    phase: "Phase 4 · RAG progression", level: "400", duration: "120 min", resource: "Foundry + Search ACL preview",
    why: "Identity-aware RAG filters documents inside Azure AI Search before grounding reaches the model. Prompt instructions alone cannot enforce document authorization.",
    objectives: ["Create permission-filter fields and upload ACL metadata", "Pass a Search-scoped end-user token at query time", "Prove allowed and denied retrieval paths"],
    concepts: [["Service credential", "Authenticates the application to the Search service."], ["Query-source identity", "Represents the end user whose document access is evaluated."], ["Permission filter", "Compares user and group object IDs before returning content."]],
    packages: SEARCH, needsFoundry: true,
    env: ["AZURE_SEARCH_SECURE_INDEX_NAME=travel-secure-demo", "AZURE_SEARCH_SECURE_KNOWLEDGE_SOURCE_NAME=travel-secure-source", "AZURE_SEARCH_SECURE_KNOWLEDGE_BASE_NAME=travel-secure-kb", "DEMO_FINANCE_GROUP_OBJECT_ID=<optional Entra group object ID>"],
    resources: ["Complete Lab 20 infrastructure and role setup first.", "Use stable Entra object IDs in UserIds and GroupIds; never use email addresses as ACL values.", "The pinned beta SDK exposes query_source_authorization in the tested code. Current Learn examples may show x_ms_query_source_authorization; upgrade only after revalidation.", "For a two-user demonstration, use a real finance group and compare a member with a nonmember."],
    files: [
      { source: "21_identity_aware_rag/00_create_secure_resources.py", target: "21_identity_aware_rag/student_00_create_secure_resources.py", label: "Use case 1 — Create the ACL index", purpose: "Enable permission filters and upload user/group ACL metadata." },
      { source: "21_identity_aware_rag/01_sdk_authorized_retrieval.py", target: "21_identity_aware_rag/student_01_sdk_authorized.py", label: "Use case 2 — Direct authorized retrieval", purpose: "Send the signed-in user's Search token separately from the service credential." },
      { source: "21_identity_aware_rag/02_agent_framework_identity_rag.py", target: "21_identity_aware_rag/student_02_identity_agent.py", label: "Use case 3 — Agent Framework identity RAG", purpose: "Let the context provider forward the query-source credential on each retrieval." },
    ],
    support: ["21_identity_aware_rag/data/secure_travel_documents.csv"],
    run: ["python .\\21_identity_aware_rag\\student_00_create_secure_resources.py", "python .\\21_identity_aware_rag\\student_01_sdk_authorized.py", "python .\\21_identity_aware_rag\\student_02_identity_agent.py"],
    expected: ["The signed-in user receives the user-specific classroom assistance code.", "The finance-only question returns no authorized answer for a nonmember.", "ACL fields never appear in retrieved grounding text."],
    challenge: "Run the same two questions as a finance-group member and nonmember; record which security gate changes the result.",
    knowledge: { concept: "Identity-aware RAG enforces document authorization in Search before text reaches the model.", setup: "Separate the service credential from the Search-scoped end-user query-source token.", outcome: "Allowed content is returned while finance-only content remains unavailable to a nonmember." },
  },
  {
    id: "22", slug: "development-lifecycle", folder: "22_development_lifecycle", title: "Apply the Agent Development Lifecycle",
    phase: "Phase 3 · Guardrails, telemetry, and quality", level: "300", duration: "70 min", resource: "Foundry",
    why: "Agent development is an evidence loop: define expected behavior, build a baseline, improve a candidate, evaluate both, and make an explicit release decision.",
    objectives: ["Compare baseline and candidate instructions", "Run both against a shared evaluation set", "Record a release decision against agreed criteria"],
    concepts: [["Baseline", "The current behavior used as a comparison point."], ["Candidate", "A proposed change evaluated against the same cases."], ["Release decision", "Uses evidence and risk criteria rather than intuition alone."]],
    packages: CORE, needsFoundry: true, resources: ["Use a Foundry model deployment consistently for both baseline and candidate comparisons."],
    files: [{ source: "22_development_lifecycle/demo.py", target: "22_development_lifecycle/student_demo.py", label: "Build the baseline-versus-candidate comparison", purpose: "Run two instruction sets against the same evaluation cases." }],
    support: ["22_development_lifecycle/evaluation_cases.json", "22_development_lifecycle/lab/release_checklist.md", "22_development_lifecycle/lab/starter.py", "22_development_lifecycle/lab/solution.py"],
    run: ["python .\\22_development_lifecycle\\student_demo.py"],
    expected: ["Every question produces a baseline and candidate answer.", "The printed review criterion guides a documented release decision."],
    challenge: "Improve only the candidate instructions, rerun every case, and complete the release checklist.",
    knowledge: { concept: "The development lifecycle compares a candidate with a baseline using agreed evaluation evidence.", setup: "Keep the model and cases constant while changing only the candidate instructions.", outcome: "A release decision is recorded after reviewing both responses against every criterion." },
  },
  {
    id: "23", slug: "hosted-agent", folder: "23_hosted_agent_basic", title: "Host an Agent Behind the Responses API",
    phase: "Phase 6 · Hosting and optimization", level: "300", duration: "90 min", resource: "Foundry Hosted Agents preview",
    why: "ResponsesHostServer adds a service boundary around the same Agent abstraction, allowing Foundry to deploy and invoke your own code as a Hosted agent.",
    objectives: ["Create an Agent with DefaultAzureCredential", "Expose it through ResponsesHostServer", "Understand the local-to-hosted deployment flow"],
    concepts: [["Responses host", "Exposes the Agent through a Responses-compatible server."], ["DefaultAzureCredential", "Uses local developer identity and hosted workload identity in different environments."], ["Hosted agent", "Runs custom agent code in Foundry-managed deployment infrastructure."]],
    packages: HOSTING, needsFoundry: true,
    env: ["AZURE_AI_MODEL_DEPLOYMENT_NAME=<hosted deployment model; optional locally>"],
    resources: ["Install Azure Developer CLI (azd) and Docker Desktop before the hosted deployment portion.", "Use a Foundry project where Hosted agents are enabled and confirm subscription quota.", "Local startup does not prove remote deployment; validate the deployed endpoint separately."],
    resourceCommands: [{ label: "Initialize Microsoft's official Agent Framework Hosted-agent sample", code: "$env:AZURE_DEV_USER_AGENT='microsoft_foundry_course'\nazd ai agent init -m \"https://github.com/microsoft-foundry/foundry-samples/blob/main/samples/python/hosted-agents/agent-framework/responses/01-basic/azure.yaml\" --deploy-mode container" }],
    files: [
      { source: "23_hosted_agent_basic/main.py", target: "23_hosted_agent_basic/student_main.py", label: "Module file — Hosted-agent entry point", purpose: "Create the Agent and start its Responses-compatible server." },
      { source: "23_hosted_agent_basic/agent.yaml", target: "23_hosted_agent_basic/student_agent.yaml", label: "Configuration file — Agent manifest", purpose: "Describe the deployable agent application." },
      { source: "23_hosted_agent_basic/Dockerfile", target: "23_hosted_agent_basic/student_Dockerfile", label: "Configuration file — Container", purpose: "Package the hosted entry point." },
      { source: "23_hosted_agent_basic/requirements.txt", target: "23_hosted_agent_basic/student_requirements.txt", label: "Configuration file — Dependencies", purpose: "Install the minimal hosted runtime packages." },
    ],
    run: ["cd .\\23_hosted_agent_basic", "..\\venv\\Scripts\\python.exe .\\student_main.py", "# Stop the local server with Ctrl+C"],
    expected: ["The local server listens on http://localhost:8088.", "The Agent code remains small; hosting is added by ResponsesHostServer."],
    challenge: "Change only the instructions so policy exceptions escalate to a human; keep hosting code unchanged.",
    knowledge: { concept: "ResponsesHostServer exposes a standard Agent through a Responses-compatible service boundary.", setup: "Use DefaultAzureCredential so local and hosted environments resolve appropriate identities.", outcome: "The local host starts on port 8088 and is ready for Responses-compatible invocation." },
  },
  {
    id: "24", slug: "hosted-identity", folder: "24_hosted_agent_identity", title: "Use Hosted-agent Identity for Blob Access",
    phase: "Phase 6 · Hosting and optimization", level: "400", duration: "100 min", resource: "Foundry Hosted Agents + Blob Storage",
    why: "A hosted agent should access Azure resources with workload identity and RBAC, not embedded keys. The same code uses Azure CLI identity locally and the Hosted agent identity after deployment.",
    objectives: ["Create and populate a Blob container", "Grant narrowly scoped Blob data access", "Read the policy with DefaultAzureCredential from an agent tool"],
    concepts: [["Workload identity", "Represents the deployed agent without a stored secret."], ["RBAC", "Authorizes the identity to read one Azure resource."], ["Authentication vs authorization", "A valid identity still needs the correct resource role."]],
    packages: `${HOSTING} azure-storage-blob==12.30.1`, needsFoundry: true,
    env: ["AZURE_STORAGE_ACCOUNT_URL=https://<storage-account>.blob.core.windows.net", "AZURE_STORAGE_CONTAINER_NAME=agent-framework-demos", "AZURE_STORAGE_BLOB_NAME=travel-policy.txt"],
    resources: ["Create a StorageV2 account and private Blob container.", "Grant the learner Storage Blob Data Contributor for setup and Storage Blob Data Reader for the read demonstration.", "After hosted deployment, grant the Hosted agent identity Storage Blob Data Reader at the narrowest practical scope.", "Do not put a connection string or account key in .env."],
    resourceCommands: [
      { label: "Create Storage and upload the supplied policy with Entra authentication", code: "$resourceGroup = \"maf-course-rg\"\n$location = \"eastus\"\n$storageAccount = \"<globally-unique-storage-name>\"\naz storage account create --name $storageAccount --resource-group $resourceGroup --location $location --sku Standard_LRS --kind StorageV2\n$storageId = az storage account show --name $storageAccount --resource-group $resourceGroup --query id -o tsv\n$userId = az ad signed-in-user show --query id -o tsv\naz role assignment create --assignee-object-id $userId --assignee-principal-type User --role \"Storage Blob Data Contributor\" --scope $storageId\naz storage container create --account-name $storageAccount --name agent-framework-demos --auth-mode login --public-access off\naz storage blob upload --account-name $storageAccount --container-name agent-framework-demos --name travel-policy.txt --file .\\24_hosted_agent_identity\\sample_travel_policy.txt --auth-mode login --overwrite" },
    ],
    files: [
      { source: "24_hosted_agent_identity/main.py", target: "24_hosted_agent_identity/student_main.py", label: "Module file — Identity-aware Hosted agent", purpose: "Share one credential between Foundry and the Blob-reading tool." },
      { source: "24_hosted_agent_identity/agent.yaml", target: "24_hosted_agent_identity/student_agent.yaml", label: "Configuration file — Agent manifest", purpose: "Describe the hosted deployment." },
      { source: "24_hosted_agent_identity/Dockerfile", target: "24_hosted_agent_identity/student_Dockerfile", label: "Configuration file — Container", purpose: "Package the agent server." },
      { source: "24_hosted_agent_identity/requirements.txt", target: "24_hosted_agent_identity/student_requirements.txt", label: "Configuration file — Dependencies", purpose: "Include hosting and Blob SDK packages." },
    ],
    support: ["24_hosted_agent_identity/sample_travel_policy.txt", "24_hosted_agent_identity/lab/starter.py", "24_hosted_agent_identity/lab/solution.py"],
    run: ["cd .\\24_hosted_agent_identity", "..\\venv\\Scripts\\python.exe .\\student_main.py", "# Stop the local server with Ctrl+C"],
    expected: ["The local Responses host starts on port 8088.", "A policy question triggers read_travel_policy and succeeds only when the current identity has Blob read permission."],
    challenge: "Remove the reader role, repeat the request, and explain why successful authentication does not imply authorization.",
    knowledge: { concept: "Hosted-agent identity provides passwordless service-to-service authentication, while RBAC grants resource access.", setup: "Grant Blob Data Reader to the local or hosted identity and never use the account key.", outcome: "The policy tool reads the private Blob only when the active identity is authorized." },
  },
  {
    id: "25", slug: "agent-optimizer", folder: "25_agent_optimizer", title: "Optimize a Hosted Agent",
    phase: "Phase 6 · Hosting and optimization", level: "400", duration: "105 min", resource: "Foundry Agent Optimizer preview",
    why: "Agent Optimizer uses a measurable evaluation set to propose better instructions. A candidate should be reviewed and compared before it replaces the baseline.",
    objectives: ["Load the active agent configuration", "Define evaluation tasks and criteria", "Run, review, and optionally apply an optimization candidate"],
    concepts: [["Baseline configuration", "Defines the starting model and instructions."], ["Evaluation dataset", "Provides tasks and measurable success criteria."], ["Candidate", "An optimizer-generated configuration that still requires review."]],
    packages: `${HOSTING} azure-ai-agentserver-optimization==1.0.0b1`, needsFoundry: true,
    resources: ["Agent Optimizer is limited preview; confirm access and supported models before class.", "Install azd and initialize/deploy the official optimization sample before launching a remote job.", "Optimization can create model and evaluation charges."],
    resourceCommands: [
      { label: "Start and monitor optimization after deploying the official sample", code: "$env:AZURE_DEV_USER_AGENT='microsoft_foundry_course'\nazd ai agent optimize\nazd ai agent optimize status <job-id> --watch" },
      { label: "Apply only an approved candidate", code: "azd ai agent optimize apply --candidate <candidate-id>" },
    ],
    files: [
      { source: "25_agent_optimizer/main.py", target: "25_agent_optimizer/student_main.py", label: "Module file — Optimization-ready agent", purpose: "Load the active configuration and start the Hosted-agent server." },
      { source: "25_agent_optimizer/.agent_configs/baseline/metadata.yaml", target: "25_agent_optimizer/.agent_configs/student/metadata.yaml", label: "Baseline metadata", purpose: "Select the model and instruction file." },
      { source: "25_agent_optimizer/.agent_configs/baseline/instructions.md", target: "25_agent_optimizer/.agent_configs/student/instructions.md", label: "Baseline instructions", purpose: "Provide the intentionally weak starting prompt." },
      { source: "25_agent_optimizer/eval.jsonl", target: "25_agent_optimizer/student_eval.jsonl", label: "Evaluation dataset", purpose: "Define one measurable task per line." },
      { source: "25_agent_optimizer/eval.yaml", target: "25_agent_optimizer/student_eval.yaml", label: "Evaluator configuration", purpose: "Select the task-adherence evaluator." },
      { source: "25_agent_optimizer/agent.yaml", target: "25_agent_optimizer/student_agent.yaml", label: "Agent manifest", purpose: "Describe the hosted application." },
    ],
    run: ["cd .\\25_agent_optimizer", "..\\venv\\Scripts\\python.exe .\\student_main.py", "# Run the azd optimize commands only after remote deployment and preview access are confirmed"],
    expected: ["The local server loads the baseline configuration and starts.", "A remote optimizer job reports a candidate and evaluation evidence before anything is applied."],
    challenge: "Add a medical-request evaluation case that requires refusal of medical advice and referral to qualified help.",
    knowledge: { concept: "Agent Optimizer proposes instruction candidates using a baseline and measurable evaluation data.", setup: "Confirm preview access, deploy the hosted agent, and review every candidate before applying it.", outcome: "The selected candidate demonstrates better evaluation evidence than the baseline." },
  },
  {
    id: "26", slug: "browser-automation", folder: "26_browser_automation", title: "Use Browser Automation Safely",
    phase: "Phase 6 · Hosting and optimization", level: "400", duration: "105 min", resource: "Foundry Hosted Agents + Browser Automation preview",
    why: "Browser automation adds a powerful external-action surface. The first exercise should be bounded, read-only, synthetic, and based on Microsoft's official hosted sample.",
    objectives: ["Initialize the official Browser Automation sample", "Provision its required workspace and identity roles", "Read a synthetic flight-status page without performing writes"],
    concepts: [["Browser session", "Provides an isolated automation environment."], ["Toolbox", "Makes the hosted browser tool available to the agent."], ["Action boundary", "Limits the first task to read-only navigation and extraction."]],
    packages: HOSTING, needsFoundry: true,
    resources: ["Install azd and Docker, and obtain Owner or Contributor access to the target resource group.", "Create or provision the Playwright Workspace and Toolbox exactly through the official quickstart.", "Keep authentication, payments, bookings, and personal data out of the first browser lab.", "Browser Automation is preview and can incur Azure charges."],
    resourceCommands: [{ label: "Initialize the current official Agent Framework sample", code: "$env:AZURE_DEV_USER_AGENT='microsoft_foundry_course'\nazd ai agent init -m \"https://github.com/microsoft-foundry/foundry-samples/blob/main/samples/python/hosted-agents/agent-framework/responses/14-browser-automation-agent/azure.yaml\" --deploy-mode container" }],
    files: [
      { source: "26_browser_automation/training_site/index.html", target: "26_browser_automation/training_site/student_index.html", label: "Synthetic training website", purpose: "Create a safe page containing several flight-status records." },
      { source: "26_browser_automation/demo_prompt.txt", target: "26_browser_automation/student_demo_prompt.txt", label: "Read-only automation prompt", purpose: "State the allowed navigation and prohibited actions clearly." },
    ],
    run: ["# Serve the synthetic page locally for inspection", "python -m http.server 8000 --directory .\\26_browser_automation\\training_site", "# For the Hosted agent, publish the page to an instructor-controlled HTTPS site and use the prompt in student_demo_prompt.txt"],
    expected: ["The agent identifies the cancelled flight, route, and documented next action.", "No form is submitted, no booking is changed, and no external link is followed."],
    challenge: "Add one delayed flight to the synthetic page and ask the agent to distinguish delayed from cancelled status without taking action.",
    knowledge: { concept: "Browser automation should begin with a bounded, read-only task on a synthetic site.", setup: "Provision the official Hosted-agent sample, Browser Automation workspace, Toolbox, and identity roles.", outcome: "The agent extracts the requested flight facts without clicking, submitting, booking, or authenticating." },
  },
];

// Keep the two source projects, but teach them as one end-to-end MCP lab.
const mcpServer = labs.find((lab) => lab.id === "13");
const mcpClient = labs.find((lab) => lab.id === "27");
const mcpServerPart = { ...mcpServer };
Object.assign(mcpServer, {
  title: "Build, Inspect, and Use an MCP Server with Agent Framework",
  duration: "125 min",
  resource: "MCP Inspector + Agent Framework + shared Azure MCP",
  why: "Build a small MCP server, inspect its capabilities, then connect an Agent Framework agent to the instructor's authenticated Azure server and verify its tool-backed answer.",
  needsFoundry: true,
  packages: `${mcpClient.packages} uvicorn==0.52.4`,
  objectives: [...mcpServer.objectives, ...mcpClient.objectives],
  concepts: [...mcpServer.concepts, ...mcpClient.concepts],
  resources: [...mcpServer.resources, "Use the same configured model as earlier agent labs for Part B. Reuse the virtual environment and .env from Part A."],
  documentationLinks: [...mcpServer.documentationLinks, { label: "Agent Framework MCP tools", url: "https://learn.microsoft.com/agent-framework/agents/tools/local-mcp-tools" }],
  knowledge: {
    concept: "The MCP server publishes capabilities; Inspector tests them directly; Agent Framework lets the model select and call the allowed tools.",
    setup: "Reuse one environment, pass X-API-Key to the shared MCP endpoint, and configure model authentication separately from MCP authentication.",
    outcome: "Local Inspector reports score 8/high; the shared server and agent report score 100/high for CHG-1003 because these are different teaching datasets.",
  },
});
labs.splice(labs.indexOf(mcpClient), 1);
const teachingOrder = ["00", "03", "04", "13", "06", "07", "08", "09", "10", "11", "22", "12", "20", "21", "14", "15", "16", "17", "18", "19", "23", "24", "25", "26"];

const foundryExercises = [
  {
    id: "foundry-01", title: "Get Started with Microsoft Foundry", level: "100", duration: "30 min", resource: "Microsoft Foundry portal",
    why: "Create and explore a Foundry project, review its main areas, deploy a model, and test the model in the playground.",
    url: "https://go.microsoft.com/fwlink/?linkid=2353647",
  },
  {
    id: "foundry-02", title: "Explore and Compare Models", level: "200", duration: "45 min", resource: "Model catalog + evaluation",
    why: "Compare models using model cards, benchmarks, the leaderboard, playground responses, and a synthetic evaluation dataset.",
    url: "https://microsoftlearning.github.io/mslearn-ai-studio/Instructions/Exercises/02-model-catalog-evaluation.html",
  },
  {
    id: "foundry-03", title: "Create a Generative AI Chat App", level: "200", duration: "45 min", resource: "OpenAI SDK + Responses API",
    why: "Connect a Python chat application to a deployed Foundry model, maintain conversation context, stream responses, and use the asynchronous API.",
    url: "https://microsoftlearning.github.io/mslearn-ai-studio/Instructions/Exercises/03-foundry-sdk.html",
  },
  {
    id: "foundry-04", title: "Create a Generative AI App That Uses Tools", level: "200", duration: "30 min", resource: "Web search + file search",
    why: "Use the Responses API with web search and file search so the application can retrieve current and grounded information.",
    url: "https://microsoftlearning.github.io/mslearn-ai-studio/Instructions/Exercises/04a-use-own-data.html",
  },
  {
    id: "foundry-05", title: "Apply Content Filters to Prevent Harmful Output", level: "200", duration: "25 min", resource: "Content safety filters",
    why: "Observe default safety behavior and examine how content-filter categories and severity thresholds protect prompts and completions.",
    url: "https://go.microsoft.com/fwlink/?linkid=2353440",
  },
  {
    id: "foundry-06", title: "Build AI Agents with the Portal and VS Code", level: "300", duration: "45 min", resource: "Foundry portal + Foundry Toolkit",
    why: "Create and test an agent in the Foundry portal, then continue the development experience through the Foundry Toolkit for VS Code.",
    url: "https://go.microsoft.com/fwlink/?linkid=2352649",
  },
];

const totalLabCount = foundryExercises.length + labs.length;

function displayId(lab) {
  return String(foundryExercises.length + teachingOrder.indexOf(lab.id) + 1).padStart(2, "0");
}

function foundryDisplayId(exercise) {
  return String(foundryExercises.indexOf(exercise) + 1).padStart(2, "0");
}

function agentFrameworkPhase(phase) {
  return `Agent Framework · ${phase.replace(/^Phase \d+ · /, "")}`;
}

function escapeHtml(value) {
  return String(value)
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;");
}

function slugFile(lab) {
  return `${lab.id}-${lab.slug}.html`;
}

function cleanGeneratedHtml(content) {
  return content.replace(/[ \t]+$/gm, "");
}

function languageFor(file) {
  const ext = path.extname(file).toLowerCase();
  return ({ ".py": "Python", ".ps1": "PowerShell", ".html": "HTML", ".yaml": "YAML", ".yml": "YAML", ".json": "JSON", ".jsonl": "JSON Lines", ".csv": "CSV", ".md": "Markdown", ".txt": "Text" })[ext] || (path.basename(file) === "Dockerfile" ? "Dockerfile" : "Text");
}

function splitCode(source) {
  const lines = source.replaceAll("\r\n", "\n").trimEnd().split("\n");
  const chunks = [];
  let start = 0;
  while (start < lines.length) {
    while (start < lines.length && lines[start] === "") start += 1;
    if (start >= lines.length) break;
    let end = Math.min(start + 26, lines.length);
    if (end < lines.length) {
      for (let candidate = end; candidate > start + 10; candidate -= 1) {
        const previousBlank = lines[candidate - 1]?.trim() === "";
        const nextTopLevel = /^(?:@|async def |def |class |if __name__)/.test(lines[candidate] || "");
        if (previousBlank || nextTopLevel) {
          end = candidate;
          break;
        }
      }
    }
    chunks.push(lines.slice(start, end).join("\n").trimEnd());
    start = end;
  }
  return chunks;
}

function describeModule(block, index) {
  const rules = [
    [/^(?:import |from )/m, ["Import the required libraries", "Add only the SDK types used by this part of the lab."]],
    [/load_dotenv|os\.environ|^[A-Z][A-Z0-9_]+\s*=/m, ["Load configuration", "Read endpoints, model names, and non-secret settings from the project environment."]],
    [/@tool|def get_|def check_|def read_/m, ["Define the application capability", "Create the typed tool or helper that supplies trusted application behavior."]],
    [/BaseModel|class CityInfo/m, ["Define the response contract", "Describe the fields the model must return so Python can validate them."]],
    [/ContextProvider|before_run|after_run/m, ["Implement the context provider", "Add context before the run and persist provider-owned state afterward."]],
    [/Middleware|process\(self, context/m, ["Implement middleware", "Wrap the agent or tool path with a cross-cutting control."]],
    [/@evaluator|LocalEvaluator|evaluate_agent/m, ["Define and run evaluation", "Apply repeatable checks to the agent's responses."]],
    [/@step/m, ["Define workflow steps", "Keep each workflow operation explicit and independently understandable."]],
    [/@workflow/m, ["Compose the workflow", "Connect the steps with visible Python control flow."]],
    [/AzureAISearchContextProvider|KnowledgeBaseRetrievalClient/m, ["Connect retrieval", "Configure the Search index or knowledge base used to ground the answer."]],
    [/SearchIndex\(|KnowledgeBase\(|upload_documents/m, ["Create and populate Search resources", "Define the schema or knowledge resource and load the classroom data."]],
    [/Agent\(|\.as_agent\(/m, ["Create the client and agent", "Connect the configured client to clear agent instructions and optional tools or context."]],
    [/\.run\(|retrieve\(/m, ["Run and inspect the scenario", "Execute the lab task and expose the result needed for validation."]],
    [/ResponsesHostServer/m, ["Start the Responses host", "Expose the Agent through the local Responses-compatible server."]],
    [/if __name__/m, ["Add the program entry point", "Run the completed implementation when the file is executed directly."]],
  ];
  for (const [pattern, description] of rules) {
    if (pattern.test(block)) return description;
  }
  return [`Add implementation module ${index}`, "Paste this block after the previous module and review how it advances the scenario."];
}

function readSources(lab) {
  return lab.files.map((file) => {
    const absolute = path.join(ROOT, file.source);
    if (!fs.existsSync(absolute)) throw new Error(`Missing source file: ${file.source}`);
    const source = fs.readFileSync(absolute, "utf8");
    const chunks = splitCode(source);
    if (!chunks.length) throw new Error(`No code extracted from: ${file.source}`);
    return { ...file, sourceText: source, chunks };
  });
}

function readLinks(lab) {
  if (lab.documentationLinks) {
    return [
      ...lab.documentationLinks,
      { label: "Microsoft Agent Framework documentation", url: "https://learn.microsoft.com/en-us/agent-framework/" },
    ];
  }
  const readmePath = path.join(ROOT, lab.folder, "README.md");
  const markdown = fs.readFileSync(readmePath, "utf8");
  const links = [];
  const seen = new Set();
  for (const match of markdown.matchAll(/\[([^\]]+)\]\((https?:\/\/[^)]+)\)/g)) {
    if (!seen.has(match[2])) {
      links.push({ label: match[1], url: match[2] });
      seen.add(match[2]);
    }
  }
  links.push({ label: "Microsoft Agent Framework documentation", url: "https://learn.microsoft.com/en-us/agent-framework/" });
  return links.filter((item, index, all) => all.findIndex((candidate) => candidate.url === item.url) === index);
}

function renderCode(code, language = "PowerShell") {
  return `<div class="code-shell"><div class="code-head"><span>${escapeHtml(language)}</span><button class="copy-button" type="button">Copy</button></div><pre><code>${escapeHtml(code)}</code></pre></div>`;
}

function commonSetup(lab) {
  const envLines = [];
  if (lab.needsFoundry) {
    envLines.push("FOUNDRY_PROJECT_ENDPOINT=https://<foundry-resource>.services.ai.azure.com/api/projects/<project>");
    envLines.push("FOUNDRY_MODEL=<deployed-model-name>");
  }
  envLines.push(...(lab.env || []));
  return `
    <h2 id="readiness">Start here: end-to-end readiness</h2>
    <section class="notice"><strong>Use the project root.</strong> Run every command from <code>microsoft-agent-framework-demos</code> unless the lab explicitly changes folders. Commands use PowerShell on Windows.</section>
    <h3>Step 1 — Verify prerequisites</h3>
    <ul class="checklist">
      <li><label><input type="checkbox" data-progress="${lab.id}-python"> Python 3.12 is installed.</label></li>
      <li><label><input type="checkbox" data-progress="${lab.id}-cli"> Azure CLI is installed.</label></li>
      <li><label><input type="checkbox" data-progress="${lab.id}-editor"> VS Code or another Python editor is available.</label></li>
      <li><label><input type="checkbox" data-progress="${lab.id}-access"> Required Azure access described below is available.</label></li>
    </ul>
    ${renderCode("python --version\naz --version", "PowerShell")}
    <h3>Step 2 — Create and activate the virtual environment</h3>
    <p>Create one course environment in the repository root. Reuse it for later labs.</p>
    ${renderCode("python -m venv venv\n.\\venv\\Scripts\\Activate.ps1", "PowerShell")}
    <p>If PowerShell blocks activation, allow scripts only for the current process and activate again:</p>
    ${renderCode("Set-ExecutionPolicy -Scope Process -ExecutionPolicy Bypass\n.\\venv\\Scripts\\Activate.ps1", "PowerShell")}
    <h3>Step 3 — Install the libraries</h3>
    <p>The repository requirements are pinned so every lab uses the same tested SDK surface.</p>
    ${renderCode("python -m pip install --upgrade pip\npython -m pip install -r requirements.txt\npython -m pip check", "PowerShell")}
    <details><summary>Running only this lab outside the course repository</summary><p>Install these direct packages:</p>${renderCode(`python -m pip install ${lab.packages}`, "PowerShell")}</details>
    <h3>Step 4 — Create the environment file</h3>
    <p>Create <code>.env</code> once from the safe template, then replace placeholders. Never commit <code>.env</code>.</p>
    ${renderCode("Copy-Item .env.example .env\nnotepad .env", "PowerShell")}
    ${envLines.length ? renderCode(envLines.join("\n"), "Environment") : ""}
    ${lab.needsFoundry ? `<h3>Step 5 — Authenticate for classroom development</h3><p>Sign in with the identity that has access to the Foundry project and any additional Azure resources.</p>${renderCode("az login\naz account show --query \"{subscription:name, tenant:tenantId}\" -o table", "PowerShell")}` : ""}
  `;
}

function renderResources(lab) {
  const foundry = lab.needsFoundry
    ? `<li>In Microsoft Foundry, create or select a project, deploy the instructor-approved chat model, and copy its project endpoint and deployment name into <code>.env</code>.</li><li>Grant the learner the project-level role required to invoke the deployment. For a shared class, provision this before the lab.</li>`
    : "";
  const commands = (lab.resourceCommands || []).map((item) => `<h4>${escapeHtml(item.label)}</h4>${renderCode(item.code, "PowerShell")}`).join("");
  return `<h2 id="resources">Create or verify required resources</h2><ol>${foundry}${lab.resources.map((item) => `<li>${escapeHtml(item)}</li>`).join("")}</ol>${commands}<section class="warning"><strong>Cost and cleanup:</strong> Azure Search, models, hosted agents, storage, browser workspaces, and optimization jobs can incur charges. Use instructor-provided resources where possible and follow your organization's cleanup policy after class.</section>`;
}

function renderFiles(lab, sources) {
  let moduleNumber = 1;
  const files = sources.map((file) => {
    const blocks = file.chunks.map((block) => {
      const [title, explanation] = describeModule(block, moduleNumber);
      const html = `<article class="step-card"><div class="step-number">${moduleNumber}</div><div class="step-body"><h4>${escapeHtml(title)}</h4><p>${escapeHtml(explanation)}</p>${renderCode(block, languageFor(file.source))}</div></article>`;
      moduleNumber += 1;
      return html;
    }).join("");
    return `<section class="file-build"><h3>${escapeHtml(file.label)}</h3><p>${escapeHtml(file.purpose)}</p><div class="file-target"><strong>Create:</strong> <code>${escapeHtml(file.target)}</code></div><p>Paste the following modules into the target file in the order shown.</p>${blocks}</section>`;
  }).join("");
  const support = (lab.support || []).length
    ? `<h3>Supplied supporting files</h3><p>These files are already part of the repository. Inspect or reuse them rather than retyping them.</p><ul>${lab.support.map((item) => `<li><a href="../${escapeHtml(item)}" target="_blank"><code>${escapeHtml(item)}</code></a></li>`).join("")}</ul>`
    : "";
  return `<h2 id="build">Build the lab in modules</h2>${files}${support}`;
}

function renderRun(lab) {
  const notes = lab.runNotes ? `<section class="notice">${escapeHtml(lab.runNotes)}</section>` : "";
  const deployment = (lab.deploymentCommands || []).map((item) => `<h3>${escapeHtml(item.label)}</h3>${renderCode(item.code, "PowerShell")}`).join("");
  return `<h2 id="run">Run and validate</h2>${notes}<h3>Run the completed files</h3>${renderCode(lab.run.join("\n"), "PowerShell")}${deployment}<h3>Expected result</h3><ul>${lab.expected.map((item) => `<li>${escapeHtml(item)}</li>`).join("")}</ul><section class="checkpoint"><strong>Completion checkpoint:</strong> Do not mark the lab complete until the observed output matches these conditions.</section><h3>Five-minute challenge</h3><p>${escapeHtml(lab.challenge)}</p>`;
}

function renderKnowledge(lab) {
  const questions = [
    { q: `Which statement best describes the central concept in Lab ${displayId(lab)}?`, correct: lab.knowledge.concept, wrong: ["It removes the need for model authentication and authorization.", "It stores provider credentials directly in Python source.", "It automatically deploys every Azure resource without configuration."] },
    { q: "Which setup choice matches this lab?", correct: lab.knowledge.setup, wrong: ["Hard-code every credential so the code is self-contained.", "Skip role assignments because successful sign-in grants every permission.", "Use real customer data before validating the classroom scenario."] },
    { q: "What evidence proves that the lab worked?", correct: lab.knowledge.outcome, wrong: ["The Python file exists, even if it was not run.", "The script compiled, but its output was not inspected.", "The model returned any fluent answer, regardless of the expected behavior."] },
  ];
  return `<h2 id="knowledge-check">Knowledge check</h2><div class="knowledge-list">${questions.map((question, qIndex) => {
    const options = [question.correct, ...question.wrong];
    const rotation = Number(lab.id) % options.length;
    const rotated = [...options.slice(rotation), ...options.slice(0, rotation)];
    const correctIndex = rotated.indexOf(question.correct);
    return `<section class="question" data-answer="${correctIndex}"><div class="question-number">${qIndex + 1}</div><div class="question-body"><h3>${escapeHtml(question.q)}</h3>${rotated.map((option, index) => `<label class="option"><input type="radio" name="${lab.id}-q${qIndex}" value="${index}"><span>${escapeHtml(option)}</span></label>`).join("")}<button type="button" class="check-answer">Check answer</button><p class="answer-feedback" aria-live="polite"></p></div></section>`;
  }).join("")}</div>`;
}

function renderSources(lab) {
  return `<h2 id="sources">Microsoft documentation and sample references</h2><ul>${readLinks(lab).map((item) => `<li><a href="${escapeHtml(item.url)}" target="_blank" rel="noreferrer">${escapeHtml(item.label)}</a></li>`).join("")}</ul><section class="notice"><strong>Version boundary:</strong> The lab code uses the versions pinned in the root <code>requirements.txt</code>. Preview documentation can move ahead of those packages, so upgrade only after rerunning the validation suite.</section>`;
}

function page(lab, sources) {
  const current = teachingOrder.indexOf(lab.id);
  const previous = current > 0 ? labs.find((item) => item.id === teachingOrder[current - 1]) : null;
  const next = current < teachingOrder.length - 1 ? labs.find((item) => item.id === teachingOrder[current + 1]) : null;
  const previousLink = previous
    ? `<a href="${slugFile(previous)}">← Lab ${displayId(previous)}: ${escapeHtml(previous.title)}</a>`
    : `<a href="${escapeHtml(foundryExercises.at(-1).url)}" target="_blank" rel="noreferrer">← Lab ${foundryDisplayId(foundryExercises.at(-1))}: ${escapeHtml(foundryExercises.at(-1).title)}</a>`;
  const conceptRows = lab.concepts.map(([name, description]) => `<tr><td><strong>${escapeHtml(name)}</strong></td><td>${escapeHtml(description)}</td></tr>`).join("");
  return `<!doctype html>
<html lang="en">
<head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>Lab ${displayId(lab)} — ${escapeHtml(lab.title)}</title><link rel="stylesheet" href="assets/lab.css"></head>
<body data-lab-id="${lab.id}">
<main class="exercise">
  <header class="lab-header"><a class="back-link" href="index.html">← Course lab index</a><h1>Lab ${displayId(lab)}: ${escapeHtml(lab.title)}</h1><p class="lab-header-desc">${escapeHtml(lab.why)}</p><div class="lab-header-meta"><span class="lab-meta-pill">Level ${lab.level}</span><span class="lab-meta-pill">${lab.duration}</span><span class="lab-meta-pill">${escapeHtml(agentFrameworkPhase(lab.phase))}</span><span class="lab-meta-pill">${escapeHtml(lab.resource)}</span></div></header>
  <nav class="page-nav" aria-label="Lab sections"><a href="#details">Details</a><a href="#readiness">Setup</a><a href="#resources">Resources</a>${lab.id === "13" ? '<a href="#server-part">Part A: Server</a><a href="#client-part">Part B: Agent client</a>' : '<a href="#build">Build</a><a href="#run">Validate</a>'}<a href="#knowledge-check">Knowledge check</a></nav>
  <h2 id="details">Lab details</h2>
  <table><thead><tr><th>Level</th><th>Persona</th><th>Duration</th><th>Primary resource</th></tr></thead><tbody><tr><td>${lab.level}</td><td>Python developer / solution architect</td><td>${lab.duration}</td><td>${escapeHtml(lab.resource)}</td></tr></tbody></table>
  <h2>Why this matters</h2><p>${escapeHtml(lab.why)}</p>
  <h2>Learning objectives</h2><ul>${lab.objectives.map((item) => `<li>${escapeHtml(item)}</li>`).join("")}</ul>
  <h2>Core concepts</h2><table><thead><tr><th>Concept</th><th>What it means in this lab</th></tr></thead><tbody>${conceptRows}</tbody></table>
  ${commonSetup(lab)}
  ${renderResources(lab)}
  ${lab.id === "13" ? renderMcpParts() : renderFiles(lab, sources) + renderRun(lab)}
  ${renderKnowledge(lab)}
  <h2>Summary of learning</h2><ul>${lab.objectives.map((item) => `<li>${escapeHtml(item)}</li>`).join("")}</ul>
  ${renderSources(lab)}
  <div class="completion"><label><input type="checkbox" data-lab-complete="${lab.id}"> Mark Lab ${displayId(lab)} complete</label></div>
  <nav class="lab-pager">${previousLink}${next ? `<a href="${slugFile(next)}">Lab ${displayId(next)}: ${escapeHtml(next.title)} →</a>` : `<a href="index.html">Return to index →</a>`}</nav>
</main><script src="assets/lab.js"></script></body></html>`;
}

function renderMcpParts() {
  const partB = (renderFiles(mcpClient, readSources(mcpClient)) + renderRun(mcpClient))
    .replaceAll('id="build"', 'id="client-build"').replaceAll('id="run"', 'id="client-run"');
  return `<h2 id="server-part">Part A — Build and inspect the MCP server</h2>
    ${renderFiles(mcpServerPart, readSources(mcpServerPart))}${renderRun(mcpServerPart)}
    <h2 id="client-part">Part B — Use the authenticated server from Agent Framework</h2>
    <p>Continue in the same activated environment and repository root. Keep the same .env; do not copy the template again. Use the shared HTTPS endpoint and X-API-Key tested in Part A.</p>
    <section class="notice"><strong>Compare the right datasets.</strong> The local teaching server returns score 8/high for CHG-1003. The shared Azure server returns score 100/high. Part B uses the shared server; compare its answer with the remote Inspector result, not the local score.</section>
    ${partB}`;
}

function indexPage() {
  const phases = [...new Set(teachingOrder.map((id) => labs.find((lab) => lab.id === id).phase))];
  const foundryCards = foundryExercises.map((exercise) => `<article class="lab-card external-lab"><div class="card-top"><span class="lab-number">${foundryDisplayId(exercise)}</span><label class="index-check"><input type="checkbox" data-lab-complete="${exercise.id}"> Complete</label></div><h3>${escapeHtml(exercise.title)}</h3><p>${escapeHtml(exercise.why)}</p><div class="card-meta"><span>Level ${exercise.level}</span><span>${exercise.duration}</span><span>${escapeHtml(exercise.resource)}</span></div><a class="start-button" href="${escapeHtml(exercise.url)}" target="_blank" rel="noreferrer">Lab link ↗</a></article>`).join("");
  const sections = phases.map((phase) => {
    const phaseLabs = teachingOrder.map((id) => labs.find((lab) => lab.id === id)).filter((lab) => lab.phase === phase);
    return `<section class="phase"><h2>${escapeHtml(agentFrameworkPhase(phase))}</h2><div class="lab-grid">${phaseLabs.map((lab) => `<article class="lab-card"><div class="card-top"><span class="lab-number">${displayId(lab)}</span><label class="index-check"><input type="checkbox" data-lab-complete="${lab.id}"> Complete</label></div><h3><a href="${slugFile(lab)}">${escapeHtml(lab.title)}</a></h3><p>${escapeHtml(lab.why)}</p><div class="card-meta"><span>Level ${lab.level}</span><span>${lab.duration}</span><span>${escapeHtml(lab.resource)}</span></div><a class="start-button" href="${slugFile(lab)}">Open lab →</a></article>`).join("")}</div></section>`;
  }).join("");
  return `<!doctype html><html lang="en"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>Microsoft Foundry and Agent Framework course labs</title><link rel="stylesheet" href="assets/lab.css"></head><body><main class="index-shell"><header class="course-header"><p class="eyebrow">Hands-on Microsoft AI course</p><h1>Microsoft Foundry and Agent Framework: From Foundations to Production-Ready Agentic Systems</h1><p>${totalLabCount} labs in one learning path: ${foundryExercises.length} official Microsoft Foundry exercises followed by ${labs.length} documentation-aligned Microsoft Agent Framework labs.</p><div class="progress-panel"><div><strong id="progress-count">0 of ${totalLabCount} labs complete</strong><span>Progress is stored only in this browser.</span></div><div class="progress-track"><div id="progress-bar"></div></div></div></header><section class="index-readiness"><h2>Before Lab 01</h2><ol><li>Install Python, Azure CLI, Node.js, Git, and VS Code.</li><li>Use an Azure subscription in which you can create Foundry resources and deploy models.</li><li>For Labs 01–06, follow the linked official Microsoft exercise and its stated prerequisites.</li><li>Before Lab 07, clone or extract this repository and obtain the Foundry project endpoint, deployed model name, and required Azure roles from the instructor.</li></ol><p><a href="../README.md">Project README</a> · <a href="../.env.example">Environment template</a> · <a href="../requirements.txt">Pinned requirements</a></p></section><section class="phase foundry-phase"><h2>Microsoft Foundry foundations · Labs 01–06</h2><p class="phase-intro">These links open the current Microsoft-hosted exercises in a new tab. Complete them in order, then return here to begin Microsoft Agent Framework at Lab 07.</p><div class="lab-grid">${foundryCards}</div></section><section class="notice transition"><strong>Transition to Agent Framework:</strong> You have now created a Foundry project, explored and evaluated models, built model applications with the Responses API and tools, reviewed content safety, and created an agent through the portal and VS Code. The remaining labs use those foundations to build agents in Python with Microsoft Agent Framework.</section>${sections}<footer>Labs 01–06 link directly to Microsoft-hosted exercise instructions. The Agent Framework workbook is independently authored training material with references to Microsoft Learn documentation and official samples.</footer></main><script src="assets/lab.js"></script></body></html>`;
}

const css = `
:root{color-scheme:light;--ink:#1f2937;--heading:#172554;--line:#d8dee8;--soft:#f5f7fb;--accent:#4f46e5;--accent2:#0369a1;--success:#087f5b;--warning:#9a6700;--danger:#b42318}
*{box-sizing:border-box}html{background:#eef2f7;scroll-behavior:smooth}body{margin:0;background:#eef2f7;color:var(--ink);font:16.5px/1.62 "Segoe UI",Arial,sans-serif}.exercise,.index-shell{width:min(1180px,calc(100% - 32px));margin:28px auto;padding:42px 50px 58px;background:#fff;border:1px solid var(--line);border-radius:16px;box-shadow:0 12px 36px rgba(15,23,42,.08)}.lab-header,.course-header{margin:-42px -50px 34px;padding:34px 50px;color:#fff;background:linear-gradient(120deg,#312e81,#4f46e5 58%,#0369a1);border-radius:16px 16px 0 0}.lab-header h1,.course-header h1{margin:.35rem 0 .7rem;color:#fff;font-size:clamp(2rem,4vw,3rem);line-height:1.12}.lab-header-desc,.course-header>p{max-width:90ch;color:#eef2ff}.back-link{color:#fff;text-decoration:none}.lab-header-meta,.card-meta{display:flex;flex-wrap:wrap;gap:.55rem}.lab-meta-pill,.card-meta span{display:inline-block;padding:.28rem .65rem;border:1px solid rgba(255,255,255,.42);border-radius:999px;background:rgba(255,255,255,.14);font-size:.86rem}.page-nav{position:sticky;top:0;z-index:5;display:flex;gap:.4rem;overflow:auto;margin:0 -10px;padding:10px;background:rgba(255,255,255,.96);border-bottom:1px solid var(--line)}.page-nav a{white-space:nowrap;padding:.4rem .65rem;color:#3730a3;text-decoration:none;border-radius:8px}.page-nav a:hover{background:#eeecff}h2,h3,h4{color:var(--heading);line-height:1.25}h2{margin:2.7rem 0 1rem;padding-bottom:.4rem;border-bottom:2px solid #e9e7ff;font-size:1.65rem}h3{margin-top:2rem;font-size:1.3rem}h4{margin:.15rem 0 .5rem;font-size:1.08rem}p,li{max-width:95ch}li+li{margin-top:.35rem}a{color:#3730a3}table{width:100%;margin:1.25rem 0;border-collapse:collapse;display:block;overflow-x:auto}th,td{padding:.7rem .85rem;border:1px solid var(--line);text-align:left;vertical-align:top}th{background:#eeecff;color:#2e2a72}.notice,.warning,.checkpoint{margin:1.3rem 0;padding:.9rem 1.1rem;border-left:5px solid var(--accent);background:#f0efff;border-radius:0 10px 10px 0}.warning{border-color:#d69e00;background:#fff7d6}.checkpoint{border-color:var(--success);background:#e9f8f1}.checklist{list-style:none;padding:0}.checklist label{display:block;padding:.55rem .7rem;background:var(--soft);border:1px solid var(--line);border-radius:8px}.code-shell{max-width:100%;margin:1rem 0;border-radius:10px;overflow:hidden;background:#111827}.code-head{display:flex;justify-content:space-between;align-items:center;padding:.45rem .7rem;color:#cbd5e1;background:#1f2937;font-size:.78rem}.copy-button{padding:.28rem .6rem;color:#fff;background:#4f46e5;border:0;border-radius:6px;cursor:pointer}.copy-button.copied{background:var(--success)}pre{max-width:100%;margin:0;overflow:auto;padding:1rem 1.1rem;color:#f8fafc;background:#111827;line-height:1.48}code{font-family:"Cascadia Code",Consolas,monospace;font-size:.9em;background:#eef1f6;padding:.12rem .3rem;border-radius:4px;overflow-wrap:anywhere}pre code{background:transparent;padding:0}.file-build{min-width:0;margin:2rem 0;padding:1.2rem;border:1px solid var(--line);border-radius:14px;background:#fbfcff}.file-target{display:flex;flex-wrap:wrap;gap:.7rem;align-items:center;padding:.7rem;background:#eef2ff;border-radius:8px}.step-card{display:grid;grid-template-columns:44px minmax(0,1fr);gap:14px;margin:1rem 0;padding:1rem;border:1px solid var(--line);border-radius:12px;background:#fff}.step-body{min-width:0}.step-number,.question-number,.lab-number{display:grid;place-items:center;width:38px;height:38px;border-radius:50%;color:#fff;background:var(--accent);font-weight:700}.question{display:grid;grid-template-columns:46px minmax(0,1fr);gap:14px;margin:1rem 0;padding:1.1rem;background:#f3f4f6;border-radius:14px}.question h3{margin:.1rem 0 .8rem}.option{display:flex;gap:.6rem;margin:.45rem 0;padding:.55rem .65rem;background:#fff;border:1px solid var(--line);border-radius:8px}.option.correct{border-color:var(--success);background:#e9f8f1}.option.incorrect{border-color:var(--danger);background:#fff0ef}.check-answer{margin-top:.6rem;padding:.45rem .8rem;color:#fff;background:var(--accent);border:0;border-radius:7px;cursor:pointer}.answer-feedback{font-weight:650}.completion{margin:2.2rem 0;padding:1rem;background:#e9f8f1;border:1px solid #95d5bd;border-radius:12px}.lab-pager{display:flex;justify-content:space-between;gap:1rem;margin-top:2rem;padding-top:1.2rem;border-top:1px solid var(--line)}.lab-pager a{max-width:48%;padding:.7rem 1rem;text-decoration:none;background:#eeecff;border-radius:9px}.eyebrow{text-transform:uppercase;letter-spacing:.12em;font-weight:700}.progress-panel{margin-top:1.3rem;padding:1rem;background:rgba(255,255,255,.14);border:1px solid rgba(255,255,255,.3);border-radius:12px}.progress-panel>div:first-child{display:flex;justify-content:space-between;gap:1rem}.progress-track{height:10px;margin-top:.7rem;background:rgba(255,255,255,.25);border-radius:99px;overflow:hidden}.progress-track div{width:0;height:100%;background:#a7f3d0}.index-readiness{padding:1.2rem;border:1px solid var(--line);border-radius:14px;background:#fbfcff}.phase{margin-top:2.7rem}.phase-intro{margin:-.25rem 0 1.25rem;color:#475467}.lab-grid{display:grid;grid-template-columns:repeat(2,minmax(0,1fr));gap:16px}.lab-card{display:flex;flex-direction:column;padding:1.1rem;border:1px solid var(--line);border-radius:14px;background:#fff;box-shadow:0 6px 18px rgba(15,23,42,.05)}.external-lab{border-top:4px solid var(--accent2)}.transition{margin-top:2.7rem}.card-top{display:flex;justify-content:space-between}.index-check{font-size:.85rem}.lab-card h3{margin:.8rem 0 .4rem}.lab-card p{font-size:.92rem}.card-meta span{color:#374151;background:#f3f4f6;border-color:#e5e7eb}.start-button{align-self:flex-start;margin-top:auto;padding:.55rem .8rem;color:#fff;background:var(--accent);text-decoration:none;border-radius:8px}footer{margin-top:3rem;padding-top:1.2rem;color:#667085;border-top:1px solid var(--line);font-size:.85rem}
@media(max-width:760px){.exercise,.index-shell{width:100%;margin:0;padding:28px 20px;border-radius:0}.lab-header,.course-header{margin:-28px -20px 28px;padding:28px 20px;border-radius:0}.lab-grid{grid-template-columns:1fr}.step-card,.question{grid-template-columns:1fr}.page-nav{position:static}.lab-pager{flex-direction:column}.lab-pager a{max-width:100%}.progress-panel>div:first-child{flex-direction:column}}
@media print{html,body{background:#fff}.exercise{width:100%;margin:0;padding:0;border:0;box-shadow:none}.lab-header{margin:0 0 24px;padding:20px 0;color:#111;background:#fff;border-bottom:3px solid var(--accent);border-radius:0}.lab-header h1,.lab-header-desc,.back-link{color:#111}.page-nav,.copy-button,.completion,.lab-pager{display:none}.step-card,.question,pre,table{break-inside:avoid}}
`;

const js = `
const stateKey = "maf-course-lab-progress-v1";
const loadState = () => { try { return JSON.parse(localStorage.getItem(stateKey) || "{}"); } catch { return {}; } };
const saveState = (state) => localStorage.setItem(stateKey, JSON.stringify(state));
const state = loadState();
document.querySelectorAll("[data-progress]").forEach((box) => { box.checked = Boolean(state[box.dataset.progress]); box.addEventListener("change", () => { state[box.dataset.progress] = box.checked; saveState(state); }); });
document.querySelectorAll("[data-lab-complete]").forEach((box) => { const key = "complete-" + box.dataset.labComplete; box.checked = Boolean(state[key]); box.addEventListener("change", () => { state[key] = box.checked; saveState(state); document.querySelectorAll('[data-lab-complete="' + box.dataset.labComplete + '"]').forEach((other) => { other.checked = box.checked; }); updateProgress(); }); });
function updateProgress(){ const boxes=[...document.querySelectorAll("[data-lab-complete]")]; const ids=[...new Set(boxes.map((box)=>box.dataset.labComplete))]; const completed=ids.filter((id)=>state["complete-"+id]).length; const label=document.getElementById("progress-count"); const bar=document.getElementById("progress-bar"); if(label) label.textContent=completed+" of "+ids.length+" labs complete"; if(bar) bar.style.width=(ids.length?completed/ids.length*100:0)+"%"; }
document.querySelectorAll(".copy-button").forEach((button) => button.addEventListener("click", async () => { const text=button.closest(".code-shell").querySelector("code").innerText; try { await navigator.clipboard.writeText(text); } catch { const area=document.createElement("textarea"); area.value=text; document.body.append(area); area.select(); document.execCommand("copy"); area.remove(); } button.textContent="Copied"; button.classList.add("copied"); setTimeout(()=>{button.textContent="Copy";button.classList.remove("copied");},1200); }));
document.querySelectorAll(".check-answer").forEach((button) => button.addEventListener("click", () => { const question=button.closest(".question"); const expected=Number(question.dataset.answer); const selected=question.querySelector("input:checked"); const feedback=question.querySelector(".answer-feedback"); question.querySelectorAll(".option").forEach((label,index)=>{label.classList.remove("correct","incorrect"); if(index===expected) label.classList.add("correct"); else if(selected && Number(selected.value)===index) label.classList.add("incorrect");}); if(!selected){feedback.textContent="Select an answer, then check again.";return;} feedback.textContent=Number(selected.value)===expected?"Correct — this matches the lab design.":"Review the highlighted correct answer and the related lab section."; }));
updateProgress();
`;

function validateGenerated() {
  const htmlFiles = fs.readdirSync(OUT).filter((name) => name.endsWith(".html"));
  if (htmlFiles.length !== labs.length + 2) throw new Error(`Expected ${labs.length + 2} HTML files including the legacy MCP link, found ${htmlFiles.length}`);
  for (const lab of labs) {
    const file = path.join(OUT, slugFile(lab));
    const content = fs.readFileSync(file, "utf8");
    for (const required of ["python -m venv venv", "pip install", "knowledge-check", "Create or verify required resources", "Build the lab in modules"]) {
      if (!content.includes(required)) throw new Error(`${slugFile(lab)} missing ${required}`);
    }
    if ((content.match(/class="question"/g) || []).length !== 3) throw new Error(`${slugFile(lab)} must contain three knowledge checks`);
    if ((content.match(/<pre><code>/g) || []).length < 3) throw new Error(`${slugFile(lab)} has too few code blocks`);
    if (/AccountKey=|DefaultEndpointsProtocol=/.test(content)) throw new Error(`${slugFile(lab)} contains a storage secret pattern`);
  }
  const indexContent = fs.readFileSync(path.join(OUT, "index.html"), "utf8");
  if ((indexContent.match(/class="lab-card/g) || []).length !== totalLabCount) throw new Error(`Index must contain ${totalLabCount} lab cards`);
  for (const exercise of foundryExercises) {
    if (!indexContent.includes(exercise.url)) throw new Error(`Index missing Foundry exercise: ${exercise.title}`);
  }
  if (!indexContent.includes(`0 of ${totalLabCount} labs complete`) || !indexContent.includes("Lab 07")) throw new Error("Index numbering does not reflect the Foundry-first sequence");
}

fs.mkdirSync(ASSETS, { recursive: true });
const currentLabFiles = new Set([...labs.map((lab) => slugFile(lab)), "27-mcp-agent-client.html"]);
for (const name of fs.readdirSync(OUT)) {
  if (/^\d{2}-.*\.html$/.test(name) && !currentLabFiles.has(name)) {
    fs.rmSync(path.join(OUT, name));
  }
}
fs.writeFileSync(path.join(ASSETS, "lab.css"), css.trimStart(), "utf8");
fs.writeFileSync(path.join(ASSETS, "lab.js"), js.trimStart(), "utf8");
// A focused merge preserves hand-edited content in other published labs.
const mergeOnly = process.argv.includes("--merge-mcp");
const oldNumbers = new Map();
if (mergeOnly) {
  for (const lab of labs) {
    const content = fs.readFileSync(path.join(OUT, slugFile(lab)), "utf8");
    const old = content.match(/<title>Lab (\d+)/)?.[1];
    if (old) oldNumbers.set(old, displayId(lab));
  }
}
for (const lab of labs) {
  const file = path.join(OUT, slugFile(lab));
  let content;
  if (mergeOnly && lab.id !== "13") {
    content = fs.readFileSync(file, "utf8").replace(/Lab (\d{2})\b/g, (match, n) => `Lab ${oldNumbers.get(n) || n}`);
    const generated = page(lab, []);
    content = content.replace(/<nav class="lab-pager">[\s\S]*?<\/nav>/, generated.match(/<nav class="lab-pager">[\s\S]*?<\/nav>/)[0]);
  } else {
    content = cleanGeneratedHtml(page(lab, readSources(lab)));
  }
  fs.writeFileSync(file, content, "utf8");
}
fs.writeFileSync(path.join(OUT, "27-mcp-agent-client.html"), `<!doctype html><html lang="en"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><meta http-equiv="refresh" content="0;url=13-mcp.html#client-part"><title>MCP client exercise moved to Lab 10</title></head><body><p>This exercise is now Part B of Lab 10. <a href="13-mcp.html#client-part">Open the combined MCP lab</a>.</p></body></html>`, "utf8");
fs.writeFileSync(path.join(OUT, "index.html"), cleanGeneratedHtml(indexPage()), "utf8");
validateGenerated();
console.log(`Generated ${labs.length} labs plus index.html in ${OUT}`);
