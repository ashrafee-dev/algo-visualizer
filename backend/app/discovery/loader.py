import importlib
import pkgutil
from dataclasses import dataclass
from typing import Any

from app.schemas.contracts import AlgorithmMetadata


@dataclass
class DiscoveredAlgorithm:
    metadata: AlgorithmMetadata
    module_path: str
    module: Any


class AlgorithmDiscoveryService:
    def __init__(self) -> None:
        self._algorithms: dict[str, DiscoveredAlgorithm] = {}
        self.refresh()

    def refresh(self) -> None:
        self._algorithms.clear()
        package_name = "app.algorithms"
        package = importlib.import_module(package_name)
        for module_info in pkgutil.walk_packages(package.__path__, package.__name__ + "."):
            if module_info.name.endswith(".base") or ".__" in module_info.name:
                continue
            module = importlib.import_module(module_info.name)
            meta_raw = getattr(module, "METADATA", None)
            if meta_raw is None:
                continue
            metadata = AlgorithmMetadata.model_validate(meta_raw)
            self._algorithms[metadata.id] = DiscoveredAlgorithm(metadata=metadata, module_path=module_info.name, module=module)

    def list_algorithms(self) -> list[DiscoveredAlgorithm]:
        return sorted(self._algorithms.values(), key=lambda x: (x.metadata.category, x.metadata.name))

    def get(self, algorithm_id: str) -> DiscoveredAlgorithm:
        return self._algorithms[algorithm_id]


discovery_service = AlgorithmDiscoveryService()
