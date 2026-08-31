import os

from agent_framework import Agent
from agent_framework.foundry import FoundryChatClient, ResponsesHostServer
from azure.ai.agentserver.optimization import load_config
from azure.identity import DefaultAzureCredential
from dotenv import load_dotenv

load_dotenv()


def main():
    config = load_config()

    client = FoundryChatClient(
        project_endpoint=os.environ["FOUNDRY_PROJECT_ENDPOINT"],
        model=config.model,
        credential=DefaultAzureCredential(),
    )

    agent = Agent(
        client=client,
        instructions=config.compose_instructions(),
        default_options={"store": False},
    )

    ResponsesHostServer(agent).run()


if __name__ == "__main__":
    main()
