import { Calendar, Clock, MoreHorizontal, ExternalLink } from "lucide-react";
import ReactMarkdown from "react-markdown";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import type { Sprint } from "../types";
import {
  calculateSprintProgress,
  formatSprintDates,
  formatRelativeTime,
} from "@/utils/sprintHelpers";

interface SprintCardProps {
  sprint: Sprint;
  onOpenSprint?: (sprint: Sprint) => void;
  onEditSprint?: (sprint: Sprint) => void;
  onDeleteSprint?: (sprint: Sprint) => void;
}

export function SprintCard({
  sprint,
  onOpenSprint,
  onEditSprint,
  onDeleteSprint,
}: SprintCardProps) {
  const progressPercent = calculateSprintProgress(
    sprint.start_date,
    sprint.end_date,
    sprint.status,
  );

  const getBadgeStyle = (status: Sprint["status"]) => {
    switch (status) {
      case "active":
        return "bg-amber-500/10 text-amber-400 border-amber-500/20";
      case "completed":
        return "bg-emerald-500/10 text-emerald-400 border-emerald-500/20";
      case "planned":
      default:
        return "bg-zinc-500/10 text-zinc-400 border-zinc-500/20";
    }
  };

  const contentToRender = sprint.goal || sprint.description;

  return (
    <div className="bg-[#09090B] border border-white/10 p-4 space-y-4 font-mono hover:border-white/20 transition-all rounded-xs">
      <div className="flex items-start justify-between gap-3">
        <div className="space-y-1.5 min-w-0">
          <div className="flex items-center gap-2 flex-wrap">
            <h3 className="text-sm font-bold text-white tracking-tight">
              {sprint.name}
            </h3>
            <span
              className={`text-[10px] uppercase font-semibold px-2 py-0.5 border rounded-xs flex items-center gap-1.5 ${getBadgeStyle(
                sprint.status,
              )}`}
            >
              <span className="h-1.5 w-1.5 rounded-full bg-current inline-block" />
              {sprint.status}
            </span>
          </div>

          <div className="text-xs text-zinc-400 font-sans line-clamp-1 prose prose-invert max-w-none [&_p]:m-0 [&_p]:inline">
            {contentToRender ? (
              <ReactMarkdown>{contentToRender}</ReactMarkdown>
            ) : (
              "No goal specified."
            )}
          </div>

          <div className="flex items-center gap-2 text-[11px] text-zinc-500 pt-0.5">
            <span className="flex items-center gap-1">
              <Calendar className="h-3 w-3 text-zinc-500 shrink-0" />
              {formatSprintDates(sprint.start_date, sprint.end_date)}
            </span>
            <span>•</span>
            <span className="flex items-center gap-1">
              <Clock className="h-3 w-3 text-zinc-500 shrink-0" />
              Updated {formatRelativeTime(sprint.updated_at)}
            </span>
          </div>
        </div>

        <DropdownMenu>
          <DropdownMenuTrigger className="p-1.5 text-zinc-400 hover:text-white hover:bg-white/5 transition-colors focus:outline-none rounded-xs border border-transparent hover:border-white/10 shrink-0">
            <MoreHorizontal className="h-4 w-4" />
          </DropdownMenuTrigger>
          <DropdownMenuContent
            align="end"
            className="bg-[#09090B] border-white/10 text-text-primary/80 font-mono text-xs min-w-38 rounded-xs p-1"
          >
            <DropdownMenuItem
              onClick={() => onOpenSprint?.(sprint)}
              className=" rounded-xs focus:bg-white/10 focus:text-white flex items-center justify-between"
            >
              <span>View Sprint</span>
              <ExternalLink className="h-3 w-3 text-zinc-400" />
            </DropdownMenuItem>
            <DropdownMenuItem
              onClick={() => onEditSprint?.(sprint)}
              className="cursor-pointer rounded-xs focus:bg-white/10 focus:text-white"
            >
              Edit Sprint
            </DropdownMenuItem>
            <DropdownMenuSeparator className="bg-white/10 my-1" />
            <DropdownMenuItem
              onClick={() => onDeleteSprint?.(sprint)}
              className="cursor-pointer rounded-xs text-red-400 focus:bg-red-500/10 focus:text-red-400"
            >
              Delete Sprint
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>

      <div className="space-y-1.5">
        <div className="flex items-center justify-between text-[11px]">
          <span className="text-zinc-500 font-medium uppercase tracking-wider">
            Progress
          </span>
          <span className="text-white font-semibold">{progressPercent}%</span>
        </div>
        <div className="w-full bg-zinc-900 h-1.5 border border-white/5 overflow-hidden rounded-none">
          <div
            className="bg-amber-500 h-full transition-all duration-300"
            style={{ width: `${progressPercent}%` }}
          />
        </div>
      </div>

      <div className="grid grid-cols-3 gap-2 pt-3 border-t border-white/5">
        <div>
          <p className="text-sm font-bold text-white">
            {sprint.open_issues_count ?? 0}
          </p>
          <p className="text-[10px] text-zinc-500 font-sans tracking-wide">
            Open
          </p>
        </div>
        <div>
          <p className="text-sm font-bold text-white">
            {sprint.completed_issues_count ?? 0}
          </p>
          <p className="text-[10px] text-zinc-500 font-sans tracking-wide">
            Completed
          </p>
        </div>
        <div>
          <p className="text-sm font-bold text-white">
            {sprint.remaining_issues_count ?? 0}
          </p>
          <p className="text-[10px] text-zinc-500 font-sans tracking-wide">
            Remaining
          </p>
        </div>
      </div>
    </div>
  );
}
