import { useState } from "react";
import { Loader2, Lock, Unlock, Check } from "lucide-react";
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
      <DialogContent className="bg-[#09090B] border border-white/10 text-white font-mono max-w-lg rounded-xs shadow-2xl p-6 space-y-5">
        <DialogHeader className="text-left space-y-1">
          <DialogTitle className="text-sm font-bold uppercase tracking-wider text-white">
            Connect GitHub Repository
          </DialogTitle>
          <p className="text-xs text-zinc-400 font-sans">
            Select a repository from your connected GitHub account to link with
            this project.
          </p>
        </DialogHeader>

        {isLoading ? (
          <div className="py-12 flex items-center justify-center gap-2 text-xs text-zinc-500">
            <Loader2 className="h-4 w-4 animate-spin text-amber-500" />
            <span>Fetching your repositories...</span>
          </div>
        ) : repositories.length === 0 ? (
          <div className="py-12 text-center text-xs text-zinc-500 italic">
            No repositories found.
          </div>
        ) : (
          <div className="max-h-64 overflow-y-auto space-y-2 pr-1 divide-y divide-white/5 border border-white/10 rounded-xs bg-black/40 p-2">
            {repositories.map((repo) => {
              const isSelected = selectedRepo?.id === repo.id;
              return (
                <div
                  key={repo.id}
                  onClick={() => setSelectedRepo(repo)}
                  className={`p-3 rounded-xs flex items-center justify-between cursor-pointer transition-colors ${
                    isSelected
                      ? "bg-amber-500/10 border border-amber-500/30"
                      : "hover:bg-white/5 border border-transparent"
                  }`}
                >
                  <div className="min-w-0 space-y-1 pr-3">
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-bold text-white truncate">
                        {repo.name}
                      </span>
                      {repo.private ? (
                        <Lock className="h-3 w-3 text-zinc-500 shrink-0" />
                      ) : (
                        <Unlock className="h-3 w-3 text-zinc-500 shrink-0" />
                      )}
                    </div>
                    <p className="text-[10px] text-zinc-400 font-sans truncate">
                      {repo.full_name}
                    </p>
                  </div>
                  {isSelected && (
                    <div className="h-5 w-5 rounded-full bg-amber-500 flex items-center justify-center text-black shrink-0">
                      <Check className="h-3 w-3 stroke-3" />
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        )}

        <DialogFooter className="flex items-center gap-2 sm:justify-end pt-2">
          <Button
            type="button"
            variant="outline"
            onClick={onClose}
            disabled={isConnecting}
            className="h-8 border-white/10 bg-transparent text-zinc-400 hover:text-white text-xs rounded-xs cursor-pointer"
          >
            Cancel
          </Button>
          <Button
            type="button"
            disabled={!selectedRepo || isConnecting}
            onClick={handleConfirm}
            className="h-8 bg-amber-500 text-black hover:bg-amber-400 font-semibold text-xs rounded-xs gap-1.5 cursor-pointer"
          >
            {isConnecting && <Loader2 className="h-3.5 w-3.5 animate-spin" />}
            Connect Repository
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
