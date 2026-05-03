from typing import Any, Dict
from app.services.state import last_scan


def get_stats() -> Dict[str, Any]:
    return last_scan.get("stats", {})
