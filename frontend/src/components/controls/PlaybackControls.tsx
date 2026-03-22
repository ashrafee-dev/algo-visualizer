import { motion } from "framer-motion";
import { Pause, Play, SkipBack, SkipForward, StepBack, StepForward } from "lucide-react";
import { useAppStore } from "../../store/useAppStore";

export function PlaybackControls() {
  const s = useAppStore();
  const total = s.runResult?.steps.length ?? 0;
  const maxIdx = Math.max(0, total - 1);
  const canStep = total > 0;

  return (
    <div className="space-y-3 rounded-xl border border-white/[0.08] bg-black/25 p-3 backdrop-blur-sm">
      <div className="flex flex-wrap items-center gap-2">
        <motion.button
          type="button"
          whileTap={{ scale: 0.95 }}
          disabled={!canStep}
          className="rounded-lg border border-white/10 bg-white/5 p-2.5 text-slate-200 transition hover:bg-white/10 disabled:opacity-30"
          title={s.playing ? "Pause" : "Play"}
          onClick={() => s.setPlaying(!s.playing)}
        >
          {s.playing ? <Pause className="h-4 w-4" /> : <Play className="h-4 w-4" />}
        </motion.button>
        <button
          type="button"
          disabled={!canStep}
          className="rounded-lg border border-white/10 bg-white/5 p-2.5 text-slate-200 hover:bg-white/10 disabled:opacity-30"
          title="Step back"
          onClick={() => s.setStepIndex(Math.max(0, s.stepIndex - 1))}
        >
          <StepBack className="h-4 w-4" />
        </button>
        <button
          type="button"
          disabled={!canStep}
          className="rounded-lg border border-white/10 bg-white/5 p-2.5 text-slate-200 hover:bg-white/10 disabled:opacity-30"
          title="Step forward"
          onClick={() => s.setStepIndex(Math.min(maxIdx, s.stepIndex + 1))}
        >
          <StepForward className="h-4 w-4" />
        </button>
        <button
          type="button"
          disabled={!canStep}
          className="rounded-lg border border-white/10 bg-white/5 p-2.5 text-slate-200 hover:bg-white/10 disabled:opacity-30"
          title="First step"
          onClick={() => s.setStepIndex(0)}
        >
          <SkipBack className="h-4 w-4" />
        </button>
        <button
          type="button"
          disabled={!canStep}
          className="rounded-lg border border-white/10 bg-white/5 p-2.5 text-slate-200 hover:bg-white/10 disabled:opacity-30"
          title="Last step"
          onClick={() => s.setStepIndex(maxIdx)}
        >
          <SkipForward className="h-4 w-4" />
        </button>
        <div className="ml-auto flex items-center gap-2 text-xs text-slate-500">
          <span className="tabular-nums text-slate-300">
            {total ? s.stepIndex + 1 : 0} / {total}
          </span>
        </div>
      </div>
      <div className="flex items-center gap-3">
        <span className="shrink-0 text-[10px] uppercase tracking-wider text-slate-600">Speed</span>
        <input
          type="range"
          min={80}
          max={2200}
          step={40}
          value={s.speedMs}
          onChange={(e) => s.setSpeedMs(Number(e.target.value))}
          className="h-1 flex-1 accent-cyan-500"
        />
        <span className="w-12 text-right text-[11px] tabular-nums text-slate-400">{s.speedMs}ms</span>
      </div>
      <div>
        <input
          type="range"
          min={0}
          max={maxIdx}
          step={1}
          value={total ? s.stepIndex : 0}
          disabled={!canStep}
          onChange={(e) => s.setStepIndex(Number(e.target.value))}
          className="w-full accent-violet-500 disabled:opacity-30"
        />
      </div>
    </div>
  );
}
