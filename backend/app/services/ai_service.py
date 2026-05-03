import os
from pathlib import Path
from datetime import datetime, timezone, timedelta
from collections import defaultdict
from typing import Any, Dict, List, Tuple

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


def heuristic_suggestions(files: List[Dict[str, Any]]) -> Tuple[List[Dict[str, Any]], Dict[str, Any]]:
    now = datetime.now(timezone.utc)
    duplicates = detect_duplicates(files)
    large_files = [f for f in files if f["size"] > 500 * 1024 * 1024]
    screenshots = [f for f in files if "screenshot" in f["filename"].lower()]
    old_files = [f for f in files if datetime.fromisoformat(f["modified_date"]) < now - timedelta(days=365)]
    suggestions = []
    if duplicates:
        suggestions.append({"type": "duplicates", "title": "Duplicate files detected", "detail": f"{len(duplicates)} duplicate groups found."})
    if large_files:
        suggestions.append({"type": "large_files", "title": "Large files detected", "detail": f"{len(large_files)} files over 500MB."})
    if len(screenshots) >= 10:
        suggestions.append({"type": "screenshots", "title": "Screenshot clutter detected", "detail": f"{len(screenshots)} screenshots found. Consider archiving."})
    if old_files:
        suggestions.append({"type": "old_files", "title": "Old unused files found", "detail": f"{len(old_files)} files not modified in a year."})
    if not suggestions:
        suggestions.append({"type": "clean", "title": "Folder health looks good", "detail": "No critical clutter patterns detected."})

    insights = {"duplicate_count": sum(len(g) for g in duplicates), "duplicates": duplicates, "large_files": large_files[:10], "old_files": old_files[:10]}
    return suggestions, insights


def generate_ai_suggestions(files: List[Dict[str, Any]], heuristics: List[Dict[str, Any]]) -> List[Dict[str, Any]]:
    if os.getenv("OPENAI_API_KEY"):
        return [{"type": "ai", "title": "OpenAI-enhanced mode active", "detail": "API key detected. Wire this payload to GPT for richer personalized cleanup strategies."}, *heuristics]
    return heuristics
