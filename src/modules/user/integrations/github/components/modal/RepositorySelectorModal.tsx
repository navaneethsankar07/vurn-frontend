import { useState } from "react";
import { Loader2, GitBranch } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { useGitHubRepositories } from "../../api/githubQueries";
import type { GitHubRepository } from "../../types";

interface RepositorySelectorModalProps {
  isOpen: boolean;
  onClose: () => void;
  subdomain: string;
  projectSlug: string;
  onSelectRepo: (repo: GitHubRepository) => void;
  isConnecting: boolean;
}

export function RepositorySelectorModal({
  isOpen,
  onClose,
  subdomain,
  projectSlug,
  onSelectRepo,
  isConnecting,
}: RepositorySelectorModalProps) {
  const [selectedRepo, setSelectedRepo] = useState<GitHubRepository | null>(
    null,
  );

  const { data, isLoading } = useGitHubRepositories(
    subdomain,
    projectSlug,
    isOpen,
  );
  const repositories = data?.repositories || [];

  const handleConfirm = () => {
    if (!selectedRepo) return;
    onSelectRepo(selectedRepo);
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="bg-[#09090B] border border-white/10 text-white font-mono max-w-md rounded-xs shadow-2xl p-5 space-y-4 [&>button]:rounded-xs">
        <DialogHeader className="space-y-1">
          <DialogTitle className="text-xs font-semibold uppercase tracking-wider text-white">
            Link Repository
          </DialogTitle>
          <p className="text-[11px] text-zinc-400 font-sans">
            Select a repository to link to this project.
          </p>
        </DialogHeader>

        {isLoading ? (
          <div className="py-8 flex items-center justify-center gap-2 text-xs text-zinc-500">
            <Loader2 className="h-4 w-4 animate-spin text-amber-500" />
            <span>Loading repositories...</span>
          </div>
        ) : repositories.length === 0 ? (
          <div className="py-8 text-center text-xs text-zinc-500 italic">
            No repositories available.
          </div>
        ) : (
          <div className="max-h-60 overflow-y-auto space-y-1 pr-1 border border-white/10 rounded-xs bg-black/40 p-1.5">
            {repositories.map((repo) => {
              const isSelected = selectedRepo?.id === repo.id;
              return (
                <div
                  key={repo.id}
                  onClick={() => setSelectedRepo(repo)}
                  className={`px-3 py-2.5 rounded-xs flex items-center justify-between cursor-pointer transition-colors ${
                    isSelected
                      ? "bg-amber-500/10 border border-amber-500/30 text-white"
                      : "hover:bg-white/5 border border-transparent text-zinc-300"
                  }`}
                >
                  <div className="min-w-0 space-y-0.5 pr-2">
                    <p className="text-xs font-medium truncate">
                      {repo.full_name}
                    </p>
                    <div className="flex items-center gap-1.5 text-[10px] text-zinc-500 font-sans">
                      <GitBranch className="h-3 w-3" />
                      <span>{repo.default_branch}</span>
                    </div>
                  </div>
                  <span
                    className={`text-[9px] uppercase px-1.5 py-0.5 rounded-xs border shrink-0 ${
                      repo.private
                        ? "border-white/10 bg-white/5 text-zinc-400"
                        : "border-blue-500/30 bg-blue-500/10 text-blue-400"
                    }`}
                  >
                    {repo.private ? "Private" : "Public"}
                  </span>
                </div>
              );
            })}
          </div>
        )}

        <DialogFooter className="bg-transparent flex items-center gap-2 pt-2">
          <Button
            type="button"
            variant="outline"
            onClick={onClose}
            disabled={isConnecting}
            className="h-8 border-white/10 bg-transparent text-zinc-400 hover:text-white text-xs rounded-xs cursor-pointer flex-1"
          >
            Cancel
          </Button>
          <Button
            type="button"
            disabled={!selectedRepo || isConnecting}
            onClick={handleConfirm}
            className="h-8 bg-amber-500 text-black hover:bg-amber-400 font-semibold text-xs rounded-xs gap-1.5 cursor-pointer flex-1"
          >
            {isConnecting && <Loader2 className="h-3.5 w-3.5 animate-spin" />}
            Connect
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
