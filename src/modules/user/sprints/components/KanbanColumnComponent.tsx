import { useState } from "react";
import { Plus, MoreHorizontal, Loader2 } from "lucide-react";
import type { KanbanColumn, KanbanColumnIssuesParams } from "../types";
import { useColumnIssues } from "../api/sprintQueries";
import {
  useMoveIssueStatus,
  useUpdateIssuePosition,
} from "../api/sprintMutations";
import { KanbanCard } from "./KanbanCard";

interface KanbanColumnProps {
  subdomain: string;
  projectSlug: string;
  column: KanbanColumn;
  filters: KanbanColumnIssuesParams;
  onAddIssue?: (statusId: number) => void;
}

export function KanbanColumnComponent({
  subdomain,
  projectSlug,
  column,
  filters,
  onAddIssue,
}: KanbanColumnProps) {
  const [isDragOver, setIsDragOver] = useState(false);

  const { data, isLoading, isError } = useColumnIssues(
    subdomain,
    projectSlug,
    column.id,
    filters,
  );

  const { mutate: moveStatus } = useMoveIssueStatus();
  const { mutate: updatePosition } = useUpdateIssuePosition();

  const issues = data?.results || [];

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = "move";
    setIsDragOver(true);
  };

  const handleDragLeave = () => {
    setIsDragOver(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);

    const rawData = e.dataTransfer.getData("application/json");
    if (!rawData) return;

    const { issueId, fromStatusId, currentIndex } = JSON.parse(rawData);

    if (fromStatusId !== column.id) {
      moveStatus({
        subdomain,
        projectSlug,
        issueId,
        status_id: column.id,
        from_status_id: fromStatusId,
      });
      return;
    }

    const dropTarget = (e.target as HTMLElement).closest("[data-issue-index]");
    if (dropTarget) {
      const targetIndex = Number(dropTarget.getAttribute("data-issue-index"));
      if (!isNaN(targetIndex) && targetIndex !== currentIndex) {
        updatePosition({
          subdomain,
          projectSlug,
          issueId,
          status_id: column.id,
          position: targetIndex,
        });
      }
    }
  };

  return (
    <div
      onDragOver={handleDragOver}
      onDragLeave={handleDragLeave}
      onDrop={handleDrop}
      className={`flex-1 min-w-70 max-w-85 flex flex-col bg-black/40 border rounded-xs font-mono select-none transition-colors ${
        isDragOver ? "border-amber-500/50 bg-amber-500/5" : "border-white/10"
      }`}
    >
      <div className="flex items-center justify-between p-3 border-b border-white/10 bg-[#09090B]">
        <div className="flex items-center gap-2 min-w-0">
          <span
            className="h-2 w-2 rounded-full shrink-0"
            style={{ backgroundColor: column.color || "#71717A" }}
          />
          <h3 className="text-xs font-bold text-white tracking-wide truncate">
            {column.name}
          </h3>
          <span className="text-[10px] bg-zinc-800 text-zinc-400 px-1.5 py-0.2 rounded-xs border border-white/5">
            {data?.count ?? 0}
          </span>
        </div>
        <button
          type="button"
          className="p-1 text-zinc-400 hover:text-white rounded-xs transition-colors"
        >
          <MoreHorizontal className="h-3.5 w-3.5" />
        </button>
      </div>

      <div className="flex-1 p-2 space-y-2 overflow-y-auto max-h-[calc(100vh-280px)] min-h-35">
        {isLoading ? (
          <div className="flex items-center justify-center h-24 text-zinc-500 text-xs gap-1.5">
            <Loader2 className="h-3.5 w-3.5 animate-spin text-amber-500" />
            <span>Loading...</span>
          </div>
        ) : isError ? (
          <div className="text-center text-[11px] text-red-400 p-2 font-sans">
            Failed to load column cards.
          </div>
        ) : issues.length === 0 ? (
          <div className="h-20 border border-dashed border-white/5 rounded-xs flex items-center justify-center text-zinc-600 text-[11px]">
            No issues
          </div>
        ) : (
          issues.map((issue, idx) => (
            <KanbanCard key={issue.id} issue={issue} index={idx} />
          ))
        )}
      </div>

      <div className="p-2 border-t border-white/10 bg-[#09090B]/50">
        <button
          type="button"
          onClick={() => onAddIssue?.(column.id)}
          className="w-full flex items-center gap-1.5 text-xs text-zinc-400 hover:text-white hover:bg-white/10 p-1.5 rounded-xs transition-colors"
        >
          <Plus className="h-3.5 w-3.5" />
          <span>Add issue</span>
        </button>
      </div>
    </div>
  );
}
