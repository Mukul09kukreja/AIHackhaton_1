from pathlib import Path
from datetime import datetime, timezone
from typing import Any, Dict, List
import shutil


def get_safe_filename(destination: Path) -> Path:
    if not destination.exists():
        return destination

    counter = 1
    while True:
        candidate = destination.with_stem(f"{destination.stem}({counter})")
        if not candidate.exists():
            return candidate
        counter += 1


def organize_files(folder: str, files: List[Dict[str, Any]]) -> List[Dict[str, Any]]:
    root = Path(folder)
    moves = []
    for item in files:
        source = Path(item['file_path'])
        if not source.exists():
            continue
        target_dir = root / item['category']
        target_dir.mkdir(parents=True, exist_ok=True)
        target = get_safe_filename(target_dir / source.name)
        try:
            shutil.move(str(source), str(target))
            moves.append({'from': str(source), 'to': str(target), 'moved_at': datetime.now(timezone.utc).isoformat()})
        except PermissionError:
            continue
        except Exception:
            continue
    return moves
