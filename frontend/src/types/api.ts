export type AlgorithmStatus = "implemented" | "todo";
export type VisualizationType = "array" | "graph" | "tree" | "grid" | "string" | "custom";

export interface AlgorithmMetadata {
  id: string;
  name: string;
  category: string;
  description: string;
  status: AlgorithmStatus;
  time_complexity: string;
  space_complexity: string;
  tags: string[];
  visualization_type: VisualizationType;
  default_input: Record<string, unknown>;
  example_inputs: Record<string, unknown>[];
}

export interface AlgorithmSummary { metadata: AlgorithmMetadata }
export interface AlgorithmDetail { metadata: AlgorithmMetadata; source_code: string }

export interface Step {
  type: string;
  line: number | null;
  message: string;
  snapshot: Record<string, unknown>;
  highlights: Record<string, unknown>;
  metrics: Record<string, unknown>;
  aux_state: Record<string, unknown>;
}

export interface RunResponse {
  algorithm_id: string;
  steps: Step[];
  result: Record<string, unknown>;
}
