"""Create a Prompt Agent in Foundry, then run it with Agent Framework.

Source: https://learn.microsoft.com/agent-framework/integrations/by-component/agent-services/foundry
Creation: https://learn.microsoft.com/azure/foundry/agents/quickstarts/prompt-agent
"""
import asyncio
import os
import sys
from pathlib import Path

from agent_framework.foundry import FoundryAgent
from azure.ai.projects import AIProjectClient
from azure.ai.projects.models import PromptAgentDefinition
from azure.identity import AzureCliCredential
from dotenv import load_dotenv

load_dotenv(Path(__file__).resolve().parents[1] / ".env")
sys.stdout.reconfigure(encoding="utf-8")


async def main() -> None:
    endpoint = os.environ["FOUNDRY_PROJECT_ENDPOINT"]
    credential = AzureCliCredential()

    # 1. Save the model and instructions as an agent in the Foundry project.
    # Each execution creates a new version under the same agent name.
    with AIProjectClient(endpoint=endpoint, credential=credential) as project:
        created = project.agents.create_version(
            agent_name="agent-framework-agent",
            definition=PromptAgentDefinition(
                model=os.environ["FOUNDRY_MODEL"],
                instructions="You are a friendly assistant. Answer briefly.",
            ),
        )
    print(f"Created in Foundry: {created.name}, version {created.version}", flush=True)

    # 2. Connect Agent Framework to the exact version we just created.
    agent = FoundryAgent(
        project_endpoint=endpoint,
        agent_name=created.name,
        agent_version=created.version,
        credential=credential,
    )

    # 3. Use the standard Agent Framework run API.
    result = await agent.run("In one sentence, what can you help me with?")
    print(f"Agent: {result.text}")


if __name__ == "__main__":
    asyncio.run(main())
