import { AnimatePresence, motion } from "framer-motion";
import { Loader2, Pause, Play, RotateCcw, SkipBack, SkipForward, StepBack, StepForward } from "lucide-react";
import type { Step, VisualizationType } from "../../types/api";
import { useAppStore } from "../../store/useAppStore";
import { ArrayVisualizer } from "../visualizers/ArrayVisualizer";
import { CustomVisualizer } from "../visualizers/CustomVisualizer";
import { GraphVisualizer } from "../visualizers/GraphVisualizer";
import { GridVisualizer } from "../visualizers/GridVisualizer";
import { StringVisualizer } from "../visualizers/StringVisualizer";
import { TreeVisualizer } from "../visualizers/TreeVisualizer";

function Renderer({ vType, step }: { vType: VisualizationType | undefined; step: Step | null }) {
  switch (vType) {
    case "array":
      return <ArrayVisualizer step={step} />;
    case "graph":
      return <GraphVisualizer step={step} />;
    case "tree":
      return <TreeVisualizer step={step} />;
    case "grid":
      return <GridVisualizer step={step} />;
    case "string":
      return <StringVisualizer step={step} />;
    default:
      return <CustomVisualizer step={step} />;
  }
}

export function VisualizationCanvas({ vType, step }: { vType: VisualizationType | undefined; step: Step | null }) {
  const s = useAppStore();
  const total = s.runResult?.steps.length ?? 0;
  const maxIdx = Math.max(0, total - 1);
  const canStep = total > 0;
  const pct = total > 1 ? (s.stepIndex / (total - 1)) * 100 : 0;

  return (
    <div className="flex h-full min-h-0 flex-col gap-3">
      {/* Viz area */}
      <div className="relative min-h-0 flex-1">
        <AnimatePresence mode="wait">
          <motion.div
            key={vType ?? "custom"}
            initial={{ opacity: 0, scale: 0.98 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.98 }}
            transition={{ duration: 0.2, ease: [0.22, 1, 0.36, 1] }}
            className="h-full"
          >
            <Renderer vType={vType} step={step} />
          </motion.div>
        </AnimatePresence>

        {/* Step message overlay */}
        <AnimatePresence>
          {step?.message && step.type !== "preview" && (
            <motion.div
              initial={{ opacity: 0, y: -6 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -6 }}
              className="absolute bottom-3 left-3 right-3 z-10"
            >
              <div className="rounded-xl border border-white/10 bg-slate-950/80 px-4 py-2.5 text-sm text-slate-200 shadow-xl backdrop-blur-xl">
                <span className="mr-2 inline-block rounded bg-cyan-500/20 px-1.5 py-0.5 font-mono text-[10px] font-bold uppercase tracking-wider text-cyan-300">
                  {step.type}
                </span>
                {step.message}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Controls bar */}
      <div className="glass-panel shrink-0 rounded-2xl px-4 py-2.5">
        {/* Progress bar */}
        <div className="mb-2.5 h-1 w-full overflow-hidden rounded-full bg-white/[0.06]">
          <motion.div
            className="h-full rounded-full bg-gradient-to-r from-cyan-500 to-violet-500"
            initial={false}
            animate={{ width: `${canStep ? pct : 0}%` }}
            transition={{ type: "spring", stiffness: 300, damping: 30 }}
          />
        </div>

        <div className="flex items-center gap-2">
          {/* Run button */}
          <motion.button
            type="button"
            whileTap={{ scale: 0.95 }}
            disabled={s.loading}
            className="flex h-8 items-center gap-1.5 rounded-lg bg-gradient-to-r from-cyan-500 to-teal-500 px-3.5 text-xs font-semibold text-slate-950 shadow-lg shadow-cyan-500/20 transition hover:brightness-110 disabled:opacity-40 disabled:shadow-none"
            onClick={() => { s.resetPlayback(); void s.runCurrent(); }}
          >
            {s.loading ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : <Play className="h-3.5 w-3.5" />}
            Run
          </motion.button>

          <div className="mx-1 h-5 w-px bg-white/10" />

          {/* Transport */}
          <div className="flex items-center gap-1">
            <button type="button" disabled={!canStep} className="ctrl-btn" title="First" onClick={() => s.setStepIndex(0)}>
              <SkipBack className="h-3.5 w-3.5" />
            </button>
            <button type="button" disabled={!canStep} className="ctrl-btn" title="Step back" onClick={() => s.setStepIndex(Math.max(0, s.stepIndex - 1))}>
              <StepBack className="h-3.5 w-3.5" />
            </button>
            <motion.button
              type="button"
              whileTap={{ scale: 0.9 }}
              disabled={!canStep}
              className="flex h-8 w-8 items-center justify-center rounded-full border border-white/15 bg-white/10 text-white transition hover:bg-white/15 disabled:opacity-25"
              title={s.playing ? "Pause" : "Play"}
              onClick={() => s.setPlaying(!s.playing)}
            >
              {s.playing ? <Pause className="h-3.5 w-3.5" /> : <Play className="ml-0.5 h-3.5 w-3.5" />}
            </motion.button>
            <button type="button" disabled={!canStep} className="ctrl-btn" title="Step forward" onClick={() => s.setStepIndex(Math.min(maxIdx, s.stepIndex + 1))}>
              <StepForward className="h-3.5 w-3.5" />
            </button>
            <button type="button" disabled={!canStep} className="ctrl-btn" title="Last" onClick={() => s.setStepIndex(maxIdx)}>
              <SkipForward className="h-3.5 w-3.5" />
            </button>
          </div>

          {/* Counter */}
          <span className="min-w-[3.5rem] font-mono text-[11px] tabular-nums text-slate-400">
            {total ? s.stepIndex + 1 : 0}<span className="text-slate-600"> / {total}</span>
          </span>

          {/* Timeline */}
          <input
            type="range" min={0} max={maxIdx} step={1}
            value={total ? s.stepIndex : 0} disabled={!canStep}
            onChange={(e) => s.setStepIndex(Number(e.target.value))}
            className="mx-1 h-1 min-w-0 flex-1 accent-cyan-500 disabled:opacity-20"
          />

          {/* Speed */}
          <div className="flex items-center gap-1.5">
            <input
              type="range" min={80} max={2200} step={40}
              value={s.speedMs}
              onChange={(e) => s.setSpeedMs(Number(e.target.value))}
              className="h-1 w-14 accent-violet-500"
            />
            <span className="w-9 text-right font-mono text-[10px] tabular-nums text-slate-500">{s.speedMs}ms</span>
          </div>

          {/* Reset */}
          <button type="button" className="ctrl-btn" title="Reset" onClick={() => s.resetPlayback()}>
            <RotateCcw className="h-3.5 w-3.5" />
          </button>
        </div>
      </div>
    </div>
  );
}
