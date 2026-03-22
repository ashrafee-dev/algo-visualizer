import { motion } from "framer-motion";
import type { Step } from "../../types/api";

export function CustomVisualizer({ step }: { step: Step | null }) {
  const snap = step?.snapshot ?? {};
  const keys = Object.keys(snap);

  return (
    <div className="glass-panel flex h-full flex-col rounded-2xl p-5 sm:p-6">
      <div className="mb-3 flex items-center justify-between">
        <span className="text-xs font-medium uppercase tracking-wider text-slate-500">Custom snapshot</span>
        <span className="rounded-full border border-white/10 bg-white/5 px-2 py-0.5 text-[10px] text-slate-400">{step?.type ?? "—"}</span>
      </div>
      <motion.pre
        layout
        className="min-h-0 flex-1 overflow-auto rounded-xl border border-white/10 bg-black/35 p-4 font-mono text-[11px] leading-relaxed text-slate-200 shadow-inner"
      >
        {keys.length ? JSON.stringify(snap, null, 2) : "No snapshot for this step."}
      </motion.pre>
      {Object.keys(step?.highlights ?? {}).length > 0 && (
        <div className="mt-3 rounded-xl border border-cyan-500/20 bg-cyan-500/5 p-3 text-[11px] text-cyan-100/90">
          <div className="mb-1 text-[10px] uppercase text-cyan-400/70">Highlights</div>
          {JSON.stringify(step?.highlights, null, 2)}
        </div>
      )}
    </div>
  );
}
