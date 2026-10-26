import { useState } from "react";
import {
  GitPullRequest,
  Loader2,
  ExternalLink,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { useGitHubPullRequests } from "../api/githubQueries";

interface GitHubPullRequestsListProps {
  subdomain: string;
  projectSlug: string;
  repositoryId: number;
}

export function GitHubPullRequestsList({
  subdomain,
  projectSlug,
  repositoryId,
}: GitHubPullRequestsListProps) {
  const [prState, setPrState] = useState<string>("open");
  const [page, setPage] = useState<number>(1);
  const pageSize = 5;

  const { data, isLoading } = useGitHubPullRequests(
    subdomain,
    projectSlug,
    repositoryId,
    prState,
    page,
    pageSize,
  );
  const pullRequests = data?.pull_requests || [];
  const pagination = data?.pagination;

  const handleStateChange = (newState: string) => {
    setPrState(newState);
    setPage(1);
  };

  return (
    <div className="border border-white/10 rounded bg-[#0C0C0E] p-5 space-y-4 font-mono">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-white/5 pb-3">
        <h3 className="text-xs font-semibold text-white uppercase tracking-wider flex items-center gap-2">
          <GitPullRequest className="h-4 w-4 text-amber-500" />
          <span>Pull Requests</span>
        </h3>

        <div className="flex items-center gap-1 bg-black/60 border border-white/10 rounded-xs p-0.5">
          {["open", "closed", "all"].map((st) => (
            <button
              key={st}
              onClick={() => handleStateChange(st)}
              className={`px-2.5 py-1 text-[10px] uppercase font-semibold rounded-xs transition-colors cursor-pointer ${
                prState === st
                  ? "bg-amber-500 text-black"
                  : "text-zinc-400 hover:text-white"
              }`}
            >
              {st}
            </button>
          ))}
        </div>
      </div>

      {isLoading ? (
        <div className="py-12 flex items-center justify-center gap-2 text-xs text-zinc-500">
          <Loader2 className="h-4 w-4 animate-spin text-amber-500" />
          <span>Loading pull requests...</span>
        </div>
      ) : pullRequests.length === 0 ? (
        <div className="py-12 text-center text-xs text-zinc-500 italic">
          No pull requests found for state "{prState}".
        </div>
      ) : (
        <div className="space-y-3">
          <div className="border border-white/10 rounded bg-black/40 divide-y divide-white/5 overflow-hidden">
            {pullRequests.map((pr) => {
              const isMerged = pr.state === "merged";
              const isOpen = pr.state === "open";
              return (
                <div
                  key={pr.id}
                  className="p-3.5 flex items-start justify-between gap-4 text-xs"
                >
                  <div className="space-y-1 min-w-0 pr-2">
                    <div className="flex items-center gap-2">
                      <span className="text-zinc-500 font-bold shrink-0">
                        #{pr.pr_number}
                      </span>
                      <p className="text-white font-medium truncate font-sans">
                        {pr.title}
                      </p>
                      {pr.draft && (
                        <span className="px-1.5 py-0.2 rounded bg-zinc-800 text-zinc-400 border border-zinc-700 text-[9px] uppercase">
                          Draft
                        </span>
                      )}
                    </div>
                    <div className="flex items-center gap-2 text-[10px] text-zinc-500 font-mono">
                      <span className="text-zinc-400">
                        {pr.author_username}
                      </span>
                      <span>•</span>
                      <span className="bg-white/5 border border-white/10 px-1.5 py-0.2 rounded text-zinc-400">
                        {pr.source_branch} → {pr.target_branch}
                      </span>
                    </div>
                  </div>

                  <div className="flex items-center gap-3 shrink-0">
                    <span
                      className={`px-1.5 py-0.5 rounded text-[9px] uppercase border ${
                        isMerged
                          ? "border-purple-500/30 bg-purple-500/10 text-purple-400"
                          : isOpen
                            ? "border-emerald-500/30 bg-emerald-500/10 text-emerald-400"
                            : "border-red-500/30 bg-red-500/10 text-red-400"
                      }`}
                    >
                      {pr.state}
                    </span>
                    <a
                      href={pr.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="p-1.5 text-zinc-400 hover:text-white hover:bg-white/10 rounded transition-colors"
                      title="View PR on GitHub"
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
