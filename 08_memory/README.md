# File-backed memory

Uses `FileMemoryProvider` and a stable per-user scope. A second, new session can recall preferences stored by the first session because the memory lives outside chat history.

Source: [Memory and persistence](https://learn.microsoft.com/en-us/agent-framework/get-started/memory), [official file-memory sample](https://github.com/microsoft/agent-framework/blob/main/python/samples/02-agents/context_providers/file_memory_provider.py).

