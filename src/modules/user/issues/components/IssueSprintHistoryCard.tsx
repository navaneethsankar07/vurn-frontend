import { Loader2 } from "lucide-react";
import { useIssueSprintHistory } from "../api/issueQueries";
import { format } from "date-fns";

interface IssueSprintHistoryCardProps {
  subdomain: string;
  projectSlug: string;
  issueId: number | string;
}

export function IssueSprintHistoryCard({
  subdomain,
  projectSlug,
  issueId,
}: IssueSprintHistoryCardProps) {
  const { data: history = [], isLoading } = useIssueSprintHistory(
    subdomain,
    projectSlug,
    issueId,
  );

  if (isLoading) {
    return (
      <div className="space-y-2">
        <span className="text-[10px] font-semibold uppercase tracking-wider text-zinc-400 block">
          Sprint History
        </span>
        <div className="p-3 bg-black/40 border border-white/5 rounded-xs flex items-center justify-center text-zinc-500 text-xs gap-2">
          <Loader2 className="h-3.5 w-3.5 animate-spin text-amber-500" />
          <span>Loading sprint history...</span>
        </div>
      </div>
    );
  }

  if (history.length === 0) return null;

  return (
    <div className="space-y-2.5">
      <span className="text-[10px] font-semibold uppercase tracking-wider text-zinc-400 block">
        Sprint History
      </span>

      <div className="p-3.5 bg-black/40 border border-white/5 rounded-xs space-y-3 font-mono">
        {history.map((item, index) => {
          const isLatest = index === history.length - 1;
          const formattedDate = format(new Date(item.moved_at), "MMM d");

          return (
            <div key={`${item.sprint_id}-${index}`} className="relative">
              <div className="flex items-center justify-between text-xs">
                <div className="flex items-center gap-2 min-w-0">
                  <div
                    className={`h-1.5 w-1.5 rounded-full shrink-0 ${
                      isLatest
                        ? "bg-primary shadow-[0_0_8px_rgba(245,158,11,0.5)]"
                        : "bg-zinc-600"
                    }`}
                  />
                  <span
                    className={`truncate font-medium ${
                      isLatest
                        ? "text-text-primary font-semibold"
                        : "text-zinc-400"
                    }`}
                  >
                    {item.sprint_name}
                  </span>
                </div>

                <div className="flex items-center gap-2 shrink-0">
                  <span className="text-[10px] text-zinc-500 font-mono">
                    {formattedDate}
                  </span>
                  {isLatest && (
                    <span className="px-1.5 py-0.5  border border-primary/30 text-[9px] text-primary font-bold uppercase tracking-wider rounded-xs">
                      CURRENT
                    </span>
                  )}
                </div>
              </div>

              {!isLatest && (
                <div className="pl-0.75 py-1 text-zinc-700 text-[10px] select-none leading-none">
                  │
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
