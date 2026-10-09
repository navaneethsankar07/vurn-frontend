import { ExternalLink } from "lucide-react";
import { formatRelativeTime } from "@/utils/sprintHelpers";
import type { GitHubIssueItem } from "../types";

interface GitHubIssueCardProps {
  issue: GitHubIssueItem;
}

export function GitHubIssueCard({ issue }: GitHubIssueCardProps) {
  const isOpen = issue.state === "open";

  return (
    <div className="p-3.5 flex items-start justify-between gap-4 text-xs">
      <div className="space-y-1 min-w-0 pr-2">
        <div className="flex items-center gap-2">
          <span className="text-zinc-500 font-bold shrink-0">
            #{issue.issue_number}
          </span>
          <p className="text-white font-medium truncate font-sans">
            {issue.title}
          </p>
        </div>
        <div className="flex items-center gap-2 text-[10px] text-zinc-500 font-mono">
          <span className="text-zinc-400">{issue.author_username}</span>
          <span>•</span>
          <span>updated {formatRelativeTime(issue.updated_at, "")}</span>
        </div>
      </div>

      <div className="flex items-center gap-3 shrink-0">
        <span
          className={`px-1.5 py-0.5 rounded text-[9px] uppercase border ${
            isOpen
              ? "border-amber-500/30 bg-amber-500/10 text-amber-400"
              : "border-purple-500/30 bg-purple-500/10 text-purple-400"
          }`}
        >
          {issue.state}
        </span>
        <a
          href={issue.url}
          target="_blank"
          rel="noopener noreferrer"
          className="p-1.5 text-zinc-400 hover:text-white hover:bg-white/10 rounded transition-colors"
          title="View issue on GitHub"
        >
          <ExternalLink className="h-3.5 w-3.5" />
        </a>
      </div>
    </div>
  );
}
