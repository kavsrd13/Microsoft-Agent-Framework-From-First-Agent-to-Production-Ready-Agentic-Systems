# Advanced RAG and agentic RAG teaching plan

The course should teach the retrieval progression in layers. Students first see what ordinary RAG does, then inspect what agentic retrieval adds, and only then add document-level authorization.

## Recommended classroom sequence

| Stage | Main idea | Demonstration |
|---|---|---|
| 1. Indexing | Documents become searchable fields and chunks | Inspect the fictional travel CSV and index schema |
| 2. Classic RAG | One query retrieves top relevant results | `20_agentic_retrieval/01_classic_semantic_rag.py` |
| 3. Agentic retrieval | GPT decomposes a compound request into focused subqueries | `20_agentic_retrieval/02_agentic_retrieval.py` |
| 4. Transparent reasoning | Activity and references expose planning, execution, and grounding | Review the direct SDK output |
| 5. Conversation | Previous turns help interpret follow-up questions | The second retrieval in `02_agentic_retrieval.py` |
| 6. Agent integration | A knowledge base becomes automatic context for an Agent Framework agent | `20_agentic_retrieval/03_agent_framework_agentic_rag.py` |
| 7. Permission metadata | Every secure document carries user/group ACLs | Inspect `21_identity_aware_rag/00_create_secure_resources.py` |
| 8. Query identity | A separate Search-scoped user token drives authorization | `21_identity_aware_rag/01_sdk_authorized_retrieval.py` |
| 9. Identity-aware agent | Agent Framework forwards the user identity on every retrieval | `21_identity_aware_rag/02_agent_framework_identity_rag.py` |
| 10. Negative proof | Finance-only content is absent for a nonmember | Compare the allowed and denied questions |

## Advanced features to explain

- Semantic, vector, and hybrid retrieval; add Microsoft's vectorizer fields after an embedding deployment is available.
- Query decomposition, synonym expansion, spelling correction, and parallel subqueries.
- `minimal`, `low`, and `medium` retrieval reasoning effort and their latency/token tradeoffs.
- Extractive output versus answer synthesis.
- Knowledge-source selection, `always_query_source`, per-source filters, and reference source data.
- Multiple indexed and remote knowledge sources in one knowledge base.
- Activity records, citations, reranker thresholds, evaluation, tracing, and cost controls.
- Knowledge-base MCP endpoints for MCP-compatible agents.
- Permission-aware sources using `userIds`, `groupIds`, or storage `rbacScope`.
- The security invariant: unauthorized content is removed before model invocation.

## Recommended live identity test

Use two Entra classroom accounts or one user plus a real finance group:

| Question | Ordinary learner | Finance-group learner |
|---|---:|---:|
| Public help-line number | Allowed | Allowed |
| Own traveler assistance code | Allowed when directly assigned | Only if directly assigned |
| Finance refund authorization code | Denied | Allowed |
| Blocked incident marker | Denied | Denied |

The browser or prompt must never supply its own user ID or ACL filter. The backend obtains a delegated user token, and Azure AI Search derives the user's object and group identities from that token.

## Production boundary

`AzureCliCredential` is for classroom execution. A real web application should use an application/workload credential for the Search request and a delegated end-user token for `x-ms-query-source-authorization`. Use HTTPS, managed identity, a protected token cache, current ACL ingestion, audit logs, retrieval evaluation, and fail-closed error handling.
