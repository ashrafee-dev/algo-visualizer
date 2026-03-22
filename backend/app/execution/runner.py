from copy import deepcopy
from typing import Any

from app.algorithms.base import NotImplementedAlgorithmError, StepEmitter
from app.discovery.loader import discovery_service


class AlgorithmExecutionError(Exception):
    pass


def run_builtin_algorithm(algorithm_id: str, input_data: dict[str, Any]) -> dict[str, Any]:
    discovered = discovery_service.get(algorithm_id)
    if discovered.metadata.status != "implemented":
        raise NotImplementedAlgorithmError(f"{algorithm_id} is TODO/Coming Soon")
    run_fn = getattr(discovered.module, "run", None)
    if not callable(run_fn):
        raise AlgorithmExecutionError(f"Algorithm {algorithm_id} does not expose run(input_data)")
    payload = run_fn(deepcopy(input_data))
    if not isinstance(payload, dict):
        raise AlgorithmExecutionError("run() must return a dict with keys 'steps' and 'result'")
    if "steps" not in payload or "result" not in payload:
        raise AlgorithmExecutionError("run() must return {'steps': [...], 'result': {...}}")
    return payload


def run_custom_algorithm(algorithm_id: str, code: str, input_data: dict[str, Any]) -> dict[str, Any]:
    discovered = discovery_service.get(algorithm_id)
    if discovered.metadata.status != "implemented":
        raise NotImplementedAlgorithmError(f"{algorithm_id} is TODO/Coming Soon")
    safe_builtins = {
        "range": range,
        "len": len,
        "min": min,
        "max": max,
        "sum": sum,
        "abs": abs,
        "enumerate": enumerate,
        "sorted": sorted,
        "reversed": reversed,
        "zip": zip,
        "list": list,
        "dict": dict,
        "set": set,
        "tuple": tuple,
        "int": int,
        "float": float,
        "str": str,
        "bool": bool,
        "True": True,
        "False": False,
        "None": None,
    }
    globals_dict: dict[str, Any] = {"__builtins__": safe_builtins, "StepEmitter": StepEmitter}
    locals_dict: dict[str, Any] = {}
    try:
        exec(code, globals_dict, locals_dict)
        run_fn = locals_dict.get("run_algorithm") or globals_dict.get("run_algorithm")
        if not callable(run_fn):
            raise AlgorithmExecutionError("Custom code must define run_algorithm(input_data, emitter)")
        steps: list[dict[str, Any]] = []
        emitter = StepEmitter(steps=steps)
        result = run_fn(deepcopy(input_data), emitter)
        return {"steps": steps, "result": result or {}}
    except Exception as exc:
        raise AlgorithmExecutionError(str(exc)) from exc
