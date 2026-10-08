import { CheckCircle2, ExternalLink, GitBranch } from "lucide-react";
import { Button } from "@/components/ui/button";
import { GithubIcon } from "@/utils/icons";
import type { GitHubAccount, GitHubRepository } from "../types";

interface GitHubConnectedAccountViewProps {
  account: GitHubAccount | null;
  status: string | null;
  repositories: GitHubRepository[];
  onOpenLinkModal: () => void;
  onSelectRepo: (repo: GitHubRepository) => void;
}

export function GitHubConnectedAccountView({
  account,
  status,
  repositories,
  onOpenLinkModal,
  onSelectRepo,
}: GitHubConnectedAccountViewProps) {
  return (
    <div className="border border-white/10 rounded bg-[#0C0C0E] p-6 space-y-6 font-mono">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-white/5 pb-4">
        <div className="flex items-center gap-3">
          <div className="h-10 w-10 rounded bg-white/5 border border-white/10 text-white flex items-center justify-center shrink-0">
            <GithubIcon className="h-5 w-5" />
          </div>
          <div>
            <h2 className="text-sm font-bold text-white uppercase tracking-wider">
              GitHub Integration
            </h2>
            <p className="text-xs text-zinc-400 font-sans mt-0.5">
              Manage connected account and linked repositories.
            </p>
          </div>
        </div>

        <Button
          type="button"
          onClick={onOpenLinkModal}
          className="h-9 gap-2 bg-transparent border border-white/10 text-zinc-300 hover:text-white hover:bg-white/5 text-xs rounded cursor-pointer"
        >
          Link Repository
        </Button>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div className="p-4 rounded border border-white/10 bg-black/40 space-y-1">
          <span className="text-[10px] text-zinc-500 uppercase tracking-wider">
            Connected Account
          </span>
          <p className="text-xs font-bold text-white flex items-center gap-2 pt-0.5">
            <span>{account?.login || "Authorized User"}</span>
            <span className="px-1.5 py-0.5 rounded text-[9px] bg-emerald-500/10 text-emerald-400 border border-emerald-500/30">
              {account?.type || "User"}
            </span>
          </p>
        </div>

        <div className="p-4 rounded border border-white/10 bg-black/40 space-y-1">
          <span className="text-[10px] text-zinc-500 uppercase tracking-wider">
            Sync Status
          </span>
          <p className="text-xs font-bold text-emerald-400 flex items-center gap-1.5 pt-0.5">
            <CheckCircle2 className="h-3.5 w-3.5" />
            <span>{status || "Active"}</span>
          </p>
        </div>
      </div>

      <div className="space-y-3">
        <h3 className="text-xs font-semibold text-white uppercase tracking-wider">
          Linked Repositories ({repositories.length})
        </h3>

        {repositories.length === 0 ? (
          <div className="p-6 text-center border border-white/5 rounded bg-black/20 text-xs text-zinc-500 italic">
            No repositories linked to this project yet. Click "Link Repository"
            above.
          </div>
        ) : (
          <div className="border border-white/10 rounded bg-black/40 divide-y divide-white/5 overflow-hidden">
            {repositories.map((repo) => (
              <div
                key={repo.id}
                className="p-4 flex items-center justify-between gap-4 hover:bg-white/5 transition-colors"
              >
                <div className="space-y-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-bold text-white truncate">
                      {repo.name}
                    </span>
                    <span className="px-1.5 py-0.5 rounded text-[9px] uppercase border border-white/10 text-zinc-400 bg-white/5">
                      {repo.visibility ||
                        (repo.visibility === "private" ? "Private" : "Public")}
                    </span>
                  </div>
                  <p className="text-[11px] text-zinc-400 font-sans truncate">
                    {repo.full_name}
                  </p>
                  <div className="flex items-center gap-1.5 text-[10px] text-zinc-500 pt-0.5">
                    <GitBranch className="h-3 w-3" />
                    <span>Default branch: {repo.default_branch}</span>
                  </div>
                </div>

                <div className="flex items-center gap-2 shrink-0">
                  {repositories.length > 1 && (
                    <Button
                      type="button"
                      variant="outline"
                      onClick={() => onSelectRepo(repo)}
                      className="h-8 border-white/10 bg-transparent text-xs text-zinc-300 hover:text-white rounded-xs cursor-pointer"
                    >
                      View Details
                    </Button>
                  )}
                  <a
                    href={repo.repository_url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="p-2 text-zinc-400 hover:text-white hover:bg-white/10 rounded transition-colors"
                    title="Open on GitHub"
                  >
                    <ExternalLink className="h-4 w-4" />
                  </a>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
