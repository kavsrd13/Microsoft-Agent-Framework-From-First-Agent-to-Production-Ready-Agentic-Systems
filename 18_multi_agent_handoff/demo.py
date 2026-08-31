import asyncio
import os
from typing import Annotated

from agent_framework import Agent, AgentResponse, Message, tool
from agent_framework.foundry import FoundryChatClient
from agent_framework.orchestrations import HandoffBuilder
from azure.identity import AzureCliCredential
from dotenv import load_dotenv

load_dotenv()


@tool(approval_mode="never_require")
def check_order(order_number: Annotated[str, "Customer order number"]) -> str:
    """Check an order in this read-only classroom simulation."""
    return f"Order {order_number} is packed and will ship in two business days."


async def main() -> None:
    client = FoundryChatClient(
        project_endpoint=os.environ["FOUNDRY_PROJECT_ENDPOINT"],
        model=os.environ["FOUNDRY_MODEL"],
        credential=AzureCliCredential(),
    )
    triage = Agent(
        client=client,
        name="triage",
        instructions="Route order-status questions to the order specialist.",
        require_per_service_call_history_persistence=True,
    )
    order_specialist = Agent(
        client=client,
        name="order_specialist",
        instructions="Use the order tool, answer the customer, and end with RESOLVED.",
        tools=[check_order],
        require_per_service_call_history_persistence=True,
    )

    workflow_instance = (
        HandoffBuilder(
            name="support_handoff",
            participants=[triage, order_specialist],
            termination_condition=lambda conversation: (
                bool(conversation) and "resolved" in conversation[-1].text.lower()
            ),
        )
        .with_start_agent(triage)
        .build()
    )

    result = await workflow_instance.run("Where is order 1234? Please check its status.")
    for output in result.get_outputs():
        if isinstance(output, AgentResponse):
            messages = output.messages
        elif isinstance(output, list):
            messages = [item for item in output if isinstance(item, Message)]
        else:
            continue
        for message in messages:
            if message.text:
                print(f"[{message.author_name or message.role}] {message.text}")

    print(f"Workflow state: {result.get_final_state()}")


if __name__ == "__main__":
    asyncio.run(main())

