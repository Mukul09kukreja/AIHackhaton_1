from fastapi import APIRouter, HTTPException
from app.services.state import state

router = APIRouter(tags=["ai"])


@router.get('/ai-suggestions')
def ai_suggestions():
    with state.lock:
        if not state.last_scan:
            raise HTTPException(status_code=400, detail="No scan data available")
        return {"ai_suggestions": state.last_scan.get("ai_suggestions", []), "insights": state.last_scan.get("insights", {})}
