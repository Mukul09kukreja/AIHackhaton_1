from fastapi import APIRouter, HTTPException

from app.models.requests import FolderRequest
from app.services.state import state
from app.services.organize_service import organize_files
from app.services.undo_service import read_history, undo_moves, write_history

router = APIRouter(tags=["organize"])


@router.post('/organize')
def organize(payload: FolderRequest | None = None):
    with state.lock:
        if not state.last_scan:
            raise HTTPException(status_code=400, detail="Scan a folder first.")
        folder = payload.folder_path if payload else state.last_scan["folder"]
        scan_files = list(state.last_scan["files"])
    moves = organize_files(folder, scan_files)
    write_history(moves)
    return {"message": "Files organized successfully", "moved": len(moves), "history": moves}


@router.post('/undo')
def undo():
    moves = read_history()
    if not moves:
        raise HTTPException(status_code=404, detail="No history file found")
    restored, skipped, failed = undo_moves(moves)
    remaining = skipped + failed
    write_history(remaining)
    return {"message": "Undo completed", "restored": restored, "skipped": skipped, "failed": failed}
