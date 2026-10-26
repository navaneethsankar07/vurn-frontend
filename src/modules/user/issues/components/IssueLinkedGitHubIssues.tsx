import { ExternalLink } from "lucide-react";
import type { GitHubLinkedIssueRef } from "../types";

interface IssueLinkedGitHubIssuesProps {
  linkedIssues: GitHubLinkedIssueRef[];
}

export function IssueLinkedGitHubIssues({
  linkedIssues,
}: IssueLinkedGitHubIssuesProps) {
  if (!linkedIssues || linkedIssues.length === 0) return null;

  return (
    <div className="space-y-3">
      <span className="text-[10px] font-semibold uppercase tracking-wider text-zinc-400 block">
        Linked GitHub Issues
      </span>
      <div className="border border-white/10 rounded-xs bg-black/40 divide-y divide-white/5 overflow-hidden">
        {linkedIssues.map((item) => {
          const gitIssue = item.git_issue;
          const isOpen = gitIssue.state === "open";
          return (
            <div
              key={item.id}
              className="p-3 flex items-start justify-between gap-3 text-xs"
            >
              <div className="space-y-1 min-w-0 pr-2">
                <div className="flex items-center gap-2">
                  <span className="text-zinc-500 font-bold shrink-0">
                    #{gitIssue.issue_number}
                  </span>
                  <p className="text-white font-medium truncate font-sans">
                    {gitIssue.title}
                  </p>
                </div>
                <div className="flex items-center gap-2 text-[10px] text-zinc-500 font-mono">
                  <span className="text-zinc-400">
                    {gitIssue.repository_name}
                  </span>
                  <span>•</span>
                  <span>by {gitIssue.author_username}</span>
                </div>
              </div>

              <div className="flex items-center gap-2.5 shrink-0">
                <span
                  className={`px-1.5 py-0.5 rounded-xs text-[9px] uppercase border ${
                    isOpen
                      ? "border-emerald-500/30 bg-emerald-500/10 text-emerald-400"
                      : "border-purple-500/30 bg-purple-500/10 text-purple-400"
                  }`}
                >
                  {gitIssue.state}
                </span>
                <a
                  href={gitIssue.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="p-1.5 text-zinc-400 hover:text-white hover:bg-white/10 rounded-xs transition-colors"
                  title="View issue on GitHub"
                >
                  <ExternalLink className="h-3.5 w-3.5" />
                </a>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
