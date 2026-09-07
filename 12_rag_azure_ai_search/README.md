# RAG with Azure AI Search

This lab has two parts:

1. Complete Microsoft's [Create a knowledge mining solution](https://go.microsoft.com/fwlink/?linkid=2320469) exercise. Keep the Search service and semantic index named `margies-index` for Part B.
2. Run `demo.py` to attach `AzureAISearchContextProvider` in semantic mode so the Agent Framework agent retrieves relevant travel content before the Foundry model answers.

Configure `AZURE_SEARCH_ENDPOINT`, `AZURE_SEARCH_INDEX_NAME=margies-index`, and `AZURE_SEARCH_API_KEY` with the query key recorded in Part A. `AzureCliCredential` authenticates the Foundry model client after `az login`.

Sources: [Azure AI Search context provider](https://learn.microsoft.com/en-us/agent-framework/integrations/by-component/context-providers/azure-ai-search), [Azure AI Search context provider API](https://learn.microsoft.com/en-us/python/api/agent-framework-core/agent_framework.azure.azureaisearchcontextprovider?view=agent-framework-python-latest).
