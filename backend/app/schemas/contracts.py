from typing import Any, Dict, List, Literal, Optional
from pydantic import BaseModel, Field

AlgorithmStatus = Literal["implemented", "todo"]
VisualizationType = Literal["array", "graph", "tree", "grid", "string", "custom"]


class AlgorithmMetadata(BaseModel):
    id: str
    name: str
    category: str
    description: str
    status: AlgorithmStatus
    time_complexity: str
    space_complexity: str
    tags: List[str] = Field(default_factory=list)
    visualization_type: VisualizationType
    default_input: Dict[str, Any] = Field(default_factory=dict)
    example_inputs: List[Dict[str, Any]] = Field(default_factory=list)


class AlgorithmSummary(BaseModel):
    metadata: AlgorithmMetadata


class AlgorithmDetail(BaseModel):
    metadata: AlgorithmMetadata
    source_code: str


class Step(BaseModel):
    type: str
    line: Optional[int] = None
    message: str
    snapshot: Dict[str, Any] = Field(default_factory=dict)
    highlights: Dict[str, Any] = Field(default_factory=dict)
    metrics: Dict[str, Any] = Field(default_factory=dict)
    aux_state: Dict[str, Any] = Field(default_factory=dict)


class RunRequest(BaseModel):
    input_data: Dict[str, Any]


class RunCustomRequest(BaseModel):
    code: str
    input_data: Dict[str, Any]


class RunResponse(BaseModel):
    algorithm_id: str
    steps: List[Step]
    result: Dict[str, Any]
