from pathlib import Path
from collections import Counter
from typing import Any, Dict, List

from app.utils.validators import validate_folder
from app.utils.file_helpers import categorize_extension, datetime_to_iso, human_size
from app.utils.tree_builder import build_tree


def build_stats(files: List[Dict[str, Any]]) -> Dict[str, Any]:
    counter = Counter(f["category"] for f in files)
    total_size = sum(f["size"] for f in files)
    largest = sorted(files, key=lambda x: x["size"], reverse=True)[:5]
    return {
        "total_files": len(files),
        "total_size": total_size,
        "total_size_human": human_size(total_size),
        "category_distribution": dict(counter),
        "largest_files": largest,
    }


def predict_after_tree(root: Path, files: List[Dict[str, Any]]) -> Dict[str, Any]:
    categorized = [root / f["category"] / Path(f["file_path"]).name for f in files]
    return build_tree(categorized, root)


def scan_folder(folder_path: str) -> Dict[str, Any]:
    root = validate_folder(folder_path)
    files: List[Dict[str, Any]] = []
    paths: List[Path] = []

    for file_path in root.rglob('*'):
        if not file_path.is_file():
            continue
        stat = file_path.stat()
        category = categorize_extension(file_path.suffix)
        paths.append(file_path)
        files.append({
            "filename": file_path.name,
            "extension": file_path.suffix.lower() or "",
            "size": stat.st_size,
            "size_human": human_size(stat.st_size),
            "created_date": datetime_to_iso(stat.st_ctime),
            "modified_date": datetime_to_iso(stat.st_mtime),
            "file_path": str(file_path),
            "category": category,
        })

    return {
        "folder": str(root),
        "files": files,
        "stats": build_stats(files),
        "before_tree": build_tree(paths, root),
        "after_tree": predict_after_tree(root, files),
    }
