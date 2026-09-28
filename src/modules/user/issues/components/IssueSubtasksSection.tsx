import { useState } from "react";
import {
  Plus,
  CheckCircle2,
  Circle,
  Loader2,
  GitCommit,
  X,
} from "lucide-react";
import { useIssueSubtasks } from "../api/issueQueries";
import { useCreateIssueSubtask } from "../api/issueMutations";
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
}: IssueSubtasksSectionProps) {
  const [isCreating, setIsCreating] = useState(false);
  const [subtaskTitle, setSubtaskTitle] = useState("");

  const { data, isLoading } = useIssueSubtasks({
    subdomain,
    projectSlug,
    issueId,
    params: { sort: "position" },
  });

  const { mutate: createSubtask, isPending } = useCreateIssueSubtask();

  const subtasks = data?.results || [];
  const completedCount = subtasks.filter(
    (s) =>
      s.status_name?.toLowerCase().includes("done") ||
      s.status_name?.toLowerCase().includes("closed"),
  ).length;

  const handleCreate = () => {
    const trimmed = subtaskTitle.trim();
    if (!trimmed || isPending) return;

    createSubtask(
      {
        subdomain,
        projectSlug,
        data: {
          issue_type: "subtask",
          title: trimmed,
          parent_id: Number(issueId),
          priority: "medium",
        },
      },
      {
        onSuccess: () => {
          setSubtaskTitle("");
          setIsCreating(false);
        },
      },
    );
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      e.preventDefault();
      handleCreate();
    }
    if (e.key === "Escape") {
      setIsCreating(false);
      setSubtaskTitle("");
    }
  };

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

        {!isCreating && (
          <button
            type="button"
            onClick={() => setIsCreating(true)}
            className="flex items-center gap-1 text-[11px] text-amber-500 hover:text-amber-400 transition-colors cursor-pointer"
          >
            <Plus className="h-3 w-3" />
            <span>Add Subtask</span>
          </button>
        )}
      </div>

      {isCreating && (
        <div className="p-2 bg-black/60 border border-amber-500/30 rounded-xs flex items-center gap-2 animate-in fade-in zoom-in-95 duration-150">
          <div className="flex items-center gap-1.5 px-2 py-1 bg-amber-500/10 border border-amber-500/20 text-amber-500 text-[10px] uppercase font-semibold rounded-xs shrink-0 select-none">
            <GitCommit className="h-3 w-3" />
            <span>Subtask</span>
          </div>

          <input
            autoFocus
            type="text"
            value={subtaskTitle}
            onChange={(e) => setSubtaskTitle(e.target.value)}
            onKeyDown={handleKeyDown}
            disabled={isPending}
            placeholder="What needs to be done? (Press Enter to add, Esc to cancel)"
            className="flex-1 bg-transparent text-xs text-white placeholder:text-zinc-600 outline-none font-sans"
          />

          <div className="flex items-center gap-1 shrink-0">
            <button
              type="button"
              disabled={!subtaskTitle.trim() || isPending}
              onClick={handleCreate}
              className="h-6 px-2.5 bg-amber-500 text-black hover:bg-amber-400 text-[10px] font-semibold rounded-xs transition-colors disabled:opacity-40"
            >
              {isPending ? <Loader2 className="h-3 w-3 animate-spin" /> : "Add"}
            </button>
            <button
              type="button"
              onClick={() => {
                setIsCreating(false);
                setSubtaskTitle("");
              }}
              className="h-6 w-6 flex items-center justify-center text-zinc-500 hover:text-white rounded-xs"
            >
              <X className="h-3 w-3" />
            </button>
          </div>
        </div>
      )}

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
        <div className="border border-white/10 bg-black/40 rounded-xs overflow-hidden">
          <div className="grid grid-cols-12 px-3 py-1.5 border-b border-white/10 bg-white/5 text-[10px] uppercase font-semibold text-zinc-500 tracking-wider">
            <span className="col-span-2">Key</span>
            <span className="col-span-6">Title</span>
            <span className="col-span-2 text-center">Priority</span>
            <span className="col-span-2 text-right">Assignee</span>
          </div>

          <div className="divide-y divide-white/5">
            {subtasks.map((subtask) => {
              const isDone =
                subtask.status_name?.toLowerCase().includes("done") ||
                subtask.status_name?.toLowerCase().includes("closed");
              const priorityConfig =
                WORK_ITEM_PRIORITIES.find(
                  (p) => p.value === subtask.priority,
                ) ?? WORK_ITEM_PRIORITIES[2];

              return (
                <div
                  key={subtask.id}
                  onClick={() => onSelectSubtask(subtask)}
                  className="grid grid-cols-12 items-center px-3 py-2 hover:bg-white/5 cursor-pointer transition-colors group text-xs"
                >
                  <div className="col-span-2 flex items-center gap-1.5 min-w-0">
                    {isDone ? (
                      <CheckCircle2 className="h-3 w-3 text-emerald-400 shrink-0" />
                    ) : (
                      <Circle className="h-3 w-3 text-zinc-600 group-hover:text-zinc-400 shrink-0" />
                    )}
                    <span className="font-mono text-amber-500 text-[11px] truncate">
                      {subtask.key}
                    </span>
                  </div>

                  <span
                    className={`col-span-6 font-sans truncate pr-2 ${
                      isDone ? "line-through text-zinc-500" : "text-zinc-200"
                    }`}
                  >
                    {subtask.title}
                  </span>

                  <div className="col-span-2 flex items-center justify-center gap-1.5">
                    <span
                      className="h-1.5 w-1.5 rounded-full"
                      style={{ backgroundColor: priorityConfig.color }}
                    />
                    <span className="capitalize text-[10px] text-zinc-400 font-sans">
                      {subtask.priority}
                    </span>
                  </div>

                  <div className="col-span-2 text-right truncate">
                    <span className="text-[10px] text-zinc-400 font-sans">
                      {subtask.assignee_id
                        ? (subtask as any).assignee_name || "Assigned"
                        : "—"}
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}
