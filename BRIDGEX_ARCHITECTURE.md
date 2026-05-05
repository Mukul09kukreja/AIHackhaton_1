# BridgeX Production Architecture

## Monorepo Layout
- `apps/desktop` — Tauri + React + TypeScript shell/UI
- `apps/backend` — FastAPI service with modular domain layers
- `apps/shared` — shared TypeScript contracts

## Backend Layers
- `api/routes`: thin HTTP routes
- `services`: organization, insights, search, monitoring orchestration
- `repositories`: persistence abstraction (SQLite now, PostgreSQL-ready)
- `database`: schema and migrations
- `ai`: embeddings, OCR, captioning, classifier pipelines
- `workers`: async/background jobs for scanning/indexing
- `indexing`: semantic/vector index adapters (Meilisearch/Tantivy)
- `utils`: safety guards and path validation

## Safety Model
1. Every mutation starts as preview.
2. Preview is committed as a transaction with operation id.
3. Rollback payload stored for undo.
4. Protected paths are hard-blocked.

## Scale Model
- Incremental scan queue
- Hash cache for duplicate detection
- Batched embedding generation
- background workers to avoid UI blocking

## Deployment
- Backend containerized (FastAPI + SQLite volume, PostgreSQL-ready DSN)
- Desktop packaged through Tauri for Windows first
