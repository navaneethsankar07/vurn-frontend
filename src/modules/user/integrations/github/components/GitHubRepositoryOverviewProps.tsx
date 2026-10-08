import {
  ExternalLink,
  GitBranch,
  Star,
  GitFork,
  AlertCircle,
  Code,
  Calendar,
  Clock,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { format, parseISO } from "date-fns";
import { formatRelativeTime } from "@/utils/sprintHelpers";
import { GitHubCommitsList } from "./GitHubCommitsList";
import { GitHubPullRequestsList } from "./GitHubPullRequestsList";
import type { GitHubRepository } from "../types";

interface GitHubRepositoryOverviewProps {
  repository: GitHubRepository;
  subdomain: string;
  projectSlug: string;
  onBackToList?: () => void;
  showBack?: boolean;
}

const DUMMY_ISSUES = [
  {
    id: "ISSUE-101",
    title: "Refactor database connection pool timeout logic",
    status: "Open",
    time: "2h ago",
  },
  {
    id: "ISSUE-98",
    title: "Update dependencies and resolve vulnerability alerts",
    status: "Open",
    time: "1d ago",
  },
  {
    id: "ISSUE-92",
    title: "Add unit tests for payment gateway integration",
    status: "Closed",
    time: "3d ago",
  },
];

export function GitHubRepositoryOverview({
  repository,
  subdomain,
  projectSlug,
  onBackToList,
  showBack,
}: GitHubRepositoryOverviewProps) {
  const formatDate = (dateStr?: string) => {
    if (!dateStr) return "";
    try {
      return format(parseISO(dateStr), "MMM d, yyyy");
    } catch {
      return dateStr;
    }
  };

  return (
    <div className="space-y-6 font-mono">
      {showBack && onBackToList && (
        <div>
          <Button
            type="button"
            variant="outline"
            onClick={onBackToList}
            className="h-8 border-white/10 bg-[#0C0C0E] text-xs text-zinc-300 hover:text-white rounded-xs cursor-pointer"
          >
            ← Back to Repositories
          </Button>
        </div>
      )}

      <div className="border border-white/10 rounded bg-[#0C0C0E] p-6 space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-white/5 pb-4">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <h2 className="text-base font-bold text-white">
                {repository.name}
              </h2>
              <span className="px-1.5 py-0.5 rounded text-[9px] uppercase border border-white/10 text-zinc-400 bg-white/5">
                {repository.visibility}
              </span>
            </div>
            <p className="text-xs text-zinc-400 font-sans">
              {repository.full_name}
            </p>
          </div>

          <a
            href={repository.repository_url}
            target="_blank"
            rel="noopener noreferrer"
          >
            <Button
              type="button"
              className="h-9 gap-2 bg-amber-500 text-black hover:bg-amber-400 font-semibold text-xs rounded cursor-pointer"
            >
              <span>Open Repository</span>
              <ExternalLink className="h-4 w-4" />
            </Button>
          </a>
        </div>

        {repository.description && (
          <p className="text-xs text-zinc-300 font-sans bg-black/40 p-3 rounded border border-white/5">
            {repository.description}
          </p>
        )}

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          <div className="p-4 rounded border border-white/10 bg-black/40 space-y-1">
            <span className="text-[10px] text-zinc-500 uppercase tracking-wider flex items-center gap-1.5">
              <GitBranch className="h-3 w-3 text-amber-500" />
              Default Branch
            </span>
            <p className="text-xs font-bold text-white pt-0.5">
              {repository.default_branch}
            </p>
          </div>

          <div className="p-4 rounded border border-white/10 bg-black/40 space-y-1">
            <span className="text-[10px] text-zinc-500 uppercase tracking-wider flex items-center gap-1.5">
              <Star className="h-3 w-3 text-amber-500" />
              Stars
            </span>
            <p className="text-xs font-bold text-white pt-0.5">
              {repository.stars ?? 0}
            </p>
          </div>

          <div className="p-4 rounded border border-white/10 bg-black/40 space-y-1">
            <span className="text-[10px] text-zinc-500 uppercase tracking-wider flex items-center gap-1.5">
              <GitFork className="h-3 w-3 text-amber-500" />
              Forks
            </span>
            <p className="text-xs font-bold text-white pt-0.5">
              {repository.forks ?? 0}
            </p>
          </div>

          <div className="p-4 rounded border border-white/10 bg-black/40 space-y-1">
            <span className="text-[10px] text-zinc-500 uppercase tracking-wider flex items-center gap-1.5">
              <AlertCircle className="h-3 w-3 text-amber-500" />
              Open Issues
            </span>
            <p className="text-xs font-bold text-white pt-0.5">
              {repository.open_issues ?? 0}
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div className="p-4 rounded border border-white/10 bg-black/40 space-y-1">
            <span className="text-[10px] text-zinc-500 uppercase tracking-wider flex items-center gap-1.5">
              <Code className="h-3 w-3 text-amber-500" />
              Language
            </span>
            <p className="text-xs font-bold text-white pt-0.5">
              {repository.language || "N/A"}
            </p>
          </div>

          <div className="p-4 rounded border border-white/10 bg-black/40 space-y-1">
            <span className="text-[10px] text-zinc-500 uppercase tracking-wider flex items-center gap-1.5">
              <Calendar className="h-3 w-3 text-amber-500" />
              Created At
            </span>
            <p className="text-xs font-bold text-white pt-0.5">
              {formatDate(repository.github_created_at)}
            </p>
          </div>

          <div className="p-4 rounded border border-white/10 bg-black/40 space-y-1">
            <span className="text-[10px] text-zinc-500 uppercase tracking-wider flex items-center gap-1.5">
              <Clock className="h-3 w-3 text-amber-500" />
              Last Updated
            </span>
            <p className="text-xs font-bold text-white pt-0.5">
              {formatRelativeTime(repository.github_updated_at, "")}
            </p>
          </div>
        </div>

        <GitHubCommitsList
          subdomain={subdomain}
          projectSlug={projectSlug}
          repositoryId={repository.id}
          defaultBranch={repository.default_branch}
        />

        <GitHubPullRequestsList
          subdomain={subdomain}
          projectSlug={projectSlug}
          repositoryId={repository.id}
        />

        <div className="space-y-3 pt-2">
          <h3 className="text-xs font-semibold text-white uppercase tracking-wider">
            Repository Issues Area (Synced)
          </h3>
          <div className="border border-white/10 rounded bg-black/40 divide-y divide-white/5 overflow-hidden">
            {DUMMY_ISSUES.map((issue) => (
              <div
                key={issue.id}
                className="p-3.5 flex items-center justify-between gap-4 text-xs"
              >
                <div className="flex items-center gap-3 min-w-0">
                  <span className="text-zinc-500 font-bold shrink-0">
                    {issue.id}
                  </span>
                  <span className="text-zinc-200 font-sans truncate">
                    {issue.title}
                  </span>
                </div>
                <div className="flex items-center gap-3 shrink-0">
                  <span
                    className={`px-1.5 py-0.5 rounded text-[9px] uppercase border ${
                      issue.status === "Open"
                        ? "border-amber-500/30 bg-amber-500/10 text-amber-400"
                        : "border-emerald-500/30 bg-emerald-500/10 text-emerald-400"
                    }`}
                  >
                    {issue.status}
                  </span>
                  <span className="text-[10px] text-zinc-500">
                    {issue.time}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
