import { GithubIcon } from "@/utils/icons";
import { Button } from "@/components/ui/button";
import { Loader2 } from "lucide-react";

interface GitHubConnectHeroProps {
  isConnecting: boolean;
  onConnect: () => void;
}

export function GitHubConnectHero({
  isConnecting,
  onConnect,
}: GitHubConnectHeroProps) {
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
              Connect your GitHub account to sync repositories and track
              activity.
            </p>
          </div>
        </div>

        <Button
          type="button"
          disabled={isConnecting}
          onClick={onConnect}
          className="h-9 gap-2 bg-amber-500 text-black hover:bg-amber-400 font-semibold text-xs rounded cursor-pointer"
        >
          {isConnecting && <Loader2 className="h-4 w-4 animate-spin" />}
          <GithubIcon className="h-4 w-4" />
          Connect GitHub
        </Button>
      </div>

      <div className="py-12 text-center space-y-3 border border-dashed border-white/10 rounded bg-black/20">
        <GithubIcon className="h-8 w-8 text-zinc-600 mx-auto" />
        <div className="space-y-1">
          <p className="text-xs font-bold text-zinc-300">
            No GitHub account linked
          </p>
          <p className="text-[11px] text-zinc-500 font-sans max-w-sm mx-auto">
            Link your account to browse and attach repositories to this project.
          </p>
        </div>
      </div>
    </div>
  );
}
