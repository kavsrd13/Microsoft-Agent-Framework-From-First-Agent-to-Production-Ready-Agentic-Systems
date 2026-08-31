import asyncio
import os

from agent_framework import Agent, MCPStreamableHTTPTool
from agent_framework.foundry import FoundryChatClient
from azure.identity import AzureCliCredential
from dotenv import load_dotenv

load_dotenv()


async def main() -> None:
    agent = Agent(
        client=FoundryChatClient(
            project_endpoint=os.environ["FOUNDRY_PROJECT_ENDPOINT"],
            model=os.environ["FOUNDRY_MODEL"],
            credential=AzureCliCredential(),
        ),
        name="DocsAgent",
        instructions="Use the MCP tools when they help answer Microsoft documentation questions.",
    )

    async with MCPStreamableHTTPTool(
        name=os.environ.get("MCP_NAME", "Microsoft Learn MCP"),
        url=os.environ.get("MCP_URL", "https://learn.microsoft.com/api/mcp"),
    ) as mcp_tool:
        result = await agent.run("How do I create an Azure storage account with Azure CLI?", tools=mcp_tool)
        print(result.text)


if __name__ == "__main__":
    asyncio.run(main())

