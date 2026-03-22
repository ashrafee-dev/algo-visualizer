import { motion } from "framer-motion";
import { useAppStore } from "../../store/useAppStore";

export function AlgorithmSidebar() {
  const s = useAppStore();
  const visible = s.algorithms.filter((a) => {
    const hitSearch =
      a.metadata.name.toLowerCase().includes(s.search.toLowerCase()) ||
      a.metadata.tags.some((t) => t.toLowerCase().includes(s.search.toLowerCase()));
    const hitCategory = s.category === "All" || a.metadata.category === s.category;
    const hitStatus = s.statusFilter === "all" || a.metadata.status === s.statusFilter;
    return hitSearch && hitCategory && hitStatus;
  });

  return (
    <aside className="glass-panel flex h-full flex-col overflow-hidden rounded-2xl">
      <div className="border-b border-white/[0.06] px-4 py-3">
        <h2 className="text-xs font-semibold uppercase tracking-wider text-slate-500">Algorithms</h2>
        <p className="mt-0.5 text-[11px] text-slate-600">{visible.length} shown · from API discovery</p>
      </div>
      <div className="flex-1 space-y-2 overflow-y-auto p-3">
        {visible.map((a, idx) => (
          <motion.button
            key={a.metadata.id}
            initial={{ opacity: 0, x: -6 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: idx * 0.02 }}
            whileHover={{ scale: 1.01 }}
            whileTap={{ scale: 0.99 }}
            onClick={() => void s.selectAlgorithm(a.metadata.id)}
            className={`w-full rounded-xl border p-3 text-left transition ${
              s.selectedId === a.metadata.id
                ? "border-cyan-400/40 bg-gradient-to-br from-cyan-500/15 to-transparent shadow-[0_0_24px_rgba(34,211,238,0.08)]"
                : "border-white/[0.07] bg-white/[0.03] hover:border-white/15 hover:bg-white/[0.05]"
            }`}
          >
            <div className="flex items-start justify-between gap-2">
              <span className="font-medium leading-snug text-slate-100">{a.metadata.name}</span>
              <span
                className={`shrink-0 rounded-full px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wide ${
                  a.metadata.status === "implemented" ? "bg-emerald-500/15 text-emerald-300" : "bg-amber-500/15 text-amber-200"
                }`}
              >
                {a.metadata.status === "implemented" ? "Live" : "Soon"}
              </span>
            </div>
            <div className="mt-1 text-[11px] text-slate-500">{a.metadata.category}</div>
            <p className="mt-2 line-clamp-2 text-xs leading-relaxed text-slate-400">{a.metadata.description}</p>
            <div className="mt-2 flex flex-wrap gap-1">
              {a.metadata.tags.slice(0, 4).map((t) => (
                <span key={t} className="rounded-md border border-white/5 bg-black/20 px-1.5 py-0.5 text-[10px] text-slate-500">
                  {t}
                </span>
              ))}
            </div>
          </motion.button>
        ))}
        {!visible.length && <div className="px-2 py-8 text-center text-sm text-slate-500">No algorithms match filters.</div>}
      </div>
    </aside>
  );
}
