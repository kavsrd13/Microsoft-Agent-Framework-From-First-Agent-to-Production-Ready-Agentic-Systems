# Agentic retrieval with Azure AI Search

This lab contrasts classic semantic RAG with Azure AI Search agentic retrieval. It follows the official Python quickstart structure while using a small fictional travel-operations CSV that is easier to explain in class.

Prerequisites on Azure AI Search: `Search Service Contributor`, `Search Index Data Contributor`, and `Search Index Data Reader` for the classroom identity. The Search service needs a managed identity with `Cognitive Services User` on the Foundry resource when the knowledge base uses GPT.

## Teaching order

1. Run `00_create_resources.py` to create the index, upload the CSV, and create the knowledge source and knowledge base.
2. Run `01_classic_semantic_rag.py` to show one semantic retrieval feeding a Microsoft Agent Framework agent.
3. Run `02_agentic_retrieval.py` to expose query decomposition, parallel search activity, answer synthesis, references, and conversational follow-up.
4. Run `03_agent_framework_agentic_rag.py` to attach that knowledge base through `AzureAISearchContextProvider(mode="agentic")`.

## What students should observe

- Classic RAG retrieves top matches for one query.
- Agentic retrieval plans multiple focused subqueries for a compound question.
- `activity` makes the planning and search process visible.
- `references` show which indexed documents grounded the answer.
- Conversation history resolves follow-up questions.
- `retrieval_reasoning_effort` and output mode trade latency/tokens for richer reasoning.

The index is text plus semantic ranking so it works without a separate embedding deployment. Add the vectorizer/vector field from Microsoft's quickstart when a `text-embedding` deployment is available to teach hybrid vector retrieval.

## Official sources

- [Agentic retrieval overview](https://learn.microsoft.com/en-us/azure/search/agentic-retrieval-overview?tabs=quickstarts)
- [Python agentic retrieval quickstart](https://learn.microsoft.com/en-us/azure/search/search-get-started-agentic-retrieval?pivots=python)
- [Query a knowledge base](https://learn.microsoft.com/en-us/azure/search/agentic-retrieval-how-to-retrieve)
- [Agent Framework Azure AI Search provider](https://learn.microsoft.com/en-us/agent-framework/integrations/by-component/context-providers/azure-ai-search)

Agentic retrieval can incur Azure AI Search and Azure OpenAI token charges. The current preview API surface can change.
