import { format, parseISO } from "date-fns";
import { Target, Calendar } from "lucide-react";
import type { ActiveSprint } from "../types";

export function ActiveSprints({ sprints = [] }: { sprints?: ActiveSprint[] }) {
  if (!sprints || sprints.length === 0) return null;

  return (
    <div className="space-y-3 font-mono">
      <h3 className="text-[10px] font-semibold uppercase tracking-wider text-zinc-400">
        Active Sprints ({sprints.length})
      </h3>

      <div className="space-y-2">
        {sprints.map((sprint) => {
          const startDate = sprint.start_date
            ? format(parseISO(sprint.start_date), "MMM d, yyyy")
            : "TBD";
          const endDate = sprint.end_date
            ? format(parseISO(sprint.end_date), "MMM d, yyyy")
            : "TBD";

          return (
            <div
              key={sprint.id}
              className="rounded-xs border border-white/5 bg-black/40 p-3 space-y-2.5 hover:bg-white/5 transition-colors"
            >
              <div className="flex items-start justify-between gap-4">
                <div className="space-y-1.5 min-w-0">
                  <div className="flex items-center gap-2">
                    <span className="rounded-xs bg-white/10 px-1.5 py-0.5 text-[9px] font-bold text-zinc-300 uppercase tracking-wider truncate max-w-30">
                      {sprint.project_name}
                    </span>
                    <h4 className="text-xs font-bold text-white truncate">
                      {sprint.name}
                    </h4>
                  </div>
                  {sprint.goal && (
                    <div className="flex items-start gap-1.5 text-zinc-400">
                      <Target className="h-3 w-3 shrink-0 mt-0.5 text-amber-500" />
                      <p className="text-[10px] font-sans line-clamp-2 leading-relaxed">
                        {sprint.goal}
                      </p>
                    </div>
                  )}
                </div>
                <span className="text-[9px] px-1.5 py-0.5 rounded-xs border font-semibold border-emerald-500/30 bg-emerald-500/10 text-emerald-400 uppercase tracking-wider shrink-0">
                  {sprint.status}
                </span>
              </div>

              <div className="flex items-center gap-1.5 text-[10px] text-zinc-500 pt-1.5 border-t border-white/5">
                <Calendar className="h-3 w-3" />
                <span>
                  {startDate} — {endDate}
                </span>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
