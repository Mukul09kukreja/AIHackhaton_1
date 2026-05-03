from pathlib import Path
import hashlib


def file_hash(path: Path, chunk_size: int = 8192) -> str:
    digest = hashlib.md5()
    with path.open('rb') as f:
        for chunk in iter(lambda: f.read(chunk_size), b''):
            digest.update(chunk)
    return digest.hexdigest()
