from pathlib import Path
from datetime import datetime, timezone
from typing import Any, Dict, List
import shutil


def organize_files(folder: str, files: List[Dict[str, Any]]) -> List[Dict[str, Any]]:
    root = Path(folder)
    moves = []
    for item in files:
        source = Path(item["file_path"])
        if not source.exists():
            continue
        target_dir = root / item["category"]
        target_dir.mkdir(parents=True, exist_ok=True)
        target = target_dir / source.name
        i = 1
        while target.exists():
            target = target_dir / f"{source.stem}_{i}{source.suffix}"
            i += 1
        shutil.move(str(source), str(target))
        moves.append({"from": str(source), "to": str(target), "moved_at": datetime.now(timezone.utc).isoformat()})
    return moves
