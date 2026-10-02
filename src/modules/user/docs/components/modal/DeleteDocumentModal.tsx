import { Loader2, AlertTriangle } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogDescription,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";

interface DeleteDocumentModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  isPending: boolean;
  documentTitle: string;
}

export function DeleteDocumentModal({
  isOpen,
  onClose,
  onConfirm,
  isPending,
  documentTitle,
}: DeleteDocumentModalProps) {
  if (!isOpen) return null;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="bg-[#09090B] border border-white/10 text-white font-mono max-w-md rounded-xs shadow-2xl p-6 space-y-5">
        <DialogHeader className="space-y-2 text-left border-b border-white/10 pb-4">
          <div className="flex items-center gap-2.5 text-red-400">
            <div className="p-2 bg-red-500/10 border border-red-500/20 rounded-xs">
              <AlertTriangle className="h-4 w-4 shrink-0 text-red-400" />
            </div>
            <DialogTitle className="text-sm font-bold uppercase tracking-wider text-white">
              Delete Document
            </DialogTitle>
          </div>
          <DialogDescription className="text-xs text-zinc-400 font-sans">
            Are you sure you want to delete{" "}
            <strong className="text-white">"{documentTitle}"</strong>? This
            action is permanent and cannot be undone.
          </DialogDescription>
        </DialogHeader>

        <DialogFooter className="pt-2 flex rounded-none bg-transparent items-center justify-end gap-2.5">
          <Button
            type="button"
            variant="outline"
            onClick={onClose}
            disabled={isPending}
            className="h-8 border-white/10 bg-black text-zinc-300 hover:bg-zinc-900 hover:text-white text-xs rounded-xs cursor-pointer transition-colors"
          >
            Cancel
          </Button>
          <Button
            type="button"
            disabled={isPending}
            onClick={onConfirm}
            className="h-8 bg-red-600 text-white hover:bg-red-500 font-semibold text-xs rounded-xs gap-1.5 cursor-pointer transition-colors disabled:opacity-50"
          >
            {isPending && <Loader2 className="h-3.5 w-3.5 animate-spin" />}
            Confirm Delete
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
