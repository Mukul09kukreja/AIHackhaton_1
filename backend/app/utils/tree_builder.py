from pathlib import Path
from typing import Dict, List


def build_tree(paths: List[Path], root: Path) -> Dict:
    tree: Dict = {"name": root.name, "type": "folder", "children": []}
    mapping = {root: tree}
    for path in sorted(paths):
        current = root
        for part in path.relative_to(root).parts:
            next_path = current / part
            parent = mapping[current]
            node = next((c for c in parent["children"] if c["name"] == part), None)
            is_file = next_path == path and next_path.suffix != ""
            if not node:
                node = {"name": part, "type": "file" if is_file else "folder", "children": None if is_file else []}
                parent["children"].append(node)
            mapping[next_path] = node
            current = next_path
    return tree
