from fastapi import APIRouter, HTTPException
from app.services.state import state

router = APIRouter(tags=['ai'])


@router.get('/ai-suggestions')
def ai_suggestions():
    with state.lock:
        if not state.last_scan:
            raise HTTPException(status_code=400, detail='No scan data available')
        return state.last_scan.get(
            'workspace_insights',
            {
                'mode': 'local',
                'summary': 'Using local AI insights',
                'workspace_health_score': 0,
                'suggestions': [],
                'cleanup_recommendations': [],
                'risks': [],
                'category_insights': [],
            },
        )
