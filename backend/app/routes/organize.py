from fastapi import APIRouter, HTTPException

from app.models.requests import FolderRequest
from app.services.state import last_scan
from app.services.organize_service import organize_files
from app.services.undo_service import read_history, undo_moves, write_history

router = APIRouter(tags=["organize"])


@router.post('/organize')
def organize(payload: FolderRequest | None = None):
    if not last_scan:
        raise HTTPException(status_code=400, detail="Scan a folder first.")
    folder = payload.folder_path if payload else last_scan["folder"]
    moves = organize_files(folder, last_scan["files"])
    write_history(moves)
    return {"message": "Files organized successfully", "moved": len(moves), "history": moves}


@router.post('/undo')
def undo():
    moves = read_history()
    if not moves:
        raise HTTPException(status_code=404, detail="No history file found")
    restored = undo_moves(moves)
    write_history([])
    return {"message": "Undo completed", "restored": restored}
