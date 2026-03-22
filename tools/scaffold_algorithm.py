#!/usr/bin/env python3
from __future__ import annotations

import argparse
import re
from pathlib import Path

CATEGORIES = ["sorting", "searching", "graphs", "trees", "dynamic_programming", "greedy", "backtracking", "pathfinding", "strings"]
PRESET_ALL = [
    ("sorting", "Selection Sort"), ("sorting", "Insertion Sort"), ("sorting", "Merge Sort"), ("sorting", "Quick Sort"),
    ("searching", "Linear Search"), ("graphs", "DFS"), ("pathfinding", "A*"), ("graphs", "Topological Sort"),
    ("graphs", "Kruskal"), ("graphs", "Prim"), ("graphs", "Union Find"), ("sorting", "Heap Sort"),
    ("dynamic_programming", "Sliding Window examples"), ("dynamic_programming", "Prefix Sum examples"),
    ("strings", "KMP"), ("strings", "Trie Search"), ("backtracking", "N-Queens"), ("backtracking", "Sudoku Solver"),
]


def slugify(name: str) -> str:
    return re.sub(r"[^a-zA-Z0-9]+", "_", name.strip().lower()).strip("_") or "new_algorithm"


VIZ_BY_CATEGORY = {
    "sorting": "array",
    "searching": "array",
    "graphs": "graph",
    "trees": "tree",
    "dynamic_programming": "array",
    "greedy": "array",
    "backtracking": "grid",
    "pathfinding": "grid",
    "strings": "string",
}


def render_module(category: str, name: str) -> str:
    slug = slugify(name)
    category_label = " ".join(w.capitalize() for w in category.split("_"))
    viz = VIZ_BY_CATEGORY.get(category, "custom")
    return f'''METADATA = {{
    "id": "{category}.{slug}",
    "name": "{name}",
    "category": "{category_label}",
    "description": "Coming soon algorithm scaffold.",
    "status": "todo",
    "time_complexity": "TBD",
    "space_complexity": "TBD",
    "tags": ["todo"],
    "visualization_type": "{viz}",
    "default_input": {{}},
    "example_inputs": [],
}}

SOURCE_CODE = """def run_algorithm(input_data, emitter):\n    raise NotImplementedError('Coming soon')\n"""


def run(input_data):
    raise NotImplementedError("Coming soon")
'''


def create_module(root: Path, category: str, name: str, dry_run: bool, force: bool) -> None:
    slug = slugify(name)
    target = root / "backend" / "app" / "algorithms" / category / f"{slug}.py"
    if target.exists() and not force:
        print(f"skip: {target} exists (use --force)")
        return

    print(("dry-run create:" if dry_run else "create:"), target)
    if dry_run:
        return

    target.parent.mkdir(parents=True, exist_ok=True)
    target.write_text(render_module(category, name))


def main() -> None:
    parser = argparse.ArgumentParser(description="Scaffold Python algorithm module")
    parser.add_argument("--category", choices=CATEGORIES)
    parser.add_argument("--name")
    parser.add_argument("--preset", choices=["all"])
    parser.add_argument("--dry-run", action="store_true")
    parser.add_argument("--force", action="store_true")
    args = parser.parse_args()

    project_root = Path(__file__).resolve().parents[1]
    if args.preset == "all":
        for category, name in PRESET_ALL:
            create_module(project_root, category, name, args.dry_run, args.force)
        return

    if not args.category or not args.name:
        parser.error("Use --preset all or provide both --category and --name")

    create_module(project_root, args.category, args.name, args.dry_run, args.force)


if __name__ == "__main__":
    main()
