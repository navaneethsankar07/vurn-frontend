import { Loader2, AlertTriangle } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { useDeleteWorkflowStatus } from "../../api/projectMutations";
import type { WorkflowStatus } from "../../types";

interface DeleteWorkflowStatusModalProps {
  isOpen: boolean;
  onClose: () => void;
  subdomain: string;
  projectSlug: string;
  status: WorkflowStatus | null;
}

export function DeleteWorkflowStatusModal({
  isOpen,
  onClose,
  subdomain,
  projectSlug,
  status,
}: DeleteWorkflowStatusModalProps) {
  const deleteMutation = useDeleteWorkflowStatus({
    subdomain,
    projectSlug,
    statusId: status?.id ? String(status.id) : "",
  });

  const handleDelete = () => {
    if (!status) return;

    deleteMutation.mutate(undefined, {
      onSuccess: () => {
        onClose();
      },
    });
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="bg-[#09090B] text-white border-white/10 max-w-md font-mono p-6">
        <DialogHeader className="space-y-1">
          <div className="flex items-center gap-2">
            <div className="p-2 bg-red-500/10 border border-red-500/20 text-red-500">
              <AlertTriangle className="h-4 w-4 shrink-0" />
            </div>
            <DialogTitle className="text-base font-bold uppercase tracking-wider text-white">
              Delete Status
            </DialogTitle>
          </div>
          <DialogDescription className="sr-only">
            Confirm status deletion
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4 pt-2">
          <p className="text-xs text-zinc-400 font-sans leading-relaxed">
            Are you sure you want to delete{" "}
            <span className="font-semibold text-white font-mono bg-white/5 border border-white/10 px-1.5 py-0.5">
              "{status?.name}"
            </span>
            ? This action cannot be undone and will permanently remove this
            status from your workflow.
          </p>

          <div className="flex items-center justify-end gap-2 pt-2 border-t border-white/5">
            <Button
              type="button"
              variant="outline"
              onClick={onClose}
              disabled={deleteMutation.isPending}
              className="h-8 bg-transparent text-xs border-white/10 text-zinc-400 hover:text-white hover:bg-white/5 rounded-none font-mono"
            >
              Cancel
            </Button>
            <Button
              type="button"
              onClick={handleDelete}
              disabled={deleteMutation.isPending}
              className="h-8 text-xs bg-red-500/10 text-red-400 border border-red-500/20 hover:bg-red-500/20 font-semibold rounded-none font-mono transition-colors"
            >
              {deleteMutation.isPending ? (
                <>
                  <Loader2 className="h-3.5 w-3.5 animate-spin mr-1.5" />
                  Deleting...
                </>
              ) : (
                "Delete Status"
              )}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
