from fastapi import APIRouter
from apps.backend.models.schemas import ScanRequest, OperationPreview, CommitRequest, SearchRequest, InsightResponse
from apps.backend.services.operations_service import operations_service
from apps.backend.services.search_service import semantic_search_service
from apps.backend.services.insights_service import insights_service

router = APIRouter(prefix='/api/v1', tags=['bridgex'])

@router.get('/health')
def health():
    return {'status': 'ok', 'product': 'BridgeX'}

@router.post('/scan')
def scan(payload: ScanRequest):
    return {'folders': payload.folders, 'incremental': payload.incremental, 'status': 'queued'}

@router.post('/organize/preview', response_model=OperationPreview)
def preview():
    sample = [{"path": "Downloads/IMG_9282.png", "category": "Screenshots"}]
    return operations_service.preview_organization(sample)

@router.post('/organize/commit')
def commit(payload: CommitRequest):
    return operations_service.commit_operation(payload.operation_id)

@router.post('/search')
def search(payload: SearchRequest):
    return {'results': semantic_search_service.search(payload.query, payload.limit)}

@router.get('/insights', response_model=InsightResponse)
def insights():
    return insights_service.summarize()
