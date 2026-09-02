# Participant HTML lab workbook

Open [index.html](index.html) in a browser. It links all 26 labs in the recommended course sequence. Displayed lab numbers follow this sequence; source-folder numbers remain stable identifiers. The original client, first-agent, and streaming exercises are combined into Lab 00.

Each page is self-contained for classroom delivery and repeats the required readiness steps: create and activate `venv`, install the pinned libraries, configure `.env`, run `az login`, create or verify topic-specific resources, build code in small modules, run the scenario, validate the output, and complete the knowledge check.

## Regenerate the pages

The generated pages are derived from the current Python/YAML/HTML sources in the repository. After changing a source lab or the lab metadata, run from the repository root:

```powershell
node .\html_labs\generate_labs.mjs
```

The generator also verifies page counts, setup coverage, question counts, local links, and common secret patterns.
