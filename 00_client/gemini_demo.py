import asyncio
import os
from pathlib import Path
from agent_framework import Agent
from agent_framework.gemini import GeminiChatClient
from dotenv import load_dotenv

# Use the shared project .env, regardless of the terminal's current folder.
load_dotenv(Path(__file__).resolve().parents[1] / ".env")


async def main() -> None:
    # Explicit settings make the Gemini model and authentication method visible in class.
    client = GeminiChatClient(
        api_key=os.environ["GEMINI_API_KEY"],
        model=os.environ["GEMINI_MODEL"],
    )

    agent = Agent(
        client=client,
        name="GeminiClientDemoAgent",
        instructions="You are a helpful assistant. Answer in one short sentence.",
    )

    print(f"Calling Gemini model: {os.environ['GEMINI_MODEL']}...", flush=True)
    # Report a timeout instead of waiting indefinitely for the API.
    result = await asyncio.wait_for(
        agent.run("tell me something about Transformer models"), timeout=60
    )
    print(f"Gemini: {result.text}", flush=True)


if __name__ == "__main__":
    asyncio.run(main())
