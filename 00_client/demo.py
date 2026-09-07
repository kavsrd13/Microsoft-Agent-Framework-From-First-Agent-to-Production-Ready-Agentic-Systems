import asyncio
import os


from agent_framework.openai import OpenAIChatClient
from dotenv import load_dotenv

load_dotenv()


async def main() -> None:
    # Use the Azure OpenAI v1 endpoint and resource key supplied for the class.
    client = OpenAIChatClient(
        base_url=os.environ["AZURE_OPENAI_ENDPOINT"],
        api_key=os.environ["AZURE_OPENAI_API_KEY"],
        model=os.environ["AZURE_OPENAI_DEPLOYMENT"],
    )

    # Every supported chat client can create the standard Agent abstraction.
    agent = client.as_agent(
        name="ClientDemoAgent",
        instructions="You are a helpful assistant. Answer in one short sentence.",
    )
    result = await agent.run("What is Microsoft Agent Framework?")
    print(result.text)


if __name__ == "__main__":
    asyncio.run(main())
