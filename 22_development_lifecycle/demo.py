import asyncio
import json
import os
from pathlib import Path

from agent_framework import Agent
from agent_framework.foundry import FoundryChatClient
from azure.identity import AzureCliCredential
from dotenv import load_dotenv

load_dotenv()


async def main():
    client = FoundryChatClient(
        project_endpoint=os.environ["FOUNDRY_PROJECT_ENDPOINT"],
        model=os.getenv("AZURE_AI_MODEL_DEPLOYMENT_NAME") or os.environ["FOUNDRY_MODEL"],
        credential=AzureCliCredential(),
    )

    baseline_agent = Agent(
        client=client,
        instructions="You are a helpful travel support agent.",
    )

    candidate_agent = Agent(
        client=client,
        instructions=(
            "You are a travel support agent. Give clear numbered steps. "
            "Do not invent policy details. If a policy is missing, say that a human agent must confirm it."
        ),
    )

    cases = json.loads(
        Path(__file__).with_name("evaluation_cases.json").read_text(encoding="utf-8")
    )

    for case in cases:
        print(f"\nQUESTION: {case['question']}")
        print("\nBASELINE")
        print(await baseline_agent.run(case["question"]))
        print("\nCANDIDATE")
        print(await candidate_agent.run(case["question"]))
        print(f"\nREVIEW CRITERIA: {case['criteria']}")


if __name__ == "__main__":
    asyncio.run(main())
