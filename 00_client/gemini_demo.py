import asyncio
import os
from agent_framework import Agent
from agent_framework.gemini import GeminiChatClient
from dotenv import load_dotenv
from google import genai

load_dotenv()


async def main() -> None:
    api_key = os.environ.get("GEMINI_API_KEY")
    if not api_key:
        raise RuntimeError("Add GEMINI_API_KEY to the project .env file before running this demo.")


    # Explicit settings make the Gemini model and authentication method visible in class.
    client = GeminiChatClient(
        api_key=api_key,
        model=os.environ.get("GEMINI_MODEL"),
    )

    agent = Agent(
        client=client,
        name="GeminiClientDemoAgent",
        instructions="You are a helpful assistant. Answer in one short sentence.",
    )

    result = await agent.run("What is Microsoft Agent Framework?")
    print(result.text)


if __name__ == "__main__":
    asyncio.run(main())
