METADATA = {
    "id": "sorting.bubble_sort",
    "name": "Bubble Sort",
    "category": "Sorting",
    "description": "Classic adjacent-swap stable sorting algorithm.",
    "status": "implemented",
    "time_complexity": "O(n²)",
    "space_complexity": "O(1)",
    "tags": ["array", "stable", "fundamentals"],
    "visualization_type": "array",
    "default_input": {"array": [5, 1, 4, 2, 8]},
    "example_inputs": [{"array": [3, 2, 1]}, {"array": [8, 5, 2, 9, 1]}],
}

# ── Clean code shown in Monaco (students study this) ─────
# Line numbers matter — run() uses line= to highlight them.
#  2  arr = …
#  3  n = len(arr)
#  5  for i in range(n):
#  6      swapped = False
#  7      for j in …:
#  8          if arr[j] > arr[j+1]:
#  9              arr[j], arr[j+1] = …
# 10              swapped = True
# 11      if not swapped:
# 12          break
# 14  return

SOURCE_CODE = """\
def run_algorithm(input_data, emitter):
    arr = input_data.get("array", [])[:]
    n = len(arr)

    for i in range(n):
        swapped = False
        for j in range(n - i - 1):
            if arr[j] > arr[j + 1]:
                arr[j], arr[j + 1] = arr[j + 1], arr[j]
                swapped = True
        if not swapped:
            break

    return {"sorted_array": arr}
"""


def run(input_data):
    from app.algorithms.base import StepEmitter
    steps = []
    emitter = StepEmitter(steps)
    arr = input_data.get("array", [])[:]
    n = len(arr)
    emitter.emit("init", f"Input array: {arr}", line=2, snapshot={"array": arr[:]})
    emitter.emit("init", f"n = {n}", line=3, snapshot={"array": arr[:]})
    for i in range(n):
        emitter.emit("outer-loop", f"Start pass {i+1}", line=5, snapshot={"array": arr[:]})
        swapped = False
        emitter.emit("init", f"swapped = False", line=6, snapshot={"array": arr[:]})
        for j in range(n - i - 1):
            emitter.emit("inner-loop", f"j = {j}", line=7,
                snapshot={"array": arr[:]},
                highlights={"compare": [j, j + 1], "sorted_from": n - i})
            if arr[j] > arr[j + 1]:
                emitter.emit("compare",
                    f"arr[{j}]={arr[j]} > arr[{j+1}]={arr[j+1]} → swap",
                    line=8, snapshot={"array": arr[:]},
                    highlights={"compare": [j, j + 1], "sorted_from": n - i})
                arr[j], arr[j + 1] = arr[j + 1], arr[j]
                swapped = True
                emitter.emit("swap", f"Swapped → {arr}", line=9,
                    snapshot={"array": arr[:]},
                    highlights={"swap": [j, j + 1], "sorted_from": n - i})
            else:
                emitter.emit("no-swap",
                    f"arr[{j}]={arr[j]} ≤ arr[{j+1}]={arr[j+1]} → no swap",
                    line=8, snapshot={"array": arr[:]},
                    highlights={"compare": [j, j + 1], "sorted_from": n - i})
        emitter.emit("mark-sorted",
            f"Pass {i+1} done — position {n-i-1} sorted", line=5,
            snapshot={"array": arr[:]},
            highlights={"sorted": list(range(n - i - 1, n))})
        if not swapped:
            emitter.emit("early-exit", "No swaps → already sorted!", line=11,
                snapshot={"array": arr[:]},
                highlights={"sorted": list(range(n))})
            break
    emitter.emit("done", f"Sorted: {arr}", line=14,
        snapshot={"array": arr[:]},
        highlights={"sorted": list(range(n))})
    return {"steps": steps, "result": {"sorted_array": arr}}
