import { useState } from "react";
import {
  GitCommit,
  Loader2,
  ExternalLink,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { useGitHubBranches } from "../api/githubQueries";
import { useGitHubCommits } from "../api/githubQueries";
import { formatRelativeTime } from "@/utils/sprintHelpers";

interface GitHubCommitsListProps {
  subdomain: string;
  projectSlug: string;
  repositoryId: number;
  defaultBranch?: string;
}

export function GitHubCommitsList({
  subdomain,
  projectSlug,
  repositoryId,
  defaultBranch,
}: GitHubCommitsListProps) {
  const [selectedBranch, setSelectedBranch] = useState<string>(
    defaultBranch || "main",
  );
  const [page, setPage] = useState<number>(1);
  const pageSize = 5;

  const { data: branchesData, isLoading: isLoadingBranches } =
    useGitHubBranches(subdomain, projectSlug, repositoryId);
  const branches = branchesData?.branches || [];

  const { data: commitsData, isLoading: isLoadingCommits } = useGitHubCommits(
    subdomain,
    projectSlug,
    repositoryId,
    selectedBranch,
    page,
    pageSize,
  );
  const commits = commitsData?.commits || [];
  const pagination = commitsData?.pagination;

  const handleBranchChange = (branchName: string) => {
    setSelectedBranch(branchName);
    setPage(1);
  };

  return (
    <div className="border border-white/10 rounded bg-[#0C0C0E] p-5 space-y-4 font-mono">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-white/5 pb-3">
        <h3 className="text-xs font-semibold text-white uppercase tracking-wider flex items-center gap-2">
          <GitCommit className="h-4 w-4 text-amber-500" />
          <span>Commits</span>
        </h3>

        {isLoadingBranches ? (
          <div className="text-[10px] text-zinc-500 flex items-center gap-1">
            <Loader2 className="h-3 w-3 animate-spin" />
            <span>Loading branches...</span>
          </div>
        ) : branches.length > 0 ? (
          <div className="flex items-center gap-2">
            <span className="text-[10px] text-zinc-500 uppercase">Branch:</span>
            <select
              value={selectedBranch}
              onChange={(e) => handleBranchChange(e.target.value)}
              className="bg-black/60 border border-white/10 text-xs text-white rounded-xs px-2 py-1 outline-none focus:border-amber-500/50 cursor-pointer"
            >
              {branches.map((b) => (
                <option key={b?.name} value={b?.name}>
                  {b?.name}
                </option>
              ))}
            </select>
          </div>
        ) : null}
      </div>

      {isLoadingCommits ? (
        <div className="py-12 flex items-center justify-center gap-2 text-xs text-zinc-500">
          <Loader2 className="h-4 w-4 animate-spin text-amber-500" />
          <span>Loading commits...</span>
        </div>
      ) : commits.length === 0 ? (
        <div className="py-12 text-center text-xs text-zinc-500 italic">
          No commits found for branch "{selectedBranch}".
        </div>
      ) : (
        <div className="space-y-3">
          <div className="border border-white/10 rounded bg-black/40 divide-y divide-white/5 overflow-hidden">
            {commits.map((commit) => (
              <div
                key={commit.sha}
                className="p-3.5 flex items-start justify-between gap-4 text-xs"
              >
                <div className="space-y-1 min-w-0 pr-2">
                  <p className="text-white font-medium truncate font-sans">
                    {commit.message}
                  </p>
                  <div className="flex items-center gap-2 text-[10px] text-zinc-500 font-mono">
                    <span className="text-zinc-400">
                      {commit.author?.name || "Unknown"}
                    </span>
                    <span>•</span>
                    <span>
                      {commit.author?.date
                        ? formatRelativeTime(commit.author.date, "")
                        : ""}
                    </span>
                    {commit.linked_issue && (
                      <>
                        <span>•</span>
                        <span className="px-1.5 py-0.2 rounded bg-amber-500/10 text-amber-400 border border-amber-500/20">
                          {commit.linked_issue}
                        </span>
                      </>
                    )}
                  </div>
                </div>

                <div className="flex items-center gap-3 shrink-0">
                  <span className="text-[10px] font-mono bg-white/5 border border-white/10 px-2 py-0.5 rounded text-zinc-400">
                    {commit.sha?.substring(0, 7)}
                  </span>
                  <a
                    href={commit.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="p-1.5 text-zinc-400 hover:text-white hover:bg-white/10 rounded transition-colors"
                    title="View commit on GitHub"
                  >
                    <ExternalLink className="h-3.5 w-3.5" />
                  </a>
                </div>
              </div>
            ))}
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
