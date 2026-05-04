from fastapi import APIRouter, HTTPException

from app.models.requests import FolderRequest
from app.services.state import state
from app.services.organize_service import organize_files
from app.services.undo_service import read_history, undo_moves, write_history

router = APIRouter(tags=['organize'])


@router.post('/organize')
def organize(payload: FolderRequest | None = None, dry_run: bool = False):
    with state.lock:
        if not state.last_scan:
            raise HTTPException(status_code=400, detail='Scan a folder first.')
        folder = payload.folder_path if payload else state.last_scan['folder']
        scan_files = list(state.last_scan['files'])

    if dry_run:
        planned_moves = organize_files(folder, scan_files, dry_run=True)
        return {'message': 'Dry run complete', 'moved': 0, 'history': planned_moves, 'dry_run': True}

    moves = organize_files(folder, scan_files, dry_run=False)
    write_history(moves)
    return {'message': 'Files organized successfully', 'moved': len(moves), 'history': moves}


@router.post('/undo')
def undo():
    moves = read_history()
    if not moves:
        raise HTTPException(status_code=404, detail='No history file found')
    restored, skipped, failed = undo_moves(moves)
    write_history(skipped + failed)
    return {'message': 'Undo completed', 'restored': restored, 'skipped': skipped, 'failed': failed}
