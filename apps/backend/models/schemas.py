from pydantic import BaseModel, Field
from typing import List, Optional

class ScanRequest(BaseModel):
    folders: List[str] = Field(default_factory=list)
    incremental: bool = True

class FileRecord(BaseModel):
    path: str
    name: str
    extension: str
    size_bytes: int
    category: str

class OperationPreview(BaseModel):
    operation_id: str
    moves: list[dict]
    warnings: list[str]

class CommitRequest(BaseModel):
    operation_id: str

class SearchRequest(BaseModel):
    query: str
    limit: int = 25

class InsightResponse(BaseModel):
    duplicate_waste_bytes: int
    screenshot_count: int
    large_unused_count: int
