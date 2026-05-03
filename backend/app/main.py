"""FastAPI app for Smart File Organizer + AI Suggestions."""
from __future__ import annotations

from pathlib import Path
from typing import Dict, List, Optional
import json

from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel

from app.services.organizer import FolderOrganizer
from app.services.ai_service import generate_ai_suggestions
from app.services.openai_service import generate_workspace_insights

app = FastAPI(title="Smart File Organizer API", version="1.0.0")
organizer = FolderOrganizer()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

history_file = Path(__file__).resolve().parent / "history.json"
last_scan: Dict = {}


class FolderRequest(BaseModel):
    folder_path: str
    ai_assisted: bool = False


@app.get("/")
def root() -> Dict:
    return {"message": "Smart File Organizer API running"}


@app.post("/scan-folder")
async def scan_folder(payload: FolderRequest) -> Dict:
    global last_scan
    try:
        data = organizer.scan(payload.folder_path)
    except Exception as exc:
        raise HTTPException(status_code=400, detail=str(exc)) from exc
    suggestions, extra = organizer.heuristic_suggestions(data["files"])
    data["ai_suggestions"] = generate_ai_suggestions(data["files"], suggestions)
    data["insights"] = extra
    ai_insights = await generate_workspace_insights(data["files"], payload.ai_assisted)
    data["workspace_insights"] = ai_insights
    last_scan = data
    return data


@app.post("/organize")
def organize_files(payload: Optional[FolderRequest] = None, dry_run: bool = False) -> Dict:
    if not last_scan:
        raise HTTPException(status_code=400, detail="Scan a folder first.")

    folder = payload.folder_path if payload else last_scan["folder"]

    if dry_run:
        moves = organizer.organize(folder, [])
        return {"message": "Dry run complete", "moved": 0, "history": moves, "dry_run": True}

    moves = organizer.organize(folder, last_scan["files"])

    if moves:
        prior = _load_history()
        updated_history = prior + moves
        backup_file = history_file.with_name("history.backup.json")
        backup_file.write_text(json.dumps(updated_history, indent=2), encoding="utf-8")
        _save_history(updated_history)

    return {
        "message": "Files organized successfully",
        "moved": len(moves),
        "history": moves
    }


@app.post("/undo")
def undo_organize() -> Dict:
    if not history_file.exists():
        raise HTTPException(status_code=404, detail="No history file found")
    moves = _load_history()
    if not moves:
        raise HTTPException(status_code=404, detail="No move history available")
    result = organizer.undo(moves)
    _save_history([])
    return {"message": "Undo completed", "restored": result["restored"], "skipped": result["skipped"], "failed": result["failed"]}


@app.get("/stats")
def stats() -> Dict:
    if not last_scan:
        raise HTTPException(status_code=400, detail="No scan data available")
    return last_scan["stats"]


@app.get("/ai-suggestions")
def ai_suggestions() -> Dict:
    if not last_scan:
        raise HTTPException(status_code=400, detail="No scan data available")
    return last_scan.get("workspace_insights", {"mode": "local", "summary": "Using local AI insights", "workspace_health_score": 0, "suggestions": [], "cleanup_recommendations": [], "risks": [], "category_insights": []})
def _load_history() -> List[Dict]:
    if not history_file.exists():
        return []
    try:
        loaded = json.loads(history_file.read_text(encoding="utf-8"))
        return loaded if isinstance(loaded, list) else []
    except (json.JSONDecodeError, OSError):
        return []


def _save_history(moves: List[Dict]) -> None:
    history_file.parent.mkdir(parents=True, exist_ok=True)
    history_file.write_text(json.dumps(moves, indent=2), encoding="utf-8")
