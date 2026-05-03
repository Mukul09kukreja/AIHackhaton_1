from datetime import datetime, timezone

CATEGORY_EXTENSIONS = {
    "Images": {".png", ".jpg", ".jpeg", ".gif", ".webp", ".bmp", ".svg", ".heic"},
    "Videos": {".mp4", ".mov", ".mkv", ".avi", ".webm", ".flv"},
    "Documents": {".pdf", ".doc", ".docx", ".txt", ".ppt", ".pptx", ".xls", ".xlsx", ".md", ".csv"},
    "Code": {".py", ".js", ".ts", ".tsx", ".jsx", ".java", ".cpp", ".c", ".cs", ".html", ".css", ".json", ".yaml", ".yml", ".go", ".rs"},
    "Audio": {".mp3", ".wav", ".aac", ".flac", ".ogg", ".m4a"},
    "Archives": {".zip", ".rar", ".7z", ".tar", ".gz", ".bz2"},
}


def categorize_extension(extension: str) -> str:
    ext = extension.lower()
    for category, extensions in CATEGORY_EXTENSIONS.items():
        if ext in extensions:
            return category
    return "Others"


def human_size(size: int) -> str:
    suffixes = ["B", "KB", "MB", "GB", "TB"]
    n = float(size)
    for suffix in suffixes:
        if n < 1024 or suffix == suffixes[-1]:
            return f"{n:.2f} {suffix}"
        n /= 1024
    return f"{size} B"


def datetime_to_iso(ts: float) -> str:
    return datetime.fromtimestamp(ts, tz=timezone.utc).isoformat()
