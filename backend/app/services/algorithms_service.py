from app.constants.categories import CANONICAL_CATEGORIES
from app.discovery.loader import discovery_service
from app.execution.runner import run_builtin_algorithm, run_custom_algorithm
from app.schemas.contracts import AlgorithmDetail, AlgorithmSummary, RunResponse, Step


class AlgorithmsService:
    def list_algorithms(self) -> list[AlgorithmSummary]:
        return [AlgorithmSummary(metadata=item.metadata) for item in discovery_service.list_algorithms()]

    def list_categories(self) -> list[str]:
        discovered = {item.metadata.category for item in discovery_service.list_algorithms()}
        ordered = [c for c in CANONICAL_CATEGORIES if c in discovered]
        extras = sorted(c for c in discovered if c not in CANONICAL_CATEGORIES)
        return ordered + extras

    def get_algorithm(self, algorithm_id: str) -> AlgorithmDetail:
        discovered = discovery_service.get(algorithm_id)
        source = getattr(discovered.module, "SOURCE_CODE", "")
        return AlgorithmDetail(metadata=discovered.metadata, source_code=source)

    def run_algorithm(self, algorithm_id: str, input_data: dict) -> RunResponse:
        payload = run_builtin_algorithm(algorithm_id, input_data)
        return RunResponse(algorithm_id=algorithm_id, steps=[Step.model_validate(step) for step in payload.get("steps", [])], result=payload.get("result", {}))

    def run_custom_algorithm(self, algorithm_id: str, code: str, input_data: dict) -> RunResponse:
        payload = run_custom_algorithm(algorithm_id, code, input_data)
        return RunResponse(algorithm_id=algorithm_id, steps=[Step.model_validate(step) for step in payload.get("steps", [])], result=payload.get("result", {}))


algorithms_service = AlgorithmsService()
