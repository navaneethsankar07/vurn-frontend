import { useRouteError, isRouteErrorResponse } from "react-router-dom";
import { AlertCircle, RotateCcw, ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";

export function ErrorBoundary() {
  const error = useRouteError();

  let title = "Application Error";
  let message = "An unexpected error occurred while processing your request.";
  let statusBadge = "500";

  if (isRouteErrorResponse(error)) {
    statusBadge = error.status.toString();
    if (error.status === 404) {
      title = "Page Not Found";
      message =
        "The resource or page you are looking for does not exist or has been moved.";
    } else if (error.status === 403) {
      title = "Access Denied";
      message =
        "You do not have the required permissions to view this workspace resource.";
    } else {
      title = error.statusText || "Server Error";
      message = typeof error.data === "string" ? error.data : message;
    }
  } else if (error instanceof Error) {
    message = error.message;
  }

  return (
    <div className="min-h-screen bg-[#09090b] text-white flex items-center justify-center p-6 font-mono select-none">
      <div className="max-w-md w-full border border-white/10 rounded-xs bg-[#0C0C0E] p-8 space-y-6 shadow-2xl">
        <div className="flex items-center justify-between border-b border-white/5 pb-4">
          <div className="flex items-center gap-3">
            <div className="h-8 w-8 rounded-xs bg-red-500/10 border border-red-500/20 flex items-center justify-center text-red-400 shrink-0">
              <AlertCircle className="h-4 w-4" />
            </div>
            <span className="text-xs font-semibold text-white tracking-wider uppercase">
              System Error
            </span>
          </div>
          <span className="text-[10px] font-bold px-2 py-0.5 rounded-xs border border-white/10 bg-white/5 text-zinc-400 font-mono">
            {statusBadge}
          </span>
        </div>

        <div className="space-y-2">
          <h1 className="text-sm font-bold text-white font-sans tracking-wide">
            {title}
          </h1>
          <p className="text-xs text-zinc-400 font-sans leading-relaxed">
            {message}
          </p>
        </div>

        <div className="flex items-center gap-3 pt-2 border-t border-white/5">
          <Button
            type="button"
            onClick={() => window.history.back()}
            variant="outline"
            className="flex-1 h-9 border-white/10 bg-transparent text-zinc-300 hover:bg-white/5 hover:text-white font-semibold text-xs rounded-xs cursor-pointer"
          >
            <ArrowLeft className="h-3.5 w-3.5 mr-1.5" /> Go Back
          </Button>
          <Button
            type="button"
            onClick={() => window.location.reload()}
            className="flex-1 h-9 bg-primary text-black hover:bg-primary/90 font-semibold text-xs rounded-xs cursor-pointer"
          >
            <RotateCcw className="h-3.5 w-3.5 mr-1.5" /> Retry
          </Button>
        </div>
      </div>
    </div>
  );
}
