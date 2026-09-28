import { useState } from "react";
import { Plus, CheckCircle2, Circle, Loader2 } from "lucide-react";
import { useIssueSubtasks } from "../api/issueQueries";
import { WORK_ITEM_PRIORITIES } from "../constants";
import type { IssueItem } from "../types";

interface IssueSubtasksSectionProps {
  subdomain: string;
  projectSlug: string;
  issueId: number | string;
  onSelectSubtask: (subtask: IssueItem) => void;
  onOpenCreateSubtask?: () => void;
}

export function IssueSubtasksSection({
  subdomain,
  projectSlug,
  issueId,
  onSelectSubtask,
  onOpenCreateSubtask,
}: IssueSubtasksSectionProps) {
  const [search] = useState("");
  const { data, isLoading } = useIssueSubtasks({
    subdomain,
    projectSlug,
    issueId,
    params: { search: search || undefined, sort: "position" },
  });

  const subtasks = data?.results || [];
  const completedCount = subtasks.filter(
    (s) =>
      s.status_name?.toLowerCase().includes("done") ||
      s.status_name?.toLowerCase().includes("closed"),
  ).length;

  return (
    <div className="space-y-2.5">
      <div className="flex items-center justify-between text-zinc-400">
        <div className="flex items-center gap-2">
          <span className="text-[10px] font-semibold uppercase tracking-wider">
            Subtasks
          </span>
          {subtasks.length > 0 && (
            <span className="text-[10px] font-mono text-zinc-500">
              {completedCount}/{subtasks.length}
            </span>
          )}
        </div>

        {onOpenCreateSubtask && (
          <button
            type="button"
            onClick={onOpenCreateSubtask}
            className="flex items-center gap-1 text-[11px] text-amber-500 hover:text-amber-400 transition-colors"
          >
            <Plus className="h-3 w-3" />
            <span>Add</span>
          </button>
        )}
      </div>

      {isLoading ? (
        <div className="flex items-center justify-center py-4 text-xs text-zinc-500 gap-1.5">
          <Loader2 className="h-3.5 w-3.5 animate-spin text-amber-500" />
          <span>Loading subtasks...</span>
        </div>
      ) : subtasks.length === 0 ? (
        <div className="p-3 border border-dashed border-white/10 rounded-xs text-center text-zinc-600 text-[11px] font-sans">
          No subtasks yet.
        </div>
      ) : (
        <div className="border border-white/5 bg-black/40 rounded-xs divide-y divide-white/5 overflow-hidden">
          {subtasks.map((subtask) => {
            const isDone =
              subtask.status_name?.toLowerCase().includes("done") ||
              subtask.status_name?.toLowerCase().includes("closed");
            const priorityConfig =
              WORK_ITEM_PRIORITIES.find((p) => p.value === subtask.priority) ??
              WORK_ITEM_PRIORITIES[2];

            return (
              <div
                key={subtask.id}
                onClick={() => onSelectSubtask(subtask)}
                className="flex items-center justify-between px-3 py-2 hover:bg-white/5 cursor-pointer transition-colors group"
              >
                <div className="flex items-center gap-2.5 min-w-0">
                  {isDone ? (
                    <CheckCircle2 className="h-3.5 w-3.5 text-emerald-400 shrink-0" />
                  ) : (
                    <Circle className="h-3.5 w-3.5 text-zinc-600 group-hover:text-zinc-400 shrink-0" />
                  )}
                  <span className="font-mono text-amber-500 text-[11px] shrink-0">
                    {subtask.key}
                  </span>
                  <span
                    className={`text-xs font-sans truncate ${
                      isDone ? "line-through text-zinc-500" : "text-zinc-200"
                    }`}
                  >
                    {subtask.title}
                  </span>
                </div>

                <div className="flex items-center gap-2 shrink-0">
                  <span
                    className="h-1.5 w-1.5 rounded-full"
                    style={{ backgroundColor: priorityConfig.color }}
                  />
                  <span className="text-[10px] text-zinc-400 font-sans px-1.5 py-0.5 rounded-xs bg-white/5 border border-white/10">
                    {subtask.status_name}
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
