METADATA = {
    "id": "graphs.bfs",
    "name": "Breadth-First Search",
    "category": "Graphs",
    "description": "Traverse graph level by level from a start node.",
    "status": "implemented",
    "time_complexity": "O(V + E)",
    "space_complexity": "O(V)",
    "tags": ["graph", "queue", "traversal"],
    "visualization_type": "graph",
    "default_input": {
        "nodes": [0, 1, 2, 3, 4, 5],
        "edges": [[0, 1], [0, 2], [1, 3], [2, 4], [2, 5]],
        "start": 0,
    },
    "example_inputs": [],
}

# ── Clean code shown in Monaco ───────────────────────────
#  5  adj = …
# 10  queue = [start]
# 11  visited = …
# 12  order = []
# 14  while queue:
# 15      current = queue.pop(0)
# 16      order.append(current)
# 17      for neighbor in …:
# 18          if not visited …:
# 19              visited[neighbor] = True
# 20              queue.append(neighbor)
# 22  return

SOURCE_CODE = """\
def run_algorithm(input_data, emitter):
    nodes = input_data.get("nodes", [])
    edges = input_data.get("edges", [])
    start = input_data.get("start", nodes[0] if nodes else 0)
    adj = {n: [] for n in nodes}
    for u, v in edges:
        adj.setdefault(u, []).append(v)
        adj.setdefault(v, []).append(u)

    queue = [start]
    visited = {start: True}
    order = []

    while queue:
        current = queue.pop(0)
        order.append(current)
        for neighbor in adj.get(current, []):
            if not visited.get(neighbor):
                visited[neighbor] = True
                queue.append(neighbor)

    return {"order": order}
"""


def run(input_data):
    from app.algorithms.base import StepEmitter
    steps = []
    emitter = StepEmitter(steps)
    nodes = input_data.get("nodes", [])
    edges = input_data.get("edges", [])
    if not nodes:
        return {"steps": steps, "result": {"order": []}}
    start = input_data.get("start", nodes[0])
    adj = {node: [] for node in nodes}
    for u, v in edges:
        adj.setdefault(u, []).append(v)
        adj.setdefault(v, []).append(u)
    emitter.emit("init",
        f"Graph: {len(nodes)} nodes, {len(edges)} edges, start = {start}",
        line=5, snapshot={"nodes": nodes, "edges": edges},
        highlights={"current": start})
    queue = [start]
    visited = {start: True}
    order = []
    emitter.emit("init", f"queue = [{start}]", line=10,
        snapshot={"nodes": nodes, "edges": edges},
        highlights={"current": start, "queue": [start]})
    while queue:
        emitter.emit("loop", f"Queue: {queue}", line=14,
            snapshot={"nodes": nodes, "edges": edges},
            highlights={"visited": order[:], "queue": queue[:]})
        current = queue.pop(0)
        emitter.emit("dequeue", f"Dequeue {current}", line=15,
            snapshot={"nodes": nodes, "edges": edges},
            highlights={"visited": order[:], "current": current,
                "queue": queue[:]})
        order.append(current)
        emitter.emit("visit", f"Visit {current} → order = {order}", line=16,
            snapshot={"nodes": nodes, "edges": edges},
            highlights={"visited": order[:], "current": current,
                "queue": queue[:]})
        for neighbor in adj.get(current, []):
            emitter.emit("check", f"Check neighbor {neighbor}", line=17,
                snapshot={"nodes": nodes, "edges": edges},
                highlights={"visited": order[:], "current": current,
                    "queue": queue[:]})
            if not visited.get(neighbor):
                visited[neighbor] = True
                queue.append(neighbor)
                emitter.emit("enqueue",
                    f"Enqueue {neighbor} → queue = {queue}", line=20,
                    snapshot={"nodes": nodes, "edges": edges},
                    highlights={"visited": order[:], "current": current,
                        "queue": queue[:]})
            else:
                emitter.emit("skip", f"{neighbor} already visited", line=18,
                    snapshot={"nodes": nodes, "edges": edges},
                    highlights={"visited": order[:], "current": current,
                        "queue": queue[:]})
    emitter.emit("done", f"BFS complete: {order}", line=22,
        snapshot={"nodes": nodes, "edges": edges},
        highlights={"visited": order[:]})
    return {"steps": steps, "result": {"order": order}}
