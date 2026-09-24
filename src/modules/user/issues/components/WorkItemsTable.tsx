import {
  MoreHorizontal,
  ChevronLeft,
  ChevronRight,
  ArrowUp,
  ArrowDown,
  Minus,
  AlertCircle,
} from "lucide-react";
import type { IssueItem, WorkItemPriority } from "../types";
import { WORK_ITEM_TYPES } from "../constants";
import { formatRelativeTime } from "@/utils/sprintHelpers";

interface WorkItemsTableProps {
  issues: IssueItem[];
  totalCount: number;
  currentPage: number;
  pageSize: number;
  onPageChange: (page: number) => void;
  onSelectIssue?: (issue: IssueItem) => void;
}

const getPriorityVisual = (priority: WorkItemPriority) => {
  switch (priority) {
    case "urgent":
      return (
        <span className="flex items-center gap-1.5 text-red-400">
          <AlertCircle className="h-3 w-3 shrink-0" />
          <span className="capitalize">{priority}</span>
        </span>
      );
    case "high":
      return (
        <span className="flex items-center gap-1.5 text-amber-400">
          <ArrowUp className="h-3 w-3 shrink-0" />
          <span className="capitalize">{priority}</span>
        </span>
      );
    case "medium":
      return (
        <span className="flex items-center gap-1.5 text-blue-400">
          <Minus className="h-3 w-3 shrink-0" />
          <span className="capitalize">{priority}</span>
        </span>
      );
    case "low":
    default:
      return (
        <span className="flex items-center gap-1.5 text-zinc-500">
          <ArrowDown className="h-3 w-3 shrink-0" />
          <span className="capitalize">{priority}</span>
        </span>
      );
  }
};

export function WorkItemsTable({
  issues,
  totalCount,
  currentPage,
  pageSize,
  onPageChange,
  onSelectIssue,
}: WorkItemsTableProps) {
  const totalPages = Math.ceil(totalCount / pageSize);

  return (
    <div className="border border-white/10 bg-[#09090B] rounded-xs font-mono overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full text-left text-xs">
          <thead className="bg-black/60 border-b border-white/10 text-zinc-400 uppercase text-[10px] tracking-wider select-none">
            <tr>
              <th className="py-3 px-4 font-semibold w-24">Key</th>
              <th className="py-3 px-4 font-semibold">Title</th>
              <th className="py-3 px-4 font-semibold w-32">Status</th>
              <th className="py-3 px-4 font-semibold w-28">Priority</th>
              <th className="py-3 px-4 font-semibold w-24">Points</th>
              <th className="py-3 px-4 font-semibold w-32">Updated</th>
              <th className="py-3 px-4 font-semibold w-12 text-right"></th>
            </tr>
          </thead>
          <tbody className="divide-y divide-white/5 font-sans">
            {issues.length === 0 ? (
              <tr>
                <td
                  colSpan={7}
                  className="text-center py-12 text-zinc-500 font-mono"
                >
                  No work items match the selected criteria.
                </td>
              </tr>
            ) : (
              issues.map((item) => {
                const typeConfig =
                  WORK_ITEM_TYPES.find((t) => t.value === item.issue_type) ??
                  WORK_ITEM_TYPES[2];
                const TypeIcon = typeConfig.icon;

                return (
                  <tr
                    key={item.id}
                    onClick={() => onSelectIssue?.(item)}
                    className="hover:bg-white/[0.02] cursor-pointer transition-colors group"
                  >
                    <td className="py-3 px-4 font-mono font-semibold text-amber-500">
                      <div className="flex items-center gap-2">
                        <TypeIcon
                          className="h-3.5 w-3.5 shrink-0"
                          style={{ color: typeConfig.color }}
                        />
                        <span>{item.key}</span>
                      </div>
                    </td>
                    <td className="py-3 px-4 text-zinc-200 font-medium max-w-md truncate">
                      {item.title}
                    </td>
                    <td className="py-3 px-4 font-mono">
                      <span className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-xs bg-white/5 border border-white/10 text-[11px] text-zinc-300">
                        <span className="h-1.5 w-1.5 rounded-full bg-amber-500" />
                        {item.status_name || "Status"}
                      </span>
                    </td>
                    <td className="py-3 px-4 font-mono text-[11px]">
                      {getPriorityVisual(item.priority)}
                    </td>
                    <td className="py-3 px-4 font-mono text-zinc-400">
                      {item.story_points !== null &&
                      item.story_points !== undefined ? (
                        <span className="bg-zinc-800 px-1.5 py-0.5 rounded-xs text-[10px] text-zinc-300">
                          {item.story_points} pt
                        </span>
                      ) : (
                        <span className="text-zinc-600">—</span>
                      )}
                    </td>
                    <td className="py-3 px-4 font-mono text-[11px] text-zinc-500">
                      {formatRelativeTime(item.updated_at)}
                    </td>
                    <td className="py-3 px-4 text-right">
                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                        }}
                        className="text-zinc-500 hover:text-white p-1 rounded-xs transition-colors"
                      >
                        <MoreHorizontal className="h-4 w-4" />
                      </button>
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>

      <div className="p-3 border-t border-white/10 bg-black/40 flex items-center justify-between text-xs text-zinc-400 font-mono">
        <div>
          Showing {issues.length} of {totalCount} items
        </div>
        <div className="flex items-center gap-2">
          <button
            type="button"
            disabled={currentPage <= 1}
            onClick={() => onPageChange(currentPage - 1)}
            className="p-1 rounded-xs border border-white/10 hover:bg-white/5 disabled:opacity-40 disabled:pointer-events-none text-zinc-300"
          >
            <ChevronLeft className="h-4 w-4" />
          </button>
          <span>
            {currentPage} / {totalPages || 1}
          </span>
          <button
            type="button"
            disabled={currentPage >= totalPages}
            onClick={() => onPageChange(currentPage + 1)}
            className="p-1 rounded-xs border border-white/10 hover:bg-white/5 disabled:opacity-40 disabled:pointer-events-none text-zinc-300"
          >
            <ChevronRight className="h-4 w-4" />
          </button>
        </div>
      </div>
    </div>
  );
}
