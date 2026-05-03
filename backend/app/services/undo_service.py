from pathlib import Path
from typing import Dict, List
import shutil
import json

HISTORY_PATH = Path(__file__).resolve().parent.parent / "data" / "history.json"


def write_history(moves: List[Dict]) -> None:
    HISTORY_PATH.write_text(json.dumps(moves, indent=2), encoding="utf-8")


def read_history() -> List[Dict]:
    if not HISTORY_PATH.exists():
        return []
    return json.loads(HISTORY_PATH.read_text(encoding="utf-8"))


def undo_moves(moves: List[Dict]) -> int:
    restored = 0
    for move in reversed(moves):
        src = Path(move["to"])
        dst = Path(move["from"])
        if src.exists():
            dst.parent.mkdir(parents=True, exist_ok=True)
            shutil.move(str(src), str(dst))
            restored += 1
    return restored
