import asyncio
import os

from agent_framework import Agent, LocalEvaluator, evaluate_agent, evaluator, keyword_check
from agent_framework.foundry import FoundryChatClient
from azure.identity import AzureCliCredential
from dotenv import load_dotenv

load_dotenv()


@evaluator
def is_helpful(response: str) -> bool:
    """Require a meaningful response that is not a simple refusal."""
    refusals = ["i can't", "i'm not able", "i don't know"]
    return len(response) > 10 and not any(item in response.lower() for item in refusals)


async def main() -> None:
    agent = Agent(
        client=FoundryChatClient(
            project_endpoint=os.environ["FOUNDRY_PROJECT_ENDPOINT"],
            model=os.environ["FOUNDRY_MODEL"],
            credential=AzureCliCredential(),
        ),
        name="WeatherAssistant",
        instructions="You are a helpful weather assistant.",
    )

    evaluator_set = LocalEvaluator(keyword_check("weather"), is_helpful)
    results = await evaluate_agent(
        agent=agent,
        queries=[
            "What should I wear in hot weather?",
            "Explain why weather forecasts can change.",
        ],
        evaluators=evaluator_set,
    )

    for result in results:
        print(f"{result.provider}: {result.passed}/{result.total} checks passed")
        for item in result.items:
            for score in item.scores:
                print(f"  {'PASS' if score.passed else 'FAIL'} {score.name}")


if __name__ == "__main__":
    asyncio.run(main())

