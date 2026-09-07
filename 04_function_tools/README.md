# Function tools and human approval

The second participant lab combines the original function-tool and tool-approval exercises into one safe progression:

1. `demo.py` defines a typed function with `@tool`, adds it to an agent, and lets the Azure OpenAI model call it through `OpenAIChatClient`. `never_require` is used only because this weather tool is read-only and has no side effects.
2. `05_tool_approval/demo.py` marks a simulated calendar action with `approval_mode="always_require"`. The agent pauses, the program shows the proposed call, and a person approves or rejects it before execution.

Sources: [tools overview](https://learn.microsoft.com/en-us/agent-framework/agents/tools/), [function tools with human approval](https://learn.microsoft.com/en-us/agent-framework/agents/tools/tool-approval), [official add-tools sample](https://github.com/microsoft/agent-framework/blob/main/python/samples/01-get-started/02_add_tools.py), [official session-based approval sample](https://github.com/microsoft/agent-framework/blob/main/python/samples/02-agents/tools/function_tool_with_approval_and_sessions.py).
