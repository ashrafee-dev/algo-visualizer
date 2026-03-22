import type { AlgorithmDetail, AlgorithmSummary, RunResponse } from "../types/api";

const API_URL = (import.meta.env.VITE_API_URL as string | undefined) ?? "/api";

function formatApiError(raw: string, status: number): string {
  try {
    const j = JSON.parse(raw) as { detail?: unknown };
    const d = j.detail;
    if (typeof d === "string") return d;
    if (Array.isArray(d))
      return d
        .map((x) => (typeof x === "object" && x !== null && "msg" in x ? String((x as { msg: unknown }).msg) : JSON.stringify(x)))
        .join("; ");
  } catch {
    /* not JSON */
  }
  return raw.trim() || `Request failed (${status})`;
}

async function req<T>(path: string, init?: RequestInit): Promise<T> {
  const res = await fetch(`${API_URL}${path}`, {
    ...init,
    headers: { "Content-Type": "application/json", ...(init?.headers || {}) },
  });
  if (!res.ok) {
    const raw = await res.text();
    throw new Error(formatApiError(raw, res.status));
  }
  return res.json() as Promise<T>;
}

export const api = {
  listAlgorithms: () => req<AlgorithmSummary[]>("/algorithms"),
  listCategories: () => req<string[]>("/categories"),
  getAlgorithm: (id: string) => req<AlgorithmDetail>(`/algorithms/${id}`),
  runAlgorithm: (id: string, input_data: Record<string, unknown>) => req<RunResponse>(`/algorithms/${id}/run`, { method: "POST", body: JSON.stringify({ input_data }) }),
  runCustom: (id: string, code: string, input_data: Record<string, unknown>) => req<RunResponse>(`/algorithms/${id}/run-custom`, { method: "POST", body: JSON.stringify({ code, input_data }) }),
};
