import { motion } from "framer-motion";
import { Wand2, X } from "lucide-react";
import { PythonMonaco } from "../editor/PythonMonaco";
import { useAppStore } from "../../store/useAppStore";

export function EditorPanel() {
  const s = useAppStore();
  const meta = s.selected?.metadata;
  const step = s.runResult?.steps[s.stepIndex] ?? null;
  const readOnly = meta?.status !== "implemented";

  return (
    <div className="glass-panel flex h-full flex-col overflow-hidden rounded-2xl">
      {/* Header */}
      <div className="border-b border-white/[0.06] px-3 py-2.5">
        <h2 className="text-sm font-semibold tracking-tight text-white">{meta?.name ?? "Select an algorithm"}</h2>
        {meta && (
          <div className="mt-1.5 flex flex-wrap gap-1 text-[10px]">
            <span className="rounded-md border border-white/10 bg-white/5 px-1.5 py-0.5 text-slate-300">{meta.time_complexity}</span>
            <span className="rounded-md border border-white/10 bg-white/5 px-1.5 py-0.5 text-slate-300">{meta.space_complexity}</span>
            {meta.tags?.map((t) => (
              <span key={t} className="rounded-md border border-cyan-500/15 bg-cyan-500/5 px-1.5 py-0.5 text-cyan-200/80">{t}</span>
            ))}
          </div>
        )}
      </div>

      {/* Input JSON */}
      <div className="flex items-center gap-2 border-b border-white/[0.06] px-3 py-1.5">
        <span className="shrink-0 text-[10px] font-semibold uppercase tracking-wider text-slate-500">Input</span>
        <input
          className="min-w-0 flex-1 rounded-md border border-white/10 bg-black/35 px-2 py-1 font-mono text-[11px] text-slate-200 outline-none ring-cyan-500/20 focus:border-cyan-500/30 focus:ring-1"
          value={s.inputJson}
          onChange={(e) => s.setInputJson(e.target.value)}
          spellCheck={false}
        />
        <button
          type="button"
          className="shrink-0 rounded-md border border-white/10 p-1 text-slate-400 transition hover:bg-white/5 hover:text-slate-200"
          title="Load preset"
          onClick={() => {
            const ex = meta?.example_inputs?.[0];
            s.setInputJson(JSON.stringify(ex ?? meta?.default_input ?? {}));
          }}
        >
          <Wand2 className="h-3 w-3" />
        </button>
      </div>

      {/* Error */}
      {s.runError && (
        <motion.div
          initial={{ opacity: 0, y: 4 }}
          animate={{ opacity: 1, y: 0 }}
          className="mx-2 mt-2 flex items-start gap-2 rounded-lg border border-rose-500/30 bg-rose-500/10 px-3 py-1.5 text-xs text-rose-100"
        >
          <span className="flex-1">{s.runError}</span>
          <button type="button" className="rounded p-0.5 hover:bg-white/10" onClick={() => s.clearRunError()} aria-label="Dismiss">
            <X className="h-3 w-3" />
          </button>
        </motion.div>
      )}

      {/* Code editor — fills remaining space */}
      <div className="min-h-0 flex-1">
        <PythonMonaco value={s.editedCode} readOnly={readOnly} highlightLine={step?.line} onChange={(v) => s.setEditedCode(v)} />
      </div>
    </div>
  );
}
