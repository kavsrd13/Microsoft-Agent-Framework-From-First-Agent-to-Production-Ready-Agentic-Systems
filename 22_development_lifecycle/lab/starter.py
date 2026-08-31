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

    candidate_agent = Agent(
        client=client,
        instructions="TODO: Write improved instructions for the travel support agent.",
    )

    cases_path = Path(__file__).resolve().parents[1] / "evaluation_cases.json"
    cases = json.loads(cases_path.read_text(encoding="utf-8"))

    for case in cases:
        print(f"\nQUESTION: {case['question']}")
        print(await candidate_agent.run(case["question"]))
        print(f"REVIEW CRITERIA: {case['criteria']}")


if __name__ == "__main__":
    asyncio.run(main())
