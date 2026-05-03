from pathlib import Path


def validate_folder(path: str) -> Path:
    root = Path(path).expanduser().resolve()
    if not root.exists() or not root.is_dir():
        raise ValueError("Provided path is not a valid folder.")
    return root
