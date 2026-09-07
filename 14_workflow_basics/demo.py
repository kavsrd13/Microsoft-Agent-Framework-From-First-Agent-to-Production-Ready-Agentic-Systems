import asyncio
import os

from agent_framework import Agent, step, workflow
from agent_framework.openai import OpenAIChatClient
from dotenv import load_dotenv

load_dotenv()

client = OpenAIChatClient(
    base_url=os.environ["AZURE_OPENAI_ENDPOINT"],
    api_key=os.environ["AZURE_OPENAI_API_KEY"],
    model=os.environ["AZURE_OPENAI_DEPLOYMENT"],
)

classifier = Agent(
    client=client,
    name="ClassifierAgent",
    instructions="Classify the document as Technical, Legal, Marketing, or Scientific. Return only the category.",
)
summarizer = Agent(
    client=client,
    name="SummarizerAgent",
    instructions="Summarize the supplied document in one sentence.",
)


@step
async def classify_document(document: str) -> str:
    return (await classifier.run(document)).text


@step
async def summarize_document(document: str) -> str:
    return (await summarizer.run(document)).text


@workflow
async def document_pipeline(document: str) -> str:
    category = await classify_document(document)
    summary = await summarize_document(document)
    return f"Category: {category}\nSummary: {summary}"


async def main() -> None:
    workflow_instance = document_pipeline.build()
    result = await workflow_instance.run(
        "Microsoft Agent Framework coordinates model clients, tools, sessions, and workflows."
    )
    print(result.get_outputs()[0])


if __name__ == "__main__":
    asyncio.run(main())
