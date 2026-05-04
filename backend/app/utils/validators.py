from pathlib import Path

FORBIDDEN_PATHS = [
    Path('C:/Windows'),
    Path('C:/Program Files'),
    Path('/etc'),
    Path('/bin'),
]


def validate_folder(path: str) -> Path:
    root = Path(path).expanduser().resolve()
    if not root.exists() or not root.is_dir():
        raise ValueError('Provided path is not a valid folder.')

    for forbidden in FORBIDDEN_PATHS:
        try:
            root.relative_to(forbidden)
            raise ValueError('Protected directory')
        except ValueError as exc:
            if str(exc) == 'Protected directory':
                raise
            continue

    return root
