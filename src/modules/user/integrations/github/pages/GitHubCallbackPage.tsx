import { useEffect, useRef } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { Loader2, AlertCircle } from "lucide-react";
import { GithubIcon } from "@/utils/icons";
import { Button } from "@/components/ui/button";
import { useCompleteGitHubConnect } from "../api/githubMutations";

export function GitHubCallbackPage() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();

  const { mutate: completeConnect, isError } = useCompleteGitHubConnect();

  const hasCalled = useRef(false);

  const installationId = searchParams.get("installation_id");
  const setupAction = searchParams.get("setup_action");
  const state = searchParams.get("state");

  useEffect(() => {
    if (hasCalled.current) {
      return;
    }

    if (!installationId || !state) {
      return;
    }

    hasCalled.current = true;

    completeConnect({
      installation_id: installationId,
      setup_action: setupAction || undefined,
      state,
    });
  }, [installationId, setupAction, state, completeConnect]);

  if (!installationId || !state) {
    return (
      <div className="min-h-screen bg-black text-white flex items-center justify-center p-4 font-mono">
        <div className="max-w-md w-full border border-red-500/20 bg-red-500/5 p-6 rounded text-center space-y-4">
          <AlertCircle className="h-8 w-8 text-red-400 mx-auto" />

          <div className="space-y-1">
            <h2 className="text-sm font-bold text-white">
              Invalid Callback Parameters
            </h2>

            <p className="text-xs text-zinc-400 font-sans">
              Missing required GitHub installation parameters.
            </p>
          </div>

          <Button
            onClick={() => navigate("/")}
            className="h-8 bg-white/10 text-white hover:bg-white/20 text-xs rounded cursor-pointer"
          >
            Return Home
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black text-white flex items-center justify-center p-4 font-mono">
      <div className="max-w-md w-full border border-white/10 bg-[#0C0C0E] p-8 rounded text-center space-y-5 shadow-2xl">
        <div className="h-12 w-12 rounded-full bg-amber-500/10 border border-amber-500/20 flex items-center justify-center mx-auto text-amber-500">
          <GithubIcon className="h-6 w-6" />
        </div>

        {isError ? (
          <div className="space-y-3">
            <h2 className="text-sm font-bold text-red-400">
              GitHub Connection Failed
            </h2>

            <p className="text-xs text-zinc-400 font-sans">
              Redirecting you back to the project...
            </p>
          </div>
        ) : (
          <div className="space-y-3">
            <div className="flex items-center justify-center gap-2">
              <Loader2 className="h-4 w-4 animate-spin text-amber-500" />

              <h2 className="text-sm font-bold text-white">
                Connecting GitHub...
              </h2>
            </div>

            <p className="text-xs text-zinc-400 font-sans">
              Please wait while we establish secure handshake and sync your
              installation.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
