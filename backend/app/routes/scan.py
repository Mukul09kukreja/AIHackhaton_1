from fastapi import APIRouter, HTTPException

from app.models.requests import FolderRequest
from app.models.responses import ScanResponse
from app.services.scan_service import scan_folder
from app.services.ai_service import heuristic_suggestions, generate_ai_suggestions
from app.services.state import last_scan

router = APIRouter(tags=["scan"])


@router.post('/scan-folder', response_model=ScanResponse)
def scan(payload: FolderRequest):
    try:
        data = scan_folder(payload.folder_path)
    except Exception as exc:
        raise HTTPException(status_code=400, detail=str(exc)) from exc
    suggestions, insights = heuristic_suggestions(data["files"])
    data["ai_suggestions"] = generate_ai_suggestions(data["files"], suggestions)
    data["insights"] = insights
    data["workspace_insights"] = {"mode": "local", "summary": "Using local AI insights", "workspace_health_score": 0, "suggestions": [], "cleanup_recommendations": [], "risks": [], "category_insights": []}
    last_scan.clear(); last_scan.update(data)
    return data
