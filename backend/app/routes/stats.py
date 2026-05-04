from fastapi import APIRouter, HTTPException
from app.services.state import state

router = APIRouter(tags=["stats"])


@router.get('/stats')
def stats():
    with state.lock:
        if not state.last_scan:
            raise HTTPException(status_code=400, detail="No scan data available")
        return state.last_scan["stats"]
