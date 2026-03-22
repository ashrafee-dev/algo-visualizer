METADATA = {
    "id": "searching.binary_search",
    "name": "Binary Search",
    "category": "Searching",
    "description": "Find a target in a sorted array by halving search space.",
    "status": "implemented",
    "time_complexity": "O(log n)",
    "space_complexity": "O(1)",
    "tags": ["array", "divide-and-conquer"],
    "visualization_type": "array",
    "default_input": {"array": [1, 3, 5, 7, 9, 11], "target": 7},
    "example_inputs": [{"array": [1, 2, 3, 4, 5], "target": 4}],
}

# ── Clean code shown in Monaco ───────────────────────────
#  2  arr = …
#  3  target = …
#  4  left, right = …
#  6  while left <= right:
#  7      mid = …
#  8      if arr[mid] == target:
#  9          return found
# 10      elif arr[mid] < target:
# 11          left = mid + 1
# 12      else:
# 13          right = mid - 1
# 15  return not-found

SOURCE_CODE = """\
def run_algorithm(input_data, emitter):
    arr = input_data.get("array", [])
    target = input_data.get("target")
    left, right = 0, len(arr) - 1

    while left <= right:
        mid = (left + right) // 2
        if arr[mid] == target:
            return {"index": mid}
        elif arr[mid] < target:
            left = mid + 1
        else:
            right = mid - 1

    return {"index": -1}
"""


def run(input_data):
    from app.algorithms.base import StepEmitter
    steps = []
    emitter = StepEmitter(steps)
    arr = input_data.get("array", [])
    target = input_data.get("target")
    left, right = 0, len(arr) - 1
    emitter.emit("init", f"Array: {arr}, target: {target}", line=2,
        snapshot={"array": arr, "target": target})
    emitter.emit("init", f"left = 0, right = {right}", line=4,
        snapshot={"array": arr, "target": target},
        highlights={"left": 0, "right": right})
    while left <= right:
        emitter.emit("loop", f"left={left} ≤ right={right} → continue", line=6,
            snapshot={"array": arr, "target": target},
            highlights={"left": left, "right": right})
        mid = (left + right) // 2
        emitter.emit("init", f"mid = {mid}, arr[{mid}] = {arr[mid]}", line=7,
            snapshot={"array": arr, "target": target},
            highlights={"left": left, "mid": mid, "right": right})
        if arr[mid] == target:
            emitter.emit("found", f"arr[{mid}] == {target} → found!", line=8,
                snapshot={"array": arr, "target": target},
                highlights={"found": mid})
            return {"steps": steps, "result": {"index": mid}}
        elif arr[mid] < target:
            emitter.emit("narrow",
                f"arr[{mid}]={arr[mid]} < {target} → search right", line=10,
                snapshot={"array": arr, "target": target},
                highlights={"left": left, "mid": mid, "right": right})
            left = mid + 1
            emitter.emit("assign", f"left = {left}", line=11,
                snapshot={"array": arr, "target": target},
                highlights={"left": left, "mid": mid, "right": right})
        else:
            emitter.emit("narrow",
                f"arr[{mid}]={arr[mid]} > {target} → search left", line=12,
                snapshot={"array": arr, "target": target},
                highlights={"left": left, "mid": mid, "right": right})
            right = mid - 1
            emitter.emit("assign", f"right = {right}", line=13,
                snapshot={"array": arr, "target": target},
                highlights={"left": left, "mid": mid, "right": right})
    emitter.emit("not-found", f"left > right → {target} not found", line=15,
        snapshot={"array": arr, "target": target})
    return {"steps": steps, "result": {"index": -1}}
