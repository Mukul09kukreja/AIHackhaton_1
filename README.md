# BridgeX

BridgeX is a production-oriented AI-powered desktop file workspace focused on safe automation, semantic discovery, and trusted organization.

## Stack
- Desktop: Tauri + React + TypeScript + Tailwind + Framer Motion + Zustand
- Backend: FastAPI + Python + SQLite (PostgreSQL-ready repository architecture)
- AI: OpenAI-ready pipeline (embeddings/OCR/captioning stubs), semantic search adapters

## Repository Structure
```
apps/
  desktop/
  backend/
  shared/
```

See `BRIDGEX_ARCHITECTURE.md` for the full system design.

## Backend Run
```bash
python -m venv .venv
source .venv/bin/activate
pip install fastapi uvicorn pydantic
uvicorn apps.backend.main:app --reload --port 8000
```

## Desktop Run (scaffold)
```bash
cd apps/desktop
npm install
npm run dev
```

## Core Safety Guarantees
- preview before action
- transactional commit model
- rollback-ready operation payloads
- protected folder blocking

## Next Implementation Milestones
1. Wire real file scanner and watchdog worker.
2. Add repository implementations and migrations.
3. Connect OpenAI embeddings and OCR/captioning pipeline.
4. Implement duplicate vault and restore flows.
5. Ship polished multi-pane UX and command palette.
