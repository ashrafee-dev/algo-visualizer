# Algorithm Visualizer + Algorithm Playground

A full-stack **algorithm lab**: Python owns all execution; the UI discovers algorithms from the backend, lets you edit Python in Monaco, run it safely through a controlled executor, and play back structured steps with polished visualizations.

## Architecture overview

| Layer | Responsibility |
|--------|----------------|
| **Python (`backend/app/algorithms`)** | Metadata, optional `SOURCE_CODE` template, `run(input_data)` returning `{ "steps", "result" }`, step emission via `StepEmitter`. |
| **Discovery (`backend/app/discovery`)** | Walks `app.algorithms.*` packages; any module with `METADATA` registers automatically. |
| **Execution (`backend/app/execution`)** | Built-in runs call `run()`; custom runs `exec` user code and require `run_algorithm(input_data, emitter)`. |
| **API (`FastAPI`)** | Lists algorithms, serves detail + source, runs default or custom code. |
| **Frontend (`React` + `Zustand`)** | Fetches algorithms, never hardcodes the catalog; renders visualizers purely from step payloads. |

## Why algorithms stay in Python

- One source of truth for correctness and pedagogy.
- Steps are explicit data (snapshots + highlights), not re-implemented animation logic in TypeScript.
- New files under `backend/app/algorithms/<category>/` show up in the UI after restart (or future hot-reload).

## How discovery works

1. `pkgutil.walk_packages` scans under `app.algorithms`.
2. Each submodule that defines `METADATA` (Pydantic-valid dict) is registered by `metadata.id`.
3. `GET /api/algorithms` returns summaries; `GET /api/algorithms/{id}` returns metadata + `SOURCE_CODE` string for the editor.
4. Categories returned by `GET /api/categories` merge a **canonical order** (`Sorting`, `Searching`, …) with any extra labels found in metadata.

## How the frontend stays free of hardcoded lists

- On load, the app calls `GET /api/algorithms` and `GET /api/categories`.
- The sidebar and filters render **only** that response.
- Adding a valid module with `METADATA` is enough; no React code changes.

## How Python emits steps

Algorithms use `StepEmitter`:

- `type` — e.g. `compare`, `swap`, `visit`, `update-distance`, `found`.
- `message` — human-readable caption for the UI.
- `snapshot` — serializable view state (e.g. `array`, `nodes`/`edges`).
- `highlights` — indices, visited sets, current node, etc.
- Optional `line` — 1-based line in the **editor** `SOURCE_CODE` for Monaco highlighting.

The frontend never infers algorithm semantics; it only animates from `snapshot` / `highlights`.

## Editable code execution

- **Run** — executes the packaged `run()` for `status: "implemented"` algorithms.
- **Run edited** — sends Monaco text to `POST /api/algorithms/{id}/run-custom`. The snippet must define `run_algorithm(input_data, emitter)` and return a result dict. Execution uses a restricted `__builtins__` (see `runner.py`); this is **not** a full sandbox—suitable for local/dev; isolate further for untrusted input.

## Visualizer mapping

`metadata.visualization_type` selects the renderer: `array`, `graph`, `tree`, `grid`, `string`, `custom`.

## Implemented algorithms (reference)

- **Bubble Sort** — `sorting/bubble_sort.py`
- **Binary Search** — `searching/binary_search.py`
- **BFS** — `graphs/bfs.py`
- **Dijkstra** — `pathfinding/dijkstra.py`

## Scaffolded TODO / coming soon

Includes: selection, insertion, merge, quick, heap sort; linear search; DFS, topological sort, Kruskal, Prim, union-find; A*; sliding window / prefix sum examples; KMP; trie; N-Queens; Sudoku; **Greedy** (activity selection); **Trees** (binary tree traversals). Set `status` to `implemented`, implement `run()`, and return `{ "steps", "result" }`—the UI becomes runnable without frontend changes.

## Scaffold new algorithm files

```bash
python tools/scaffold_algorithm.py --category searching --name "Jump Search"
python tools/scaffold_algorithm.py --category graphs --name "Bellman Ford"
python tools/scaffold_algorithm.py --preset all
```

Flags: `--dry-run`, `--force`. New files default to `status: "todo"` and pick `visualization_type` from category.

## Run locally

### Backend (Python 3.10+ recommended; 3.11+ ideal)

```bash
cd backend
python3 -m venv .venv
source .venv/bin/activate   # Windows: .venv\Scripts\activate
pip install -r requirements.txt
uvicorn app.main:app --reload --port 8000
```

### Frontend

```bash
cd frontend
npm install
npm run dev
```

The Vite dev server proxies `/api` → `http://127.0.0.1:8000` so the default client uses same-origin `/api`. Override with:

```bash
VITE_API_URL=http://localhost:8000/api npm run dev
```

## Project layout (high level)

```
backend/app/
  algorithms/     # category folders + METADATA modules
  api/            # FastAPI routes
  constants/      # canonical categories
  discovery/      # filesystem / import discovery
  execution/      # run + custom exec
  schemas/        # Pydantic contracts
  services/
frontend/src/
  components/     # layout, panels, controls, visualizers, editor
  hooks/          # playback
  store/          # Zustand
  lib/            # API client
  types/
tools/
  scaffold_algorithm.py
```

## Assumptions and follow-ups

- **Security**: Custom code execution is constrained but not a cryptographic sandbox; do not expose publicly without stronger isolation (subprocess, WASM, etc.).
- **Hot reload**: Discovery runs at import time; new files need a backend restart unless you add a refresh hook.
- **Line highlights**: Optional `line` on steps should align with the displayed `SOURCE_CODE` string for accurate Monaco decoration.
