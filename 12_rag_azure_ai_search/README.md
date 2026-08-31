# RAG with Azure AI Search

Attaches `AzureAISearchContextProvider` in semantic mode so relevant Search documents are retrieved before the Foundry model answers. Configure `AZURE_SEARCH_ENDPOINT` and `AZURE_SEARCH_INDEX_NAME`; leave `AZURE_SEARCH_API_KEY` empty to use the signed-in Azure CLI identity.

This demo assumes the index already contains searchable documents and fields compatible with semantic search.

Sources: [Adding context providers](https://learn.microsoft.com/en-us/agent-framework/journey/adding-context-providers), [Azure AI Search context provider API](https://learn.microsoft.com/en-us/python/api/agent-framework-core/agent_framework.azure.azureaisearchcontextprovider?view=agent-framework-python-latest), [official Search sample](https://github.com/microsoft/agent-framework/blob/main/python/samples/02-agents/context_providers/azure_ai_search/search_context_semantic.py).

