import { Loader2, Trash2 } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogDescription,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { useDeleteDocumentFolder } from "../../api/knowledgeMutations";
import type { DocumentFolder } from "../../types";

interface DeleteFolderModalProps {
  isOpen: boolean;
  onClose: () => void;
  subdomain: string;
  projectSlug: string;
  folder: DocumentFolder | null;
  onFolderDeleted?: () => void;
}

export function DeleteFolderModal({
  isOpen,
  onClose,
  subdomain,
  projectSlug,
  folder,
  onFolderDeleted,
}: DeleteFolderModalProps) {
  const { mutate: deleteFolder, isPending } = useDeleteDocumentFolder(
    subdomain,
    projectSlug,
  );

  if (!isOpen || !folder) return null;

  const handleConfirm = () => {
    deleteFolder(folder.id, {
      onSuccess: () => {
        onClose();
        if (onFolderDeleted) {
          onFolderDeleted();
        }
      },
    });
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="bg-[#09090B] border border-white/10 text-white font-mono max-w-md rounded-xs shadow-2xl p-6 space-y-6">
        <DialogHeader className="space-y-2 text-left">
          <div className="flex items-center gap-2.5 text-red-400">
            <div className="p-2 bg-red-500/10 border border-red-500/20 rounded-xs">
              <Trash2 className="h-4 w-4" />
            </div>
            <DialogTitle className="text-xs font-bold uppercase tracking-wider text-white">
              Delete Folder
            </DialogTitle>
          </div>
          <DialogDescription className="text-xs text-zinc-400 font-sans leading-relaxed pt-1">
            Are you sure you want to delete{" "}
            <strong className="text-white font-semibold">
              "{folder.name}"
            </strong>
            ? This folder and its references will be permanently removed.
            Folders containing active documents cannot be deleted.
          </DialogDescription>
        </DialogHeader>

        <DialogFooter className="flex items-center bg-transparent justify-end gap-2 pt-2 border-t border-white/5">
          <Button
            type="button"
            variant="outline"
            onClick={onClose}
            disabled={isPending}
            className="h-8 border-white/10 bg-transparent text-zinc-400 hover:text-white hover:bg-white/5 text-xs rounded-xs cursor-pointer"
          >
            Cancel
          </Button>
          <Button
            type="button"
            disabled={isPending}
            onClick={handleConfirm}
            className="h-8 bg-red-500 text-black hover:bg-red-400 font-semibold text-xs rounded-xs gap-1.5 cursor-pointer disabled:opacity-50"
          >
            {isPending && <Loader2 className="h-3.5 w-3.5 animate-spin" />}
            Delete Folder
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
