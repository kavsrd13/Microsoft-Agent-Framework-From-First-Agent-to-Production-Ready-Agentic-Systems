# Handoff multi-agent orchestration

Starts at a triage agent. `HandoffBuilder` supplies the handoff tools that let triage transfer an order-status request to the specialist. The specialist calls a read-only simulated order tool and emits the termination marker.

Source: [Handoff orchestration](https://learn.microsoft.com/en-us/agent-framework/user-guide/workflows/orchestrations/handoff), [official sample](https://github.com/microsoft/agent-framework/blob/main/python/samples/03-workflows/orchestrations/handoff_simple.py).

