from __future__ import annotations

import json
import os
from datetime import datetime, timedelta, timezone
from typing import Any, Dict, List

from dotenv import load_dotenv
from openai import AsyncOpenAI

load_dotenv()


def _build_local_insights(files: List[Dict[str, Any]]) -> Dict[str, Any]:
    now = datetime.now(timezone.utc)
    total = len(files)
    if total == 0:
        return {
            "mode": "local",
            "summary": "No files found yet. Scan a folder to generate workspace insights.",
            "workspace_health_score": 100,
            "suggestions": ["Scan a folder to begin workspace analysis."],
            "cleanup_recommendations": ["No cleanup needed right now."],
            "risks": ["No risk signals detected."],
            "category_insights": ["No category distribution available yet."],
        }

    old_cutoff = now - timedelta(days=180)
    old_files = [f for f in files if datetime.fromisoformat(f["modified_date"]) < old_cutoff]
    archives = [f for f in files if f.get("extension") in {".zip", ".rar", ".7z", ".tar", ".gz"}]
    images = [f for f in files if f.get("category") == "Images"]
    pdfs = [f for f in files if f.get("extension") == ".pdf"]
    large = sorted(files, key=lambda x: x["size"], reverse=True)[:5]

    clutter = min(100, round((len(old_files) / total) * 40 + (len(archives) / total) * 25 + (len(large) / total) * 20))
    health = max(0, 100 - clutter)

    return {
        "mode": "local",
        "summary": "Using local AI insights. Workspace analysis was generated offline from file metadata.",
        "workspace_health_score": health,
        "suggestions": [
            f"{len(old_files)} files have not changed in over 6 months.",
            f"{len(archives)} archive files were detected; consider long-term storage cleanup.",
        ],
        "cleanup_recommendations": [
            "Archive old project exports and installers.",
            "Group PDFs and images by project or month for faster retrieval.",
        ],
        "risks": [
            "Potential clutter growth if old files continue accumulating.",
            "Large files can quickly consume available storage.",
        ],
        "category_insights": [
            f"Image files detected: {len(images)}.",
            f"PDF files detected: {len(pdfs)}.",
        ],
    }


def _metadata_payload(files: List[Dict[str, Any]]) -> List[Dict[str, Any]]:
    return [
        {
            "filename": f.get("filename"),
            "extension": f.get("extension"),
            "category": f.get("category"),
            "size": f.get("size"),
            "modified_date": f.get("modified_date"),
        }
        for f in files
    ]


async def generate_workspace_insights(files: List[Dict[str, Any]], ai_assisted: bool) -> Dict[str, Any]:
    local = _build_local_insights(files)
    if not ai_assisted:
        return local

    api_key = os.getenv("OPENAI_API_KEY")
    if not api_key:
        return local

    try:
        client = AsyncOpenAI(api_key=api_key, timeout=12.0)
        prompt = {
            "task": "Generate concise workspace insights from file metadata only.",
            "privacy_rule": "Never request or infer file contents.",
            "required_json_schema": {
                "mode": "openai",
                "summary": "string",
                "workspace_health_score": 0,
                "suggestions": ["string"],
                "cleanup_recommendations": ["string"],
                "risks": ["string"],
                "category_insights": ["string"],
            },
            "files": _metadata_payload(files)[:4000],
        }
        resp = await client.responses.create(
            model="gpt-4.1-mini",
            input=[
                {"role": "system", "content": "You are a workspace organization analyst. Output only valid JSON."},
                {"role": "user", "content": json.dumps(prompt)},
            ],
            temperature=0.3,
        )
        parsed = json.loads(resp.output_text)
        parsed["mode"] = "openai"
        return parsed
    except Exception:
        return local
