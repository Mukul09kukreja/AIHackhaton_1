"""FastAPI app for Smart File Organizer + AI Suggestions."""
from __future__ import annotations

from pathlib import Path
from typing import Dict, Optional
import json

from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel

from app.services.organizer import FolderOrganizer
from app.services.ai_service import generate_ai_suggestions

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


@app.get("/")
def root() -> Dict:
    return {"message": "Smart File Organizer API running"}


@app.post("/scan-folder")
def scan_folder(payload: FolderRequest) -> Dict:
    global last_scan
    try:
        data = organizer.scan(payload.folder_path)
    except Exception as exc:
        raise HTTPException(status_code=400, detail=str(exc)) from exc
    suggestions, extra = organizer.heuristic_suggestions(data["files"])
    data["ai_suggestions"] = generate_ai_suggestions(data["files"], suggestions)
    data["insights"] = extra
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
        backup_file = history_file.with_name("history.backup.json")
        backup_file.write_text(json.dumps(moves, indent=2), encoding="utf-8")
        history_file.write_text(
            json.dumps(moves, indent=2),
            encoding="utf-8"
        )

    return {
        "message": "Files organized successfully",
        "moved": len(moves),
        "history": moves
    }


@app.post("/undo")
def undo_organize() -> Dict:
    if not history_file.exists():
        raise HTTPException(status_code=404, detail="No history file found")
    moves = json.loads(history_file.read_text(encoding="utf-8"))
    result = organizer.undo(moves)
    history_file.write_text("[]", encoding="utf-8")
    return {"message": "Undo completed", "restored": result["restored"], "failed": result["failed"]}


@app.get("/stats")
def stats() -> Dict:
    if not last_scan:
        raise HTTPException(status_code=400, detail="No scan data available")
    return last_scan["stats"]


@app.get("/ai-suggestions")
def ai_suggestions() -> Dict:
    if not last_scan:
        raise HTTPException(status_code=400, detail="No scan data available")
    return {"ai_suggestions": last_scan.get("ai_suggestions", []), "insights": last_scan.get("insights", {})}
