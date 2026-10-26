import { Loader2, AlertCircle } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";

interface DeleteAttachmentModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  isPending: boolean;
  fileName: string;
}

export function DeleteAttachmentModal({
  isOpen,
  onClose,
  onConfirm,
  isPending,
  fileName,
}: DeleteAttachmentModalProps) {
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="bg-[#09090B] border border-white/10 text-white font-mono max-w-sm rounded-xs shadow-2xl p-5 top-8 translate-y-0 space-y-4">
        <DialogHeader className="text-left space-y-2">
          <div className="flex items-center gap-2 text-red-400">
            <AlertCircle className="h-4 w-4 shrink-0" />
            <DialogTitle className="text-sm font-bold uppercase tracking-wider text-white">
              Delete Attachment
            </DialogTitle>
          </div>
          <p className="text-xs text-zinc-400 font-sans">
            Are you sure you want to delete{" "}
            <span className="text-zinc-200 font-mono break-all">
              "{fileName}"
            </span>
            ? This action cannot be undone.
          </p>
        </DialogHeader>

        <DialogFooter className="flex bg-transparent items-center gap-2 sm:justify-end pt-2">
          <Button
            type="button"
            variant="outline"
            onClick={onClose}
            disabled={isPending}
            className="h-8 border-white/10 bg-transparent text-zinc-400 hover:text-white text-xs rounded-xs cursor-pointer"
          >
            Cancel
          </Button>
          <Button
            type="button"
            disabled={isPending}
            onClick={onConfirm}
            className="h-8 bg-red-500/10 text-red-400 hover:bg-red-500 hover:text-black font-semibold text-xs rounded-xs gap-1.5 cursor-pointer border border-red-500/20"
          >
            {isPending && <Loader2 className="h-3.5 w-3.5 animate-spin" />}
            Delete
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
