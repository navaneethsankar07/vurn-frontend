import { format, parseISO } from "date-fns";
import type { SprintInfo } from "../types";

interface IssueCurrentSprintCardProps {
  sprint: SprintInfo | null;
}

export function IssueCurrentSprintCard({
  sprint,
}: IssueCurrentSprintCardProps) {
  if (!sprint) return null;

  const formatDate = (dateStr: string) => {
    try {
      return format(parseISO(dateStr), "MMM d, yyyy");
    } catch {
      return dateStr;
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status.toLowerCase()) {
      case "active":
        return "bg-amber-500/10 border-amber-500/30 text-amber-400";
      case "completed":
      case "closed":
        return "bg-emerald-500/10 border-emerald-500/30 text-emerald-400";
      default:
        return "bg-zinc-500/10 border-zinc-500/30 text-zinc-400";
    }
  };

  return (
    <div className="space-y-2">
      <span className="text-[10px] font-semibold uppercase tracking-wider text-zinc-400 block">
        Current Sprint
      </span>

      <div className="p-3 bg-black/40 border border-white/5 rounded-xs space-y-2.5 font-mono">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2 min-w-0">
            <div className="h-1.5 w-1.5 rounded-full bg-amber-500 shadow-[0_0_8px_rgba(245,158,11,0.5)] shrink-0" />
            <span className="text-xs font-semibold text-white truncate">
              {sprint.name}
            </span>
          </div>
          <span
            className={`px-1.5 py-0.5 border text-[9px] font-bold uppercase tracking-wider rounded-xs shrink-0 ${getStatusBadge(
              sprint.status,
            )}`}
          >
            {sprint.status}
          </span>
        </div>

        <div className="text-[11px] text-zinc-500 font-mono pt-2 border-t border-white/5 flex items-center justify-between">
          <span>Timeline</span>
          <span className="text-zinc-400">
            {formatDate(sprint.start_date)} — {formatDate(sprint.end_date)}
          </span>
        </div>
      </div>
    </div>
  );
}
