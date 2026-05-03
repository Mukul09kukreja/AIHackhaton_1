from fastapi import APIRouter, HTTPException
from app.services.state import last_scan

router = APIRouter(tags=["ai"])


@router.get('/ai-suggestions')
def ai_suggestions():
    if not last_scan:
        raise HTTPException(status_code=400, detail="No scan data available")
    return {"ai_suggestions": last_scan.get("ai_suggestions", []), "insights": last_scan.get("insights", {})}
