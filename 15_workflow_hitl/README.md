# Workflow human-in-the-loop

The writer's model call is cached as a workflow step. `ctx.request_info()` pauses execution for human feedback, and `run(responses=...)` resumes at the pause without re-running the writer.

Source: [Human-in-the-loop workflows](https://learn.microsoft.com/en-us/agent-framework/workflows/human-in-the-loop), [official functional HITL sample](https://github.com/microsoft/agent-framework/blob/main/python/samples/03-workflows/functional/hitl_review.py).

