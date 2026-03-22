import { useEffect, useMemo } from "react";
import { usePlayback } from "../../hooks/usePlayback";
import { useAppStore } from "../../store/useAppStore";
import type { Step } from "../../types/api";
import { AlgorithmSidebar } from "./AlgorithmSidebar";
import { AppHeader } from "./AppHeader";
import { VisualizationCanvas } from "./VisualizationCanvas";
import { EditorPanel } from "../panels/EditorPanel";

function buildPreviewStep(input: Record<string, unknown> | undefined): Step | null {
  if (!input) return null;
  return { type: "preview", message: "", line: null, snapshot: input, highlights: {}, metrics: {}, aux_state: {} };
}

export function AppShell() {
  const s = useAppStore();
  useEffect(() => {
    void useAppStore.getState().init();
  }, []);
  usePlayback();

  const liveInput = useMemo(() => {
    try { return JSON.parse(s.inputJson || "{}") as Record<string, unknown>; }
    catch { return s.selected?.metadata.default_input; }
  }, [s.inputJson, s.selected?.metadata.default_input]);
  const previewStep = useMemo(() => buildPreviewStep(liveInput), [liveInput]);
  const step = s.runResult?.steps[s.stepIndex] ?? previewStep;
  const vType = s.selected?.metadata.visualization_type;

  return (
    <div className="mesh-bg flex h-screen flex-col overflow-hidden text-slate-100">
      <AppHeader />
      <main className="mx-auto grid min-h-0 w-full max-w-[1720px] flex-1 gap-4 px-4 py-3 lg:grid-cols-12 lg:gap-4 lg:px-5">
        <div className="min-h-0 lg:col-span-2">
          <AlgorithmSidebar />
        </div>
        <div className="flex min-h-0 flex-col lg:col-span-6">
          <VisualizationCanvas vType={vType} step={step} />
        </div>
        <div className="min-h-0 lg:col-span-4">
          <EditorPanel />
        </div>
      </main>
    </div>
  );
}
