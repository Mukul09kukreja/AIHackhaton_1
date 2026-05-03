from pydantic import BaseModel
from typing import Any, Dict, List


class GenericMessageResponse(BaseModel):
    message: str


class ScanResponse(BaseModel):
    folder: str
    files: List[Dict[str, Any]]
    stats: Dict[str, Any]
    before_tree: Dict[str, Any]
    after_tree: Dict[str, Any]
    ai_suggestions: List[Dict[str, Any]]
    insights: Dict[str, Any]
