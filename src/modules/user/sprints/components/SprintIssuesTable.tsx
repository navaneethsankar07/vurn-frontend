import { Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import type { SprintIssue } from "../types";

interface SprintIssuesTableProps {
  issues: SprintIssue[];
  onAddIssues: () => void;
}

export function SprintIssuesTable({
  issues,
  onAddIssues,
}: SprintIssuesTableProps) {
  const getStatusBadge = (status: SprintIssue["status"]) => {
    switch (status) {
      case "Done":
        return "text-emerald-400 bg-emerald-500/10 border-emerald-500/20";
      case "In Progress":
        return "text-amber-400 bg-amber-500/10 border-amber-500/20";
      case "Todo":
      default:
        return "text-zinc-400 bg-zinc-500/10 border-zinc-500/20";
    }
  };

  const getPriorityBadge = (priority: SprintIssue["priority"]) => {
    switch (priority) {
      case "High":
        return "text-red-400 bg-red-500/10 border-red-500/20";
      case "Medium":
        return "text-amber-400 bg-amber-500/10 border-amber-500/20";
      case "Low":
      default:
        return "text-zinc-400 bg-zinc-500/10 border-zinc-500/20";
    }
  };

  return (
    <div className="bg-[#09090B] border border-white/10 rounded-xs p-4 space-y-4">
      <div className="flex items-center justify-between border-b border-white/5 pb-2">
        <h2 className="text-xs font-bold text-white uppercase tracking-wider">
          Sprint Issues
        </h2>
        <Button
          size="sm"
          variant="outline"
          onClick={onAddIssues}
          className="h-7 text-[11px] border-white/10 bg-black text-zinc-300 hover:bg-zinc-900 hover:text-white rounded-xs gap-1"
        >
          <Plus className="h-3 w-3" />
          Add Issues
        </Button>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-left text-xs border-collapse">
          <thead>
            <tr className="border-b border-white/10 text-zinc-500 uppercase tracking-wider text-[10px]">
              <th className="py-2 px-2 font-semibold">Key</th>
              <th className="py-2 px-2 font-semibold">Title</th>
              <th className="py-2 px-2 font-semibold">Status</th>
              <th className="py-2 px-2 font-semibold">Priority</th>
              <th className="py-2 px-2 font-semibold">Assignee</th>
              <th className="py-2 px-2 font-semibold text-center">SP</th>
              <th className="py-2 px-2 font-semibold text-right">Updated</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-white/5 font-sans">
            {issues.map((issue) => (
              <tr
                key={issue.key}
                className="hover:bg-white/2 transition-colors"
              >
                <td className="py-2.5 px-2 font-mono font-semibold text-amber-500 text-[11px]">
                  {issue.key}
                </td>
                <td className="py-2.5 px-2 text-zinc-200 font-medium">
                  {issue.title}
                </td>
                <td className="py-2.5 px-2">
                  <span
                    className={`text-[10px] px-1.5 py-0.5 border rounded-xs font-mono font-semibold ${getStatusBadge(
                      issue.status,
                    )}`}
                  >
                    {issue.status}
                  </span>
                </td>
                <td className="py-2.5 px-2">
                  <span
                    className={`text-[10px] px-1.5 py-0.5 border rounded-xs font-mono font-semibold ${getPriorityBadge(
                      issue.priority,
                    )}`}
                  >
                    {issue.priority}
                  </span>
                </td>
                <td className="py-2.5 px-2 text-zinc-300">
                  <div className="flex items-center gap-1.5">
                    <div className="h-4 w-4 rounded-xs bg-amber-500/20 text-amber-400 flex items-center justify-center text-[9px] font-mono font-bold">
                      {issue.assignee.name.charAt(0)}
                    </div>
                    <span>{issue.assignee.name}</span>
                  </div>
                </td>
                <td className="py-2.5 px-2 text-center font-mono text-zinc-400">
                  {issue.storyPoints}
                </td>
                <td className="py-2.5 px-2 text-right text-zinc-500 text-[11px] font-mono">
                  {issue.updatedAt}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
