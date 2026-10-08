import { useState } from "react";
import {
  Loader2,
  ExternalLink,
  CheckCircle2,
  GitBranch,
} from "lucide-react";
import { GithubIcon } from "@/utils/icons";
import { Button } from "@/components/ui/button";
import { useGitHubStatus } from "../api/githubQueries";
import { useConnectGitHubRepository, useStartGitHubConnect } from "../api/githubMutations";
import { RepositorySelectorModal } from "./modal/RepositorySelectorModal";
import type { GitHubRepository } from "../types";

interface GitHubIntegrationHubProps {
  subdomain: string;
  projectSlug: string;
}

export function GitHubIntegrationHub({
  subdomain,
  projectSlug,
}: GitHubIntegrationHubProps) {
  const [isRepoModalOpen, setIsRepoModalOpen] = useState(false);

  const { data: statusData, isLoading } = useGitHubStatus(
    subdomain,
    projectSlug,
  );
  const { mutate: startConnect, isPending: isConnectingGitHub } =
    useStartGitHubConnect(subdomain, projectSlug);
  const { mutate: connectRepo, isPending: isConnectingRepo } =
    useConnectGitHubRepository(subdomain, projectSlug);

  const handleSelectRepo = (repo: GitHubRepository) => {
    connectRepo(repo.id, {
      onSuccess: () => {
        setIsRepoModalOpen(false);
      },
    });
  };

  if (isLoading) {
    return (
      <div className="h-64 flex items-center justify-center font-mono text-xs text-zinc-500 gap-2">
        <Loader2 className="h-4 w-4 animate-spin text-amber-500" />
        <span>Loading GitHub integration status...</span>
      </div>
    );
  }

  const isConnected = statusData?.connected ?? false;
  const account = statusData?.account;
  const repositories = statusData?.repositories || [];

  return (
    <div className="space-y-6 font-mono">
      <div className="border border-white/10 rounded bg-[#0C0C0E] p-6 space-y-6">
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
                Connect your GitHub account to sync repositories and track pull
                requests automatically.
              </p>
            </div>
          </div>

          {!isConnected ? (
            <Button
              type="button"
              disabled={isConnectingGitHub}
              onClick={() => startConnect()}
              className="h-9 gap-2 bg-amber-500 text-black hover:bg-amber-400 font-semibold text-xs rounded cursor-pointer"
            >
              {isConnectingGitHub && (
                <Loader2 className="h-4 w-4 animate-spin" />
              )}
              <GithubIcon className="h-4 w-4" />
              Connect GitHub
            </Button>
          ) : (
            <Button
              type="button"
              onClick={() => setIsRepoModalOpen(true)}
              className="h-9 gap-2 bg-transparent border border-white/10 text-zinc-300 hover:text-white hover:bg-white/5 text-xs rounded cursor-pointer"
            >
              Link Repository
            </Button>
          )}
        </div>

        {!isConnected ? (
          <div className="py-12 text-center space-y-3 border border-dashed border-white/10 rounded bg-black/20">
            <GithubIcon className="h-8 w-8 text-zinc-600 mx-auto" />
            <div className="space-y-1">
              <p className="text-xs font-bold text-zinc-300">
                No GitHub account linked
              </p>
              <p className="text-[11px] text-zinc-500 font-sans max-w-sm mx-auto">
                Link your organization or user account to browse and attach
                repositories to this project.
              </p>
            </div>
          </div>
        ) : (
          <div className="space-y-6">
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
                  <span>Active & Healthy</span>
                </p>
              </div>
            </div>

            <div className="space-y-3">
              <h3 className="text-xs font-semibold text-white uppercase tracking-wider">
                Linked Repositories ({repositories.length})
              </h3>

              {repositories.length === 0 ? (
                <div className="p-6 text-center border border-white/5 rounded bg-black/20 text-xs text-zinc-500 italic">
                  No repositories linked to this project yet. Click "Link
                  Repository" above.
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
                            {repo.private ? "Private" : "Public"}
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

                      <a
                        href={repo.html_url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="p-2 text-zinc-400 hover:text-white hover:bg-white/10 rounded transition-colors shrink-0"
                        title="Open on GitHub"
                      >
                        <ExternalLink className="h-4 w-4" />
                      </a>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        )}
      </div>

      <RepositorySelectorModal
        isOpen={isRepoModalOpen}
        onClose={() => setIsRepoModalOpen(false)}
        subdomain={subdomain}
        projectSlug={projectSlug}
        onSelectRepo={handleSelectRepo}
        isConnecting={isConnectingRepo}
      />
    </div>
  );
}
