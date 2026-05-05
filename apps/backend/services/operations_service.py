import uuid
from datetime import datetime, timezone

class OperationsService:
    def preview_organization(self, files: list[dict]) -> dict:
        moves = []
        for f in files:
            moves.append({"from": f["path"], "to_category": f.get("category", "Others")})
        return {
            "operation_id": str(uuid.uuid4()),
            "moves": moves,
            "warnings": ["Preview only. No files changed until commit."]
        }

    def commit_operation(self, operation_id: str) -> dict:
        return {
            "operation_id": operation_id,
            "status": "committed",
            "committed_at": datetime.now(timezone.utc).isoformat()
        }

operations_service = OperationsService()
