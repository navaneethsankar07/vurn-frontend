import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { Loader2, FolderEdit } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useUpdateDocumentFolder } from "../../api/knowledgeMutations";
import type { DocumentFolder } from "../../types";

interface EditFolderModalProps {
  isOpen: boolean;
  onClose: () => void;
  subdomain: string;
  projectSlug: string;
  folder: DocumentFolder | null;
}

export function EditFolderModal({
  isOpen,
  onClose,
  subdomain,
  projectSlug,
  folder,
}: EditFolderModalProps) {
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<{ name: string }>();

  const { mutate: updateFolder, isPending } = useUpdateDocumentFolder(
    subdomain,
    projectSlug,
  );

  useEffect(() => {
    if (folder) {
      reset({ name: folder.name });
    }
  }, [folder, reset]);

  if (!isOpen || !folder) return null;

  const onSubmit = (data: { name: string }) => {
    updateFolder(
      { folderId: folder.id, data: { name: data.name.trim() } },
      {
        onSuccess: () => {
          onClose();
        },
      },
    );
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="bg-[#09090B] border border-white/10 text-white font-mono max-w-sm rounded-xs shadow-2xl p-5 space-y-4">
        <DialogHeader className="flex flex-row items-center justify-between border-b border-white/10 pb-3 space-y-0">
          <div className="flex items-center gap-2">
            <FolderEdit className="h-4 w-4 text-amber-500 shrink-0" />
            <DialogTitle className="text-xs font-bold uppercase tracking-wider text-white">
              Edit Folder
            </DialogTitle>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="text-zinc-500 hover:text-white transition-colors cursor-pointer"
          >
            ✕
          </button>
        </DialogHeader>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div className="space-y-1.5">
            <label className="text-[10px] text-zinc-400 uppercase tracking-wide">
              Folder Name
            </label>
            <Input
              {...register("name", { required: "Folder name is required" })}
              placeholder="Folder name"
              className="h-9 bg-black border-white/10 text-white text-xs rounded-xs focus-visible:ring-1 focus-visible:ring-amber-500/50"
            />
            {errors.name && (
              <p className="text-[10px] text-red-400 font-sans px-0.5">
                {errors.name.message}
              </p>
            )}
          </div>

          <div className="flex items-center justify-end gap-2 pt-2 border-t border-white/5">
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
              type="submit"
              disabled={isPending}
              className="h-8 bg-amber-500 text-black hover:bg-amber-400 font-semibold text-xs rounded-xs gap-1.5 cursor-pointer disabled:opacity-50"
            >
              {isPending && <Loader2 className="h-3.5 w-3.5 animate-spin" />}
              Save Changes
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
