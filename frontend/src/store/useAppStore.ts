import { create } from "zustand";
import { api } from "../lib/api";
import type { AlgorithmDetail, AlgorithmSummary, RunResponse } from "../types/api";

interface AppState {
  algorithms: AlgorithmSummary[];
  categories: string[];
  selectedId: string | null;
  selected: AlgorithmDetail | null;
  search: string;
  category: string;
  statusFilter: "all" | "implemented" | "todo";
  editedCode: string;
  inputJson: string;
  runResult: RunResponse | null;
  stepIndex: number;
  playing: boolean;
  speedMs: number;
  runError: string | null;
  loading: boolean;
  init: () => Promise<void>;
  selectAlgorithm: (id: string) => Promise<void>;
  setSearch: (v: string) => void;
  setCategory: (v: string) => void;
  setStatusFilter: (v: "all" | "implemented" | "todo") => void;
  setEditedCode: (v: string) => void;
  setInputJson: (v: string) => void;
  runCurrent: () => Promise<void>;
  setStepIndex: (i: number) => void;
  setPlaying: (v: boolean) => void;
  setSpeedMs: (v: number) => void;
  resetPlayback: () => void;
  clearRunError: () => void;
}

export const useAppStore = create<AppState>((set, get) => ({
  algorithms: [],
  categories: [],
  selectedId: null,
  selected: null,
  search: "",
  category: "All",
  statusFilter: "all",
  editedCode: "",
  inputJson: "{}",
  runResult: null,
  stepIndex: 0,
  playing: false,
  speedMs: 700,
  runError: null,
  loading: false,
  init: async () => {
    try {
      const [algorithms, categories] = await Promise.all([api.listAlgorithms(), api.listCategories()]);
      set({ algorithms, categories: ["All", ...categories], runError: null });
      const pick = algorithms.find((a) => a.metadata.status === "implemented")?.metadata.id ?? algorithms[0]?.metadata.id;
      if (pick) await get().selectAlgorithm(pick);
    } catch (e) {
      set({ runError: e instanceof Error ? e.message : "Failed to load algorithms" });
    }
  },
  selectAlgorithm: async (id) => {
    set({ loading: true, runError: null });
    try {
      const detail = await api.getAlgorithm(id);
      set({
        selectedId: id,
        selected: detail,
        editedCode: detail.source_code,
        inputJson: JSON.stringify(detail.metadata.default_input),
        runResult: null,
        stepIndex: 0,
        playing: false,
      });
    } catch (e) {
      set({ runError: e instanceof Error ? e.message : "Failed to load algorithm" });
    } finally {
      set({ loading: false });
    }
  },
  setSearch: (v) => set({ search: v }),
  setCategory: (v) => set({ category: v }),
  setStatusFilter: (v) => set({ statusFilter: v }),
  setEditedCode: (v) => set({ editedCode: v }),
  setInputJson: (v) => set({ inputJson: v }),
  runCurrent: async () => {
    const { selectedId, editedCode, inputJson, selected } = get();
    if (!selectedId || !selected) return;
    if (selected.metadata.status !== "implemented") {
      set({ runError: "This algorithm is coming soon — implement it in Python and set status to implemented." });
      return;
    }
    let input: Record<string, unknown>;
    try {
      input = JSON.parse(inputJson || "{}") as Record<string, unknown>;
    } catch {
      set({ runError: "Input JSON is invalid." });
      return;
    }
    const codeEdited = editedCode !== selected.source_code;
    set({ loading: true, runError: null });
    try {
      const runResult = codeEdited
        ? await api.runCustom(selectedId, editedCode, input)
        : await api.runAlgorithm(selectedId, input);
      set({ runResult, stepIndex: 0, playing: runResult.steps.length > 1 });
    } catch (e) {
      set({ runError: e instanceof Error ? e.message : "Run failed" });
    } finally {
      set({ loading: false });
    }
  },
  setStepIndex: (i) => set({ stepIndex: i }),
  setPlaying: (v) => set({ playing: v }),
  setSpeedMs: (v) => set({ speedMs: v }),
  resetPlayback: () => set({ stepIndex: 0, playing: false }),
  clearRunError: () => set({ runError: null }),
}));
