import { AlertTriangle, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";

interface DeleteIssueConfirmationModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  issueKey: string;
  issueTitle: string;
  issueType: string;
  isPending: boolean;
}

export function DeleteIssueConfirmationModal({
  isOpen,
  onClose,
  onConfirm,
  issueKey,
  issueTitle,
  issueType,
  isPending,
}: DeleteIssueConfirmationModalProps) {
  if (!isOpen) return null;

  const isEpic = issueType === "epic";

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center bg-black/75 backdrop-blur-xs pt-16 px-4 animate-in fade-in duration-150">
      <div className="w-full max-w-md bg-[#09090B] border border-red-500/20 rounded-xs shadow-2xl p-5 space-y-4 font-mono text-white animate-in slide-in-from-top-4 duration-200">
        <div className="flex items-start gap-3">
          <div className="p-2 bg-red-500/10 border border-red-500/20 text-red-400 rounded-xs shrink-0">
            <AlertTriangle className="h-4 w-4" />
          </div>
          <div className="space-y-1 min-w-0">
            <h3 className="text-xs font-semibold uppercase tracking-wider text-red-400">
              Delete {issueType}
            </h3>
            <p className="text-xs text-zinc-300 font-sans truncate">
              <span className="font-mono text-amber-500 mr-1.5">
                {issueKey}
              </span>
              {issueTitle}
            </p>
          </div>
        </div>

        <p className="text-[11px] text-zinc-400 font-sans leading-relaxed">
          {isEpic
            ? "Are you sure you want to delete this epic? Child work items will remain intact, but their epic link will be removed."
            : "Are you sure you want to delete this work item? Any associated subtasks and comments will also be deleted."}
        </p>

        <div className="flex items-center justify-end gap-2 pt-2 border-t border-white/5 font-sans">
          <Button
            type="button"
            variant="outline"
            disabled={isPending}
            onClick={onClose}
            className="h-7 text-xs border-white/10 bg-transparent text-zinc-400 hover:text-white rounded-xs cursor-pointer"
          >
            Cancel
          </Button>
          <Button
            type="button"
            disabled={isPending}
            onClick={onConfirm}
            className="h-7 text-xs bg-red-500 text-white hover:bg-red-600 font-semibold rounded-xs cursor-pointer"
          >
            {isPending && <Loader2 className="h-3 w-3 animate-spin mr-1.5" />}
            Delete
          </Button>
        </div>
      </div>
    </div>
  );
}
