# Description report

## Updated description
Generate or update an ARCHITECTURE.md living document for a codebase. Use this skill whenever the user wants to create, refresh, restructure, or maintain an ARCHITECTURE.md file, document how their system is structured, capture the tech stack, deployment model, services, or data stores, or turn codebase findings into a durable architecture document for engineers or agents. Trigger on requests like "write an architecture doc," "document the system," "create/update ARCHITECTURE.md," "give me a technical overview of this repo," or "map out how this app is put together," even when the user does not name the file explicitly. Prefer this skill for file-producing architecture-documentation work, not for generic architecture advice, implementation planning, or diagram-only brainstorming unless those are clearly part of updating the document.

## Rationale
- Expanded realistic trigger phrasing beyond literal filename requests.
- Kept the description anchored on producing or maintaining a durable architecture artifact.
- Added architecture facets like services, deployment model, and data stores to improve matching.
- Strengthened negative boundaries against generic architecture discussion and planning-only requests.
