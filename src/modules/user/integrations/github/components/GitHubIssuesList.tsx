import { useState } from "react";
import {
  AlertCircle,
  Loader2,
  ExternalLink,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { useGitHubIssues } from "../api/githubQueries";
import { formatRelativeTime } from "@/utils/sprintHelpers";

interface GitHubIssuesListProps {
  subdomain: string;
  projectSlug: string;
  repositoryId: number;
}

export function GitHubIssuesList({
  subdomain,
  projectSlug,
  repositoryId,
}: GitHubIssuesListProps) {
  const [issueState, setIssueState] = useState<string>("open");
  const [sort, setSort] = useState<string>("updated");
  const [direction] = useState<string>("desc");
  const [page, setPage] = useState<number>(1);
  const pageSize = 5;

  const { data, isLoading } = useGitHubIssues(
    subdomain,
    projectSlug,
    repositoryId,
    issueState,
    sort,
    direction,
    page,
    pageSize,
  );
  const issues = data?.issues || [];
  const pagination = data?.pagination;

  const handleStateChange = (newState: string) => {
    setIssueState(newState);
    setPage(1);
  };

  const handleSortChange = (newSort: string) => {
    setSort(newSort);
    setPage(1);
  };

  return (
    <div className="border border-white/10 rounded bg-[#0C0C0E] p-5 space-y-4 font-mono">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-white/5 pb-3">
        <h3 className="text-xs font-semibold text-white uppercase tracking-wider flex items-center gap-2">
          <AlertCircle className="h-4 w-4 text-amber-500" />
          <span>Issues</span>
        </h3>

        <div className="flex flex-wrap items-center gap-2">
          <div className="flex items-center gap-1 bg-black/60 border border-white/10 rounded-xs p-0.5">
            {["open", "closed", "all"].map((st) => (
              <button
                key={st}
                onClick={() => handleStateChange(st)}
                className={`px-2.5 py-1 text-[10px] uppercase font-semibold rounded-xs transition-colors cursor-pointer ${
                  issueState === st
                    ? "bg-amber-500 text-black"
                    : "text-zinc-400 hover:text-white"
                }`}
              >
                {st}
              </button>
            ))}
          </div>

          <select
            value={sort}
            onChange={(e) => handleSortChange(e.target.value)}
            className="bg-black/60 border border-white/10 text-xs text-white rounded-xs px-2 py-1 outline-none focus:border-amber-500/50 cursor-pointer"
          >
            <option value="updated">Updated</option>
            <option value="created">Created</option>
            <option value="comments">Comments</option>
          </select>
        </div>
      </div>

      {isLoading ? (
        <div className="py-12 flex items-center justify-center gap-2 text-xs text-zinc-500">
          <Loader2 className="h-4 w-4 animate-spin text-amber-500" />
          <span>Loading issues...</span>
        </div>
      ) : issues.length === 0 ? (
        <div className="py-12 text-center text-xs text-zinc-500 italic">
          No issues found for state "{issueState}".
        </div>
      ) : (
        <div className="space-y-3">
          <div className="border border-white/10 rounded bg-black/40 divide-y divide-white/5 overflow-hidden">
            {issues.map((issue) => {
              const isOpen = issue.state === "open";
              return (
                <div
                  key={issue.id}
                  className="p-3.5 flex items-start justify-between gap-4 text-xs"
                >
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
                      <span className="text-zinc-400">
                        {issue.author_username}
                      </span>
                      <span>•</span>
                      <span>
                        updated {formatRelativeTime(issue.updated_at, "")}
                      </span>
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
            })}
          </div>

          <div className="flex items-center justify-between pt-2 text-xs text-zinc-400">
            <span>Page {page}</span>
            <div className="flex items-center gap-2">
              <Button
                type="button"
                variant="outline"
                disabled={!pagination?.previous}
                onClick={() => setPage((prev) => Math.max(prev - 1, 1))}
                className="h-7 px-2.5 border-white/10 bg-transparent text-xs text-zinc-300 hover:text-white rounded-xs cursor-pointer disabled:opacity-40"
              >
                <ChevronLeft className="h-3.5 w-3.5 mr-1" />
                Previous
              </Button>
              <Button
                type="button"
                variant="outline"
                disabled={!pagination?.next}
                onClick={() => setPage((prev) => prev + 1)}
                className="h-7 px-2.5 border-white/10 bg-transparent text-xs text-zinc-300 hover:text-white rounded-xs cursor-pointer disabled:opacity-40"
              >
                Next
                <ChevronRight className="h-3.5 w-3.5 ml-1" />
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
