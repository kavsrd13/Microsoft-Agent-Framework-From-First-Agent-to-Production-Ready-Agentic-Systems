import os

from agent_framework import Agent
from agent_framework.foundry import FoundryChatClient, ResponsesHostServer
from azure.identity import DefaultAzureCredential
from azure.storage.blob import BlobClient
from dotenv import load_dotenv

load_dotenv()
credential = DefaultAzureCredential()


def read_travel_policy() -> str:
    # TODO: Create BlobClient with credential=credential and return the Blob text.
    return ""


def main():
    client = FoundryChatClient(
        project_endpoint=os.environ["FOUNDRY_PROJECT_ENDPOINT"],
        model=os.getenv("AZURE_AI_MODEL_DEPLOYMENT_NAME") or os.environ["FOUNDRY_MODEL"],
        credential=credential,
    )

    agent = Agent(
        client=client,
        instructions="Call read_travel_policy before answering a policy question.",
        tools=[read_travel_policy],
        default_options={"store": False},
    )

    ResponsesHostServer(agent).run()


if __name__ == "__main__":
    main()
