import {
  AlertCircle,
  ArrowUp,
  ArrowDown,
  Minus,
  Bookmark,
  Bug,
  CheckSquare,
  Layers,
} from "lucide-react";
import type { KanbanIssue, IssuePriority, IssueType } from "../types";

interface KanbanCardProps {
  issue: KanbanIssue;
  index: number;
}

const getPriorityIcon = (priority: IssuePriority) => {
  switch (priority) {
    case "urgent":
      return <AlertCircle className="h-3 w-3 text-red-500 shrink-0" />;
    case "high":
      return <ArrowUp className="h-3 w-3 text-amber-500 shrink-0" />;
    case "medium":
      return <Minus className="h-3 w-3 text-blue-400 shrink-0" />;
    case "low":
    default:
      return <ArrowDown className="h-3 w-3 text-zinc-500 shrink-0" />;
  }
};

const getTypeIcon = (type: IssueType) => {
  switch (type) {
    case "bug":
      return <Bug className="h-3 w-3 text-red-400 shrink-0" />;
    case "story":
      return <Bookmark className="h-3 w-3 text-emerald-400 shrink-0" />;
    case "epic":
      return <Layers className="h-3 w-3 text-purple-400 shrink-0" />;
    case "task":
    case "subtask":
    default:
      return <CheckSquare className="h-3 w-3 text-blue-400 shrink-0" />;
  }
};

export function KanbanCard({ issue, index }: KanbanCardProps) {
  const handleDragStart = (e: React.DragEvent) => {
    e.dataTransfer.setData(
      "application/json",
      JSON.stringify({
        issueId: issue.id,
        fromStatusId: issue.status_id,
        currentIndex: index,
      }),
    );
    e.dataTransfer.effectAllowed = "move";
  };

  return (
    <div
      draggable
      onDragStart={handleDragStart}
      data-issue-index={index}
      className="bg-[#09090B] border border-white/10 hover:border-white/20 p-2.5 rounded-xs space-y-2 transition-all text-xs cursor-grab active:cursor-grabbing group active:opacity-40"
    >
      <div className="flex items-center justify-between gap-2">
        <div className="flex items-center gap-1.5 min-w-0">
          {getTypeIcon(issue.issue_type)}
          <span className="font-mono text-amber-500 font-semibold text-[11px] truncate">
            {issue.key}
          </span>
        </div>
        <div className="flex items-center gap-1.5 shrink-0">
          {issue.story_points !== null && issue.story_points !== undefined && (
            <span className="bg-zinc-800 text-zinc-300 px-1.5 py-0.2 rounded-xs font-mono text-[10px] border border-white/5">
              {issue.story_points}pt
            </span>
          )}
          <div
            title={`priority: ${issue.priority}`}
            className="flex items-center gap-1 text-[10px] text-zinc-400 font-mono capitalize cursor-pointer"
          >
            {getPriorityIcon(issue.priority)}
          </div>
        </div>
      </div>

      <p className="text-zinc-200 text-xs font-sans leading-snug line-clamp-2">
        {issue.title}
      </p>

      {issue.labels && issue.labels.length > 0 && (
        <div className="flex items-center gap-1 flex-wrap">
          {issue.labels.map((label) => (
            <span
              key={label}
              className="text-[9px] px-1.5 py-0.5 rounded-xs bg-zinc-800 text-zinc-400 border border-white/5 font-mono"
            >
              {label}
            </span>
          ))}
        </div>
      )}
    </div>
  );
}
