import os

from agent_framework import Agent
from agent_framework.foundry import FoundryChatClient, ResponsesHostServer
from azure.identity import DefaultAzureCredential
from azure.storage.blob import BlobClient
from dotenv import load_dotenv

load_dotenv()

def main():
    credential = DefaultAzureCredential()

    def read_travel_policy() -> str:
        """Read the travel policy with the current Entra identity."""
        blob = BlobClient(
            account_url=os.environ["AZURE_STORAGE_ACCOUNT_URL"],
            container_name=os.environ["AZURE_STORAGE_CONTAINER_NAME"],
            blob_name=os.environ["AZURE_STORAGE_BLOB_NAME"],
            credential=credential,
        )
        return blob.download_blob().readall().decode("utf-8")

    client = FoundryChatClient(
        project_endpoint=os.environ["FOUNDRY_PROJECT_ENDPOINT"],
        model=os.getenv("AZURE_AI_MODEL_DEPLOYMENT_NAME") or os.environ["FOUNDRY_MODEL"],
        credential=credential,
    )

    agent = Agent(
        client=client,
        instructions=(
            "Answer questions about the company travel policy. "
            "Call read_travel_policy before answering. "
            "If the policy does not contain the answer, say that a human must confirm it."
        ),
        tools=[read_travel_policy],
        default_options={"store": False},
    )

    ResponsesHostServer(agent).run()


if __name__ == "__main__":
    main()
