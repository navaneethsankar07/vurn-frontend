import { useState } from "react";
import { GitBranch, Check, ChevronDown } from "lucide-react";
import type { GitHubRepository } from "../../integrations/github/types";

interface ReleaseNotesRepoSelectProps {
  repositories: GitHubRepository[];
  value: number | undefined;
  onChange: (repoId: number) => void;
}

export function ReleaseNotesRepoSelect({
  repositories,
  value,
  onChange,
}: ReleaseNotesRepoSelectProps) {
  const [isOpen, setIsOpen] = useState(false);

  const selectedRepo = repositories.find((r) => r.id === value);

  return (
    <div className="relative">
      <button
        type="button"
        onClick={() => setIsOpen((prev) => !prev)}
        className="h-9 w-full px-3 flex items-center justify-between border border-white/10 bg-black text-white rounded-xs text-xs font-mono focus:outline-none focus:border-primary hover:border-white/20 transition-colors cursor-pointer"
      >
        <div className="flex items-center gap-2 truncate">
          <GitBranch className="h-3.5 w-3.5 text-primary shrink-0" />
          <span className="truncate text-zinc-200">
            {selectedRepo ? selectedRepo.name : "Select repository"}
          </span>
        </div>
        <ChevronDown className="h-4 w-4 text-zinc-500 shrink-0" />
      </button>

      {isOpen && (
        <>
          <div
            className="fixed inset-0 z-40"
            onClick={() => setIsOpen(false)}
          />
          <div className="absolute top-full left-0 right-0 mt-1 z-50 bg-[#09090B] border border-white/10 rounded-xs shadow-2xl max-h-60 overflow-y-auto font-mono">
            {repositories.map((repo) => {
              const isSelected = repo.id === value;
              return (
                <button
                  key={repo.id}
                  type="button"
                  onClick={() => {
                    onChange(repo.id);
                    setIsOpen(false);
                  }}
                  className={`w-full px-3 py-2.5 text-left text-xs flex items-center justify-between transition-colors cursor-pointer ${
                    isSelected
                      ? "bg-white/10 text-white font-bold"
                      : "text-zinc-300 hover:bg-white/5 hover:text-white"
                  }`}
                >
                  <div className="flex items-center gap-2 truncate">
                    <GitBranch className="h-3.5 w-3.5 text-primary shrink-0" />
                    <span className="truncate font-sans">{repo.name}</span>
                  </div>
                  {isSelected && (
                    <Check className="h-3.5 w-3.5 text-primary shrink-0" />
                  )}
                </button>
              );
            })}
          </div>
        </>
      )}
    </div>
  );
}
