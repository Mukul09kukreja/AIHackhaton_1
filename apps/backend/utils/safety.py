from pathlib import Path

PROTECTED_PREFIXES = [
    Path('/Windows'), Path('/System'), Path('/bin'), Path('/usr'), Path('/etc')
]

def ensure_safe_path(path: Path) -> None:
    for prefix in PROTECTED_PREFIXES:
        try:
            path.resolve().relative_to(prefix.resolve())
            raise ValueError(f'Protected path blocked: {path}')
        except ValueError:
            continue
