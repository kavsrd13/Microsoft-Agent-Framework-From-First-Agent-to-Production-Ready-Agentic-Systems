"""Optional instructor demo: add a tiny MCP App view to a Python MCP server."""

import os
from pathlib import Path

from mcp.server.fastmcp import FastMCP


VIEW_URI = "ui://contoso-change-risk/risk-card.html"
RISK_RESULTS = {
    "CHG-1001": {"title": "Rotate a development certificate", "score": 0, "level": "low"},
    "CHG-1002": {"title": "Upgrade the customer portal database", "score": 3, "level": "medium"},
    "CHG-1003": {"title": "Emergency payment gateway patch", "score": 8, "level": "high"},
}

mcp = FastMCP(
    "Contoso Change Risk App",
    host=os.getenv("HOST", "0.0.0.0"),
    port=int(os.getenv("PORT", "8001")),
    streamable_http_path="/mcp",
    stateless_http=True,
    json_response=True,
)


@mcp.tool(meta={"ui": {"resourceUri": VIEW_URI}, "ui/resourceUri": VIEW_URI})
def show_change_risk(change_id: str) -> dict:
    """Show one fictional change risk result in a compact MCP App card."""

    result = RISK_RESULTS.get(change_id.upper())
    if result is None:
        raise ValueError(f"Unknown change ID. Use one of: {', '.join(RISK_RESULTS)}")
    return {"change_id": change_id.upper(), **result}


@mcp.resource(
    VIEW_URI,
    mime_type="text/html;profile=mcp-app",
    meta={"ui": {"csp": {"resourceDomains": ["https://esm.sh"]}}},
)
def risk_card() -> str:
    """Return the self-contained HTML view requested by an MCP Apps host."""

    return Path(__file__).with_name("mcp_app.html").read_text(encoding="utf-8")


if __name__ == "__main__":
    mcp.run(transport="streamable-http")
