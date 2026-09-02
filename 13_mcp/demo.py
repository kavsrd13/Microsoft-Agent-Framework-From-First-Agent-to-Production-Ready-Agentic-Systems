"""A small Streamable HTTP MCP server for the classroom."""

import json
import os

from mcp.server.fastmcp import FastMCP


CHANGES = {
    "CHG-1001": {
        "title": "Rotate a development certificate",
        "change_type": "standard",
        "downtime_minutes": 0,
        "rollback_plan": True,
    },
    "CHG-1002": {
        "title": "Upgrade the customer portal database",
        "change_type": "normal",
        "downtime_minutes": 30,
        "rollback_plan": True,
    },
    "CHG-1003": {
        "title": "Emergency payment gateway patch",
        "change_type": "emergency",
        "downtime_minutes": 90,
        "rollback_plan": False,
    },
}

mcp = FastMCP(
    "Contoso Change Risk",
    instructions="Use only the fictional Contoso change records in this server.",
    host=os.getenv("HOST", "0.0.0.0"),
    port=int(os.getenv("PORT", "8000")),
    streamable_http_path="/mcp",
    stateless_http=True,
    json_response=True,
)


def required_change(change_id: str) -> dict:
    """Return one known classroom record or a clear tool error."""

    change = CHANGES.get(change_id.upper())
    if change is None:
        raise ValueError(f"Unknown change ID. Use one of: {', '.join(CHANGES)}")
    return change


@mcp.tool()
def get_change_record(change_id: str) -> dict:
    """Get one fictional change record, for example CHG-1003."""

    return {"change_id": change_id.upper(), **required_change(change_id)}


@mcp.tool()
def assess_change_risk(change_id: str) -> dict:
    """Calculate a deterministic low, medium, or high risk rating."""

    change = required_change(change_id)
    score = {"standard": 0, "normal": 2, "emergency": 3}[change["change_type"]]
    score += change["downtime_minutes"] // 30
    if not change["rollback_plan"]:
        score += 2
    level = "high" if score >= 5 else "medium" if score >= 2 else "low"
    return {"change_id": change_id.upper(), "score": score, "level": level}


@mcp.resource("change://catalog")
def change_catalog() -> str:
    """List the fictional change IDs available in this server."""

    items = [{"change_id": key, "title": value["title"]} for key, value in CHANGES.items()]
    return json.dumps({"changes": items}, indent=2)


@mcp.prompt(name="change-readiness-review")
def change_readiness_review(change_id: str) -> str:
    """Return a reusable instruction for reviewing one change."""

    return (
        f"Review {change_id}. First call get_change_record, then assess_change_risk. "
        "Explain the result using only tool output and do not claim the change was executed."
    )


if __name__ == "__main__":
    mcp.run(transport="streamable-http")
