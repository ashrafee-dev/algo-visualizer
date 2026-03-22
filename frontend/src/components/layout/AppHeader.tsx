import { motion } from "framer-motion";
import { Search, Sparkles } from "lucide-react";
import { useAppStore } from "../../store/useAppStore";

export function AppHeader() {
  const s = useAppStore();
  return (
    <motion.header
      initial={{ opacity: 0, y: -8 }}
      animate={{ opacity: 1, y: 0 }}
      className="z-30 shrink-0 border-b border-white/[0.08] bg-slate-950/50 backdrop-blur-2xl"
    >
      <div className="mx-auto flex max-w-[1720px] items-center gap-3 px-4 py-2.5 sm:gap-4 sm:px-5">
        <div className="flex items-center gap-2.5">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-br from-cyan-400/30 to-violet-500/25 ring-1 ring-white/15">
            <Sparkles className="h-4 w-4 text-cyan-200" />
          </div>
          <h1 className="text-sm font-semibold tracking-tight text-white">Algorithm Lab</h1>
        </div>

        <div className="relative min-w-[140px] flex-1">
          <Search className="pointer-events-none absolute left-3 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-slate-500" />
          <input
            className="w-full rounded-lg border border-white/10 bg-white/[0.06] py-1.5 pl-9 pr-3 text-sm text-slate-100 outline-none ring-cyan-500/30 placeholder:text-slate-600 focus:border-cyan-500/40 focus:ring-2"
            placeholder="Search…"
            value={s.search}
            onChange={(e) => s.setSearch(e.target.value)}
          />
        </div>

        <select
          className="rounded-lg border border-white/10 bg-slate-900/80 px-2.5 py-1.5 text-xs text-slate-200 outline-none focus:border-cyan-500/40"
          value={s.category}
          onChange={(e) => s.setCategory(e.target.value)}
        >
          {s.categories.map((c) => (
            <option key={c} value={c}>{c}</option>
          ))}
        </select>
        <select
          className="rounded-lg border border-white/10 bg-slate-900/80 px-2.5 py-1.5 text-xs text-slate-200 outline-none focus:border-cyan-500/40"
          value={s.statusFilter}
          onChange={(e) => s.setStatusFilter(e.target.value as "all" | "implemented" | "todo")}
        >
          <option value="all">All</option>
          <option value="implemented">Implemented</option>
          <option value="todo">Coming soon</option>
        </select>
      </div>
    </motion.header>
  );
}
