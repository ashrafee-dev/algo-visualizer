METADATA = {
    "id": "pathfinding.dijkstra",
    "name": "Dijkstra",
    "category": "Pathfinding",
    "description": "Shortest path from source in non-negative weighted graph.",
    "status": "implemented",
    "time_complexity": "O(V² + E)",
    "space_complexity": "O(V)",
    "tags": ["graph", "shortest-path", "weighted"],
    "visualization_type": "graph",
    "default_input": {
        "nodes": [0, 1, 2, 3, 4],
        "edges": [[0, 1, 4], [0, 2, 2], [2, 1, 1], [1, 3, 5], [2, 3, 8], [3, 4, 2]],
        "source": 0,
    },
    "example_inputs": [],
}


def _safe_dist(d):
    """Convert float('inf') → None for JSON."""
    return {k: (v if v != float("inf") else None) for k, v in d.items()}


# ── Clean code shown in Monaco ───────────────────────────
#  6  dist = {…}
#  7  dist[source] = 0
#  8  visited = {}
# 10  while …:
# 11-16  pick node with smallest dist
# 17      if current is None: break
# 18      visited[current] = True
# 19      for u, v, w in edges:
# 20          if u == current …:
# 21              candidate = …
# 22              if candidate < dist[v]:
# 23                  dist[v] = candidate
# 25  return

SOURCE_CODE = """\
def run_algorithm(input_data, emitter):
    nodes = input_data.get("nodes", [])
    edges = input_data.get("edges", [])
    source = input_data.get("source", nodes[0] if nodes else 0)
    INF = float("inf")
    dist = {node: INF for node in nodes}
    dist[source] = 0
    visited = {}

    while len(visited) < len(nodes):
        current = None
        best = INF
        for node in nodes:
            if not visited.get(node) and dist[node] < best:
                best = dist[node]
                current = node
        if current is None:
            break
        visited[current] = True
        for u, v, w in edges:
            if u == current and not visited.get(v):
                candidate = dist[current] + w
                if candidate < dist[v]:
                    dist[v] = candidate

    return {"distances": {k: v for k, v in dist.items() if v != INF}}
"""


def run(input_data):
    from app.algorithms.base import StepEmitter
    steps = []
    emitter = StepEmitter(steps)
    nodes = input_data.get("nodes", [])
    edges = input_data.get("edges", [])
    if not nodes:
        return {"steps": steps, "result": {"distances": {}}}
    source = input_data.get("source", nodes[0])
    INF = float("inf")
    dist = {node: INF for node in nodes}
    dist[source] = 0
    visited = {}
    emitter.emit("init",
        f"source = {source}, dist[{source}] = 0, all others = ∞", line=6,
        snapshot={"nodes": nodes, "edges": edges},
        highlights={"current": source, "dist": _safe_dist(dist)})
    while len(visited) < len(nodes):
        emitter.emit("loop",
            f"{len(nodes) - len(visited)} unvisited nodes remain", line=10,
            snapshot={"nodes": nodes, "edges": edges},
            highlights={"visited": list(visited.keys()),
                "dist": _safe_dist(dist)})
        current = None
        best = INF
        for node in nodes:
            if not visited.get(node) and dist[node] < best:
                best = dist[node]
                current = node
        if current is None:
            break
        emitter.emit("pick",
            f"Nearest unvisited: node {current} (dist = {dist[current]})",
            line=11, snapshot={"nodes": nodes, "edges": edges},
            highlights={"current": current, "visited": list(visited.keys()),
                "dist": _safe_dist(dist)})
        visited[current] = True
        emitter.emit("visit", f"Mark node {current} as visited", line=18,
            snapshot={"nodes": nodes, "edges": edges},
            highlights={"current": current, "visited": list(visited.keys()),
                "dist": _safe_dist(dist)})
        for u, v, w in edges:
            if u == current and not visited.get(v):
                candidate = dist[current] + w
                dv = "∞" if dist[v] == INF else str(dist[v])
                emitter.emit("check",
                    f"Edge {u}→{v} (w={w}): {dist[current]}+{w}={candidate}"
                    f" vs dist[{v}]={dv}", line=21,
                    snapshot={"nodes": nodes, "edges": edges},
                    highlights={"edge": [u, v], "current": current,
                        "visited": list(visited.keys()),
                        "dist": _safe_dist(dist)})
                if candidate < dist[v]:
                    dist[v] = candidate
                    emitter.emit("update-distance",
                        f"dist[{v}] = {candidate}", line=23,
                        snapshot={"nodes": nodes, "edges": edges},
                        highlights={"edge": [u, v], "current": current,
                            "visited": list(visited.keys()),
                            "dist": _safe_dist(dist)})
    emitter.emit("done",
        f"Shortest distances: {_safe_dist(dist)}", line=25,
        snapshot={"nodes": nodes, "edges": edges},
        highlights={"visited": list(visited.keys()),
            "dist": _safe_dist(dist)})
    return {"steps": steps, "result": {"distances": _safe_dist(dist)}}
