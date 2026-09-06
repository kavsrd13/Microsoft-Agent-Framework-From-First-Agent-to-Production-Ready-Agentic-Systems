"""Call the deployed Foundry agent; the local server is not needed."""
import os
import sys
from pathlib import Path

from azure.ai.projects import AIProjectClient
from azure.identity import AzureCliCredential
from dotenv import load_dotenv

load_dotenv(Path(__file__).resolve().parents[1] / ".env")
sys.stdout.reconfigure(encoding="utf-8")  # Display model text in Windows terminals.

with AzureCliCredential() as credential, AIProjectClient(
    endpoint=os.environ["FOUNDRY_PROJECT_ENDPOINT"], credential=credential
) as project:
    with project.get_openai_client(agent_name="travel-policy-identity-agent") as client:
        response = client.responses.create(
            input="What is the hotel reimbursement limit?"
        )
        print(response.output_text)
