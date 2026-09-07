import asyncio
import os

from agent_framework import Agent, RunContext, WorkflowRunState, step, workflow
from agent_framework.openai import OpenAIChatClient
from dotenv import load_dotenv

load_dotenv()

client = OpenAIChatClient(
    base_url=os.environ["AZURE_OPENAI_ENDPOINT"],
    api_key=os.environ["AZURE_OPENAI_API_KEY"],
    model=os.environ["AZURE_OPENAI_DEPLOYMENT"],
)
writer = Agent(client=client, name="Writer", instructions="Write a concise paragraph about the requested topic.")
reviser = Agent(client=client, name="Reviser", instructions="Revise a draft using the supplied human feedback.")


@step
async def write_draft(topic: str) -> str:
    print("Writer agent is creating the draft...")
    return (await writer.run(topic)).text


@step
async def revise_draft(draft_and_feedback: tuple[str, str]) -> str:
    draft, feedback = draft_and_feedback
    prompt = f"Draft:\n{draft}\n\nHuman feedback:\n{feedback}"
    return (await reviser.run(prompt)).text


@workflow
async def review_pipeline(topic: str, ctx: RunContext) -> str:
    draft = await write_draft(topic)
    feedback = await ctx.request_info(
        {"draft": draft, "instructions": "Review this draft"},
        response_type=str,
        request_id="review_request",
    )
    return await revise_draft((draft, feedback))


async def main() -> None:
    workflow_instance = review_pipeline.build()

    first_result = await workflow_instance.run("Why human oversight matters for AI agents")
    if first_result.get_final_state() != WorkflowRunState.IDLE_WITH_PENDING_REQUESTS:
        raise RuntimeError("The workflow did not pause for review as expected.")

    request = first_result.get_request_info_events()[0]
    print(f"Paused at request: {request.request_id}")
    feedback = await asyncio.to_thread(input, "Enter review feedback: ")

    final_result = await workflow_instance.run(responses={request.request_id: feedback})
    print("\nRevised draft:\n", final_result.get_outputs()[0])


if __name__ == "__main__":
    asyncio.run(main())
