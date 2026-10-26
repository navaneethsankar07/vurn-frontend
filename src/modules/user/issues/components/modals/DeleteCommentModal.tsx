import { Trash2, Loader2, X } from "lucide-react";
import { Button } from "@/components/ui/button";

interface DeleteCommentModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  isPending: boolean;
  isReply?: boolean;
  hasReplies?: boolean;
}

export function DeleteCommentModal({
  isOpen,
  onClose,
  onConfirm,
  isPending,
  isReply = false,
  hasReplies = false,
}: DeleteCommentModalProps) {
  if (!isOpen) return null;

  return (
    <div className="my-2 p-2.5 bg-red-950/20 border border-red-500/20 rounded-xs font-mono animate-in fade-in zoom-in-95 duration-150">
      <div className="flex items-center justify-between gap-3">
        <div className="flex items-center gap-2 min-w-0">
          <Trash2 className="h-3.5 w-3.5 text-red-400 shrink-0" />
          <span className="text-[11px] text-zinc-300 font-sans">
            Delete this {isReply ? "reply" : "comment"}
            {!isReply && hasReplies ? " and its replies?" : "?"}
          </span>
        </div>

        <div className="flex items-center gap-1.5 shrink-0">
          <Button
            type="button"
            variant="ghost"
            size="sm"
            disabled={isPending}
            onClick={onClose}
            className="h-6 px-2 text-[10px] text-zinc-400 hover:text-white hover:bg-white/5 rounded-xs"
          >
            <X className="h-3 w-3 mr-0.5" />
            Cancel
          </Button>

          <Button
            type="button"
            size="sm"
            disabled={isPending}
            onClick={onConfirm}
            className="h-6 px-2.5 bg-red-500/90 hover:bg-red-500 text-white text-[10px] font-semibold rounded-xs gap-1 transition-colors shadow-xs"
          >
            {isPending ? <Loader2 className="h-3 w-3 animate-spin" /> : null}
            <span>Confirm</span>
          </Button>
        </div>
      </div>
    </div>
  );
}
