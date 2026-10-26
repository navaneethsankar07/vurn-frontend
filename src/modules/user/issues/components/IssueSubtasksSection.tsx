import { useState } from "react";
import {
  Plus,
  CheckCircle2,
  Circle,
  Loader2,
  X,
  ChevronDown,
} from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useIssueSubtasks } from "../api/issueQueries";
import {
  useCreateIssueSubtask,
  useUpdateProjectIssue,
} from "../api/issueMutations";
import { useProjectMembers } from "../../projects/api/projectQueries";
import { WORK_ITEM_PRIORITIES, WORK_ITEM_TYPES } from "../constants";
import type { IssueItem, WorkItemPriority } from "../types";

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

  const { data, isLoading, isFetchingNextPage, fetchNextPage, hasNextPage } =
    useIssueSubtasks({
      subdomain,
      projectSlug,
      issueId,
      params: { sort: "position" },
    });

  const typeConfig =
    WORK_ITEM_TYPES.find((t) => t.value === "subtask") ?? WORK_ITEM_TYPES[2];

  const TypeIcon = typeConfig.icon;

  const { data: membersResponse } = useProjectMembers(subdomain, projectSlug);
  const members = membersResponse?.results || [];

  const { mutate: createSubtask, isPending: isCreatingSubtask } =
    useCreateIssueSubtask();
  const { mutate: updateIssue } = useUpdateProjectIssue();

  const subtasks = data?.pages.flatMap((page) => page.results) ?? [];
  const totalCount = data?.pages[0]?.count ?? 0;
  const remainingCount = Math.max(0, totalCount - subtasks.length);

  const completedCount = subtasks.filter(
    (s) =>
      s.status_name?.toLowerCase().includes("done") ||
      s.status_name?.toLowerCase().includes("closed"),
  ).length;

  const handleCreate = () => {
    const trimmed = subtaskTitle.trim();
    if (!trimmed || isCreatingSubtask) return;

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

  const handlePriorityChange = (
    subtaskId: number,
    priority: WorkItemPriority,
  ) => {
    updateIssue({
      subdomain,
      projectSlug,
      issueId: subtaskId,
      data: { priority },
    });
  };

  const handleAssigneeChange = (subtaskId: number, val: string | null) => {
    const assignee_id = val === "unassigned" ? null : Number(val);
    updateIssue({
      subdomain,
      projectSlug,
      issueId: subtaskId,
      data: { assignee_id },
    });
  };

  return (
    <div className="space-y-2.5">
      <div className="flex items-center justify-between text-zinc-400">
        <div className="flex items-center gap-2">
          <span className="text-[10px] font-semibold uppercase tracking-wider">
            Subtasks
          </span>
          {totalCount > 0 && (
            <span className="text-[10px] font-mono text-zinc-500">
              {completedCount}/{totalCount}
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
          <div className="flex items-center gap-1.5 px-2 py-1 border border-amber-500/20 text-primary/80 text-[10px] uppercase font-semibold rounded-xs shrink-0 select-none">
          <TypeIcon className="h-4 w-4"/>
            <span>Subtask</span>
          </div>

          <input
            autoFocus
            type="text"
            value={subtaskTitle}
            onChange={(e) => setSubtaskTitle(e.target.value)}
            onKeyDown={handleKeyDown}
            disabled={isCreatingSubtask}
            placeholder="What needs to be done? (Press Enter to add, Esc to cancel)"
            className="flex-1 bg-transparent text-xs text-white placeholder:text-zinc-600 outline-none font-sans"
          />

          <div className="flex items-center gap-1 shrink-0">
            <button
              type="button"
              disabled={!subtaskTitle.trim() || isCreatingSubtask}
              onClick={handleCreate}
              className="h-6 px-2.5 bg-amber-500 text-black hover:bg-amber-400 text-[10px] font-semibold rounded-xs transition-colors disabled:opacity-40"
            >
              {isCreatingSubtask ? (
                <Loader2 className="h-3 w-3 animate-spin" />
              ) : (
                "Add"
              )}
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
        <div className="space-y-2">
          <div className="border border-white/10 bg-black/40 rounded-xs overflow-hidden">
            <div className="grid grid-cols-12 px-3 py-1.5 border-b border-white/10 bg-white/5 text-[10px] uppercase font-semibold text-zinc-500 tracking-wider">
              <span className="col-span-2">Key</span>
              <span className="col-span-5">Title</span>
              <span className="col-span-2 text-center">Priority</span>
              <span className="col-span-3 text-right">Assignee</span>
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
                    className="grid grid-cols-12 items-center px-3 py-1.5 hover:bg-white/5 transition-colors group text-xs gap-1"
                  >
                    <div
                      onClick={() => onSelectSubtask(subtask)}
                      className="col-span-2 flex items-center gap-1.5 min-w-0 cursor-pointer"
                    >
                      {isDone ? (
                        <CheckCircle2 className="h-3.5 w-3.5 text-emerald-400 shrink-0" />
                      ) : (
                        <Circle className="h-3.5 w-3.5 text-zinc-600 group-hover:text-zinc-400 shrink-0" />
                      )}
                      <span className="font-mono text-amber-500 hover:underline text-[11px] truncate">
                        {subtask.key}
                      </span>
                    </div>

                    <span
                      onClick={() => onSelectSubtask(subtask)}
                      className={`col-span-5 font-sans truncate pr-2 cursor-pointer hover:text-white transition-colors `}
                    >
                      {subtask.title}
                    </span>

                    <div
                      className="col-span-2 flex items-center justify-center"
                      onClick={(e) => e.stopPropagation()}
                    >
                      <Select
                        value={subtask.priority}
                        onValueChange={(val: string | null) => {
                          if (val) {
                            handlePriorityChange(
                              subtask.id,
                              val as WorkItemPriority,
                            );
                          }
                        }}
                      >
                        <SelectTrigger className="h-6 border-none bg-transparent hover:bg-white/5 text-zinc-300 text-[10px] p-1 gap-1 focus:ring-0">
                          <SelectValue>
                            <div className="flex items-center gap-1">
                              <span
                                className="h-1.5 w-1.5 rounded-full"
                                style={{
                                  backgroundColor: priorityConfig.color,
                                }}
                              />
                              <span className="capitalize">
                                {subtask.priority}
                              </span>
                            </div>
                          </SelectValue>
                        </SelectTrigger>
                        <SelectContent
                          side="bottom"
                          sideOffset={4}
                          alignItemWithTrigger={false}
                          className="bg-[#09090B] border-white/10 text-white font-mono rounded-xs text-xs"
                        >
                          {WORK_ITEM_PRIORITIES.map((p) => (
                            <SelectItem
                              key={p.value}
                              value={p.value}
                              className="cursor-pointer text-zinc-200 focus:bg-white/10 focus:text-white text-xs"
                            >
                              <div className="flex items-center gap-1.5">
                                <span
                                  className="h-1.5 w-1.5 rounded-full"
                                  style={{ backgroundColor: p.color }}
                                />
                                <span>{p.label}</span>
                              </div>
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>

                    <div
                      className="col-span-3 flex items-center justify-end"
                      onClick={(e) => e.stopPropagation()}
                    >
                      <Select
                        value={
                          subtask.assignee_id
                            ? String(subtask.assignee_id)
                            : "unassigned"
                        }
                        onValueChange={(val: string | null) => {
                          handleAssigneeChange(subtask.id, val);
                        }}
                      >
                        <SelectTrigger className="h-6 border-none bg-transparent hover:bg-white/5 text-zinc-400 hover:text-zinc-200 text-[10px] px-1 py-0 focus:ring-0 max-w-full truncate text-right">
                          <SelectValue>
                            <span className="truncate">
                              {subtask.assignee_id
                                ? (subtask as any).assignee_name || "Assigned"
                                : "Unassigned"}
                            </span>
                          </SelectValue>
                        </SelectTrigger>
                        <SelectContent
                          side="bottom"
                          sideOffset={4}
                          alignItemWithTrigger={false}
                          className="bg-[#09090B] border-white/10 text-white font-mono rounded-xs text-xs max-h-56"
                        >
                          <SelectItem
                            value="unassigned"
                            className="cursor-pointer rounded-xs text-zinc-400 focus:bg-white/10 hover:text-white focus:text-white"
                          >
                            Unassigned
                          </SelectItem>
                          {members.map((m: any) => (
                            <SelectItem
                              key={m.id || m.user_id}
                              value={String(m.user_id)}
                              className="cursor-pointer rounded-xs text-white focus:bg-white/10 focus:text-white"
                            >
                              {m.full_name ||
                                m.user?.name ||
                                m.user?.email ||
                                `User #${m.id}`}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {hasNextPage && (
            <div className="text-center pt-1">
              <button
                type="button"
                disabled={isFetchingNextPage}
                onClick={() => fetchNextPage()}
                className="inline-flex items-center gap-1.5 px-3 py-1 bg-white/5 hover:bg-white/10 border border-white/10 text-zinc-300 hover:text-white rounded-xs text-[11px] font-mono transition-colors disabled:opacity-40 cursor-pointer"
              >
                {isFetchingNextPage ? (
                  <Loader2 className="h-3 w-3 animate-spin" />
                ) : (
                  <ChevronDown className="h-3 w-3" />
                )}
                <span>
                  Show more subtasks{" "}
                  {remainingCount > 0 ? `(${remainingCount} remaining)` : ""}
                </span>
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
