from fastapi import APIRouter, HTTPException
from app.services.state import last_scan

router = APIRouter(tags=["stats"])


@router.get('/stats')
def stats():
    if not last_scan:
        raise HTTPException(status_code=400, detail="No scan data available")
    return last_scan["stats"]
