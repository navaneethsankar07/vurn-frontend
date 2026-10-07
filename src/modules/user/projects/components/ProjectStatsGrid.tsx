import {
  CircleCheck,
  CircleAlert,
  GitBranch,
  ExternalLink,
} from "lucide-react";
import { format, parseISO } from "date-fns";
import { GithubIcon } from "@/utils/icons";
import type { ProjectDashboardData } from "../types";

interface ProjectStatsGridProps {
  data?: ProjectDashboardData;
}

export function ProjectStatsGrid({ data }: ProjectStatsGridProps) {
  const formatDate = (dateStr?: string) => {
    if (!dateStr) return "";
    try {
      return format(parseISO(dateStr), "dd-MM-yyyy");
    } catch {
      return dateStr;
    }
  };

  const activeSprintText = data?.active_sprint
    ? `${formatDate(data.active_sprint.start_date)} - ${formatDate(
        data.active_sprint.end_date,
      )}`
    : "Not scheduled";

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 font-mono">
      <div className="border border-white/10 rounded bg-[#0C0C0E] p-4 flex flex-col justify-between h-28">
        <div className="flex items-center justify-between text-xs text-gray-400">
          <span>Open Issues</span>
          <CircleAlert className="h-4 w-4 text-amber-500" />
        </div>
        <div>
          <span className="text-2xl font-bold text-white">
            {data?.open_issues ?? 0}
          </span>
          <p className="text-[10px] text-gray-500 mt-1">Total open issues</p>
        </div>
      </div>

      <div className="border border-white/10 rounded bg-[#0C0C0E] p-4 flex flex-col justify-between h-28">
        <div className="flex items-center justify-between text-xs text-gray-400">
          <span>Completed Issues</span>
          <CircleCheck className="h-4 w-4 text-[#22C55E]" />
        </div>
        <div>
          <span className="text-2xl font-bold text-white">
            {data?.completed_issues ?? 0}
          </span>
          <p className="text-[10px] text-gray-500 mt-1">This project</p>
        </div>
      </div>

      <div className="border border-white/10 rounded bg-[#0C0C0E] p-4 flex flex-col justify-between h-28">
        <div className="flex items-center justify-between text-xs text-gray-400">
          <span>Active Sprint</span>
          <GitBranch className="h-4 w-4 text-primary" />
        </div>
        <div>
          <span className="text-xl font-bold text-white block truncate">
            {data?.active_sprint ? data.active_sprint.name : "No Active Sprint"}
          </span>
          <p className="text-[10px] text-gray-500 mt-1 truncate">
            {activeSprintText}
          </p>
        </div>
      </div>

      <div className="border border-white/10 rounded bg-[#0C0C0E] p-4 flex flex-col justify-between h-28">
        <div className="flex items-center justify-between text-xs text-gray-400">
          <span>Github Repository</span>
          <GithubIcon className="h-4 w-4 text-gray-300" />
        </div>
        <div>
          <div className="flex items-center gap-1.5 text-xs font-semibold text-white hover:text-primary transition-colors cursor-pointer truncate">
            <span>acme/inference-gateway</span>
            <ExternalLink className="h-3 w-3 shrink-0" />
          </div>
          <p className="text-[10px] text-[#8A8A8A] mt-1">
            Status:
            <span className=" text-[#22C55E]"> Connected</span>
          </p>
        </div>
      </div>
    </div>
  );
}
