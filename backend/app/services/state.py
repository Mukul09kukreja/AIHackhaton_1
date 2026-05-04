"""In-memory app state for last scan result."""
from threading import Lock
from typing import Any, Dict


class AppState:
    def __init__(self) -> None:
        self.lock = Lock()
        self.last_scan: Dict[str, Any] = {}


state = AppState()
