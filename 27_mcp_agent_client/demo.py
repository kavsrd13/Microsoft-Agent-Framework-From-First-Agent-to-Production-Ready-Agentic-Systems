"""Use a deployed Streamable HTTP MCP server from an Agent Framework agent."""

import asyncio
import os

from agent_framework import Agent, MCPStreamableHTTPTool
from agent_framework.openai import OpenAIChatClient
from dotenv import load_dotenv

load_dotenv()


async def main() -> None:
    api_key = os.environ["MCP_API_KEY"]

    client = OpenAIChatClient(
        base_url=os.environ["AZURE_OPENAI_ENDPOINT"],
        api_key=os.environ["AZURE_OPENAI_API_KEY"],
        model=os.environ["AZURE_OPENAI_DEPLOYMENT"],
    )

    async with (
        MCPStreamableHTTPTool(
            name=os.environ["MCP_SERVER_NAME"],
            url=os.environ["MCP_SERVER_URL"],
            header_provider=lambda _context: {"X-API-Key": api_key},
            load_prompts=False,
            allowed_tools=["get_change_record", "assess_change_risk"],
        ) as mcp_server,
        Agent(
            client=client,
            name="ChangeReviewAgent",
            instructions=(
                "Use the MCP tools for change facts and risk. "
                "Do not invent records or claim that a change was executed."
            ),
        ) as agent,
    ):
        result = await agent.run(
            "Review CHG-1003. State its title, risk level, score, and one reason for caution.",
            tools=mcp_server,
        )
        print(result.text)


if __name__ == "__main__":
    asyncio.run(main())
