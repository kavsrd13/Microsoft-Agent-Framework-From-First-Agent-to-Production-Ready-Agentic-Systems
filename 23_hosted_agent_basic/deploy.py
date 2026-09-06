"""Upload this lab to Foundry. Run locally after az login.
Source: https://learn.microsoft.com/azure/foundry/agents/quickstarts/quickstart-hosted-agent
"""
import io
import os
import time
import zipfile
from pathlib import Path

from azure.ai.projects import AIProjectClient
from azure.ai.projects.models import (
    AgentEndpointConfig, CodeConfiguration, CodeDependencyResolution,
    FixedRatioVersionSelectionRule, HostedAgentDefinition, ProtocolConfiguration,
    ProtocolVersionRecord, ResponsesProtocolConfiguration, VersionSelector,
)
from azure.identity import AzureCliCredential
from dotenv import load_dotenv

folder = Path(__file__).resolve().parent
load_dotenv(folder.parent / ".env")
agent_name = "travel-policy-hosted-agent"
endpoint = os.environ["FOUNDRY_PROJECT_ENDPOINT"]

# Pass only these settings to Azure. Never upload the local .env file.
settings = {
    "FOUNDRY_PROJECT_ENDPOINT": endpoint,
    "FOUNDRY_MODEL": os.environ["FOUNDRY_MODEL"],
}

# Package exactly the runtime code and dependencies.
package = io.BytesIO()
package.name = f"{agent_name}.zip"  # Foundry requires a .zip upload filename.
with zipfile.ZipFile(package, "w", zipfile.ZIP_DEFLATED) as archive:
    for filename in ("main.py", "requirements.txt"):
        archive.write(folder / filename, filename)
package.seek(0)

with AzureCliCredential() as credential, AIProjectClient(
    endpoint=endpoint, credential=credential
) as project:
    version = project.agents.create_version_from_code(
        agent_name=agent_name,
        definition=HostedAgentDefinition(
            cpu="0.5",
            memory="1Gi",
            code_configuration=CodeConfiguration(
                runtime="python_3_13",
                entry_point=["python", "main.py"],
                dependency_resolution=CodeDependencyResolution.REMOTE_BUILD,
            ),
            environment_variables=settings,
            protocol_versions=[
                ProtocolVersionRecord(protocol="responses", version="2.0.0")
            ],
        ),
        code=package,
    )
    print(f"Created {agent_name}, version {version.version}", flush=True)

    # Keep a bounded wait so failures do not leave the lesson hanging.
    for attempt in range(60):
        details = project.agents.get_version(
            agent_name=agent_name, agent_version=version.version
        )
        print(f"Provisioning: {details['status']}", flush=True)
        if details["status"] == "active":
            break
        if details["status"] == "failed":
            raise RuntimeError("Provisioning failed. Inspect this version in Foundry.")
        time.sleep(10)
    else:
        raise TimeoutError("Provisioning is still pending. Inspect the version in Foundry.")

    # Keep this version deployed and route the demo endpoint to it.
    project.agents.update_details(
        agent_name=agent_name,
        agent_endpoint=AgentEndpointConfig(
            version_selector=VersionSelector(version_selection_rules=[
                FixedRatioVersionSelectionRule(
                    agent_version=version.version, traffic_percentage=100
                )
            ]),
            protocol_configuration=ProtocolConfiguration(
                responses=ResponsesProtocolConfiguration()
            ),
        ),
    )
    print(f"Endpoint: {endpoint}/agents/{agent_name}/endpoint/protocols/openai/responses")
    print("Next: python invoke.py")
