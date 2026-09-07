# Identity-aware RAG with Microsoft Agent Framework

This lab proves that authorization happens inside Azure AI Search before grounding reaches the model. The index contains public documents, documents assigned directly to the signed-in classroom user, finance-group documents, and a document accessible to nobody.

Prerequisites on Azure AI Search: `Search Service Contributor`, `Search Index Data Contributor`, and `Search Index Data Reader` for the classroom identity. The Search service needs a managed identity with `Cognitive Services User` on the Foundry resource when the knowledge base uses GPT.

## Teaching order

1. Run `00_create_secure_resources.py`. It reads the current Azure CLI user's `oid` claim locally, creates a permission-enabled index, and pushes the CSV rows with `UserIds` and `GroupIds` ACL metadata.
2. Run `01_sdk_authorized_retrieval.py`. This closely follows Microsoft's documented `x_ms_query_source_authorization` example and contrasts an allowed user-specific question with a denied finance question.
3. Run `02_agent_framework_identity_rag.py`. It supplies `query_source_credential` to `AzureAISearchContextProvider`, which forwards the user's Search-scoped token on each agentic retrieval request.

## The three security gates

1. Entra sign-in identifies the person.
2. The service credential authenticates the application to Azure AI Search.
3. Azure AI Search compares the query-source user's object/group IDs with each document's ACL fields.

The third gate must run before retrieved text reaches Foundry. Prompt instructions are not access control. ACL fields are `retrievable=False` so principal identifiers are not exposed in grounding or citations.

The Agent Framework model call uses the shared Azure OpenAI API key. This lab still requires Microsoft Entra sign-in for the Search-scoped end-user token because an API key cannot represent an individual user's object ID or group membership.

For a two-user classroom demonstration, set `DEMO_FINANCE_GROUP_OBJECT_ID` to a real Entra group object ID, rerun setup, and compare a group member's `az login` session with a nonmember. Never put email addresses in ACL fields; Microsoft requires stable Entra object IDs.

## Official sources

- [Query-time ACL and RBAC enforcement](https://learn.microsoft.com/en-us/azure/search/search-query-access-control-rbac-enforcement)
- [Index ACLs with the push API](https://learn.microsoft.com/en-us/azure/search/search-index-access-control-lists-and-rbac-push-api)
- [Knowledge-base permission enforcement](https://learn.microsoft.com/en-us/azure/search/agentic-retrieval-how-to-retrieve#enforce-permissions-at-query-time-preview)
- [Agent Framework Azure AI Search provider](https://learn.microsoft.com/en-us/agent-framework/integrations/by-component/context-providers/azure-ai-search)

Permission filters and the query-source authorization flow currently require the preview Search API/SDK. Revalidate versions before teaching a future class.
