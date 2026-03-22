from dataclasses import dataclass
from typing import Any, Dict, List, Optional


@dataclass
class StepEmitter:
    steps: List[Dict[str, Any]]

    def emit(
        self,
        step_type: str,
        message: str,
        *,
        line: Optional[int] = None,
        snapshot: Optional[Dict[str, Any]] = None,
        highlights: Optional[Dict[str, Any]] = None,
        metrics: Optional[Dict[str, Any]] = None,
        aux_state: Optional[Dict[str, Any]] = None,
    ) -> None:
        self.steps.append(
            {
                "type": step_type,
                "line": line,
                "message": message,
                "snapshot": snapshot or {},
                "highlights": highlights or {},
                "metrics": metrics or {},
                "aux_state": aux_state or {},
            }
        )


class NotImplementedAlgorithmError(NotImplementedError):
    pass
