from datetime import datetime, timezone, timedelta
from collections import defaultdict
from typing import Any, Dict, List, Tuple
from pathlib import Path

from app.utils.hashing import file_hash


def detect_duplicates(files: List[Dict[str, Any]]) -> List[List[str]]:
    hashes = defaultdict(list)
    for f in files:
        path = Path(f["file_path"])
        try:
            hashes[file_hash(path)].append(str(path))
        except OSError:
            continue
    return [v for v in hashes.values() if len(v) > 1]


def _clutter_score(total_files: int, duplicate_count: int, old_count: int, screenshot_count: int, large_count: int) -> int:
    if total_files <= 0:
        return 0
    ratio = (
        (duplicate_count / total_files) * 40
        + (old_count / total_files) * 25
        + (screenshot_count / total_files) * 20
        + (large_count / total_files) * 15
    )
    return min(100, max(0, round(ratio * 100)))


def heuristic_suggestions(files: List[Dict[str, Any]]) -> Tuple[List[Dict[str, Any]], Dict[str, Any]]:
    now = datetime.now(timezone.utc)
    duplicates = detect_duplicates(files)
    duplicate_count = sum(len(group) for group in duplicates)
    large_files = [f for f in files if f["size"] > 500 * 1024 * 1024]
    screenshots = [f for f in files if "screenshot" in f["filename"].lower()]
    old_files = [f for f in files if datetime.fromisoformat(f["modified_date"]) < now - timedelta(days=365)]
    pdf_files = [f for f in files if f["extension"] == ".pdf"]

    suggestions = []
    if duplicates:
        suggestions.append({"type": "duplicates", "title": "Duplicate files detected", "detail": f"{len(duplicates)} duplicate groups found."})
    if large_files:
        suggestions.append({"type": "large_files", "title": "Large files detected", "detail": f"{len(large_files)} files over 500MB."})
    if len(pdf_files) >= 20:
        suggestions.append({"type": "pdf_cleanup", "title": "Many PDFs detected", "detail": f"{len(pdf_files)} PDFs found. Consider grouping by project or year."})
    if len(screenshots) >= 10:
        suggestions.append({"type": "screenshots", "title": "Screenshot clutter detected", "detail": f"{len(screenshots)} screenshots found. Consider archiving."})
    if old_files:
        suggestions.append({"type": "old_files", "title": "Old unused files found", "detail": f"{len(old_files)} files not modified in a year."})

    clutter_score = _clutter_score(len(files), duplicate_count, len(old_files), len(screenshots), len(large_files))
    suggestions.append({"type": "clutter_score", "title": "Folder clutter score", "detail": f"Current clutter score is {clutter_score}/100. Lower is better."})

    if not files:
        suggestions.append({"type": "empty", "title": "Folder is empty", "detail": "No files found in this location."})

    insights = {
        "duplicate_count": duplicate_count,
        "duplicates": duplicates,
        "large_files": large_files[:10],
        "old_files": old_files[:10],
        "pdf_count": len(pdf_files),
        "screenshot_count": len(screenshots),
        "clutter_score": clutter_score,
    }
    return suggestions, insights


def generate_ai_suggestions(files: List[Dict[str, Any]], heuristics: List[Dict[str, Any]]) -> List[Dict[str, Any]]:
    return heuristics
