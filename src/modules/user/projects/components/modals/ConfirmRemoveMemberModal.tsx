import { Loader2, AlertTriangle, UserX } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { useRemoveProjectMember } from "../../api/projectMutations";
import { toast } from "sonner";

interface ConfirmRemoveMemberModalProps {
  isOpen: boolean;
  onClose: () => void;
  subdomain: string;
  projectSlug: string;
  member: {
    user_id: number | string;
    full_name?: string;
    email?: string;
  } | null;
}

export function ConfirmRemoveMemberModal({
  isOpen,
  onClose,
  subdomain,
  projectSlug,
  member,
}: ConfirmRemoveMemberModalProps) {
  const { mutate: removeMember, isPending } = useRemoveProjectMember(
    subdomain,
    projectSlug,
  );

  if (!member) return null;

  const handleConfirm = () => {
    removeMember(member.user_id, {
      onSuccess: (data: any) => {
        toast.success(data?.message || "Member removed successfully");
        onClose();
      },
      onError: (error: any) => {
        const errorMessage =
          error?.response?.data?.error ||
          error?.response?.data?.message ||
          error?.response?.data?.detail ||
          error?.message ||
          "Failed to remove member";

        toast.error(errorMessage);
      },
    });
  };

  return (
    <Dialog
      open={isOpen}
      onOpenChange={(open) => !open && !isPending && onClose()}
    >
      <DialogContent className="bg-[#09090B] w-full sm:max-w-md border border-white/10 text-white rounded-none font-mono p-6 shadow-2xl space-y-0">
        <DialogHeader className="space-y-3 border-b border-white/10 pb-5">
          <div className="flex items-center gap-3">
            <div className="h-9 w-9 rounded-none border border-red-500/20 bg-red-500/10 flex items-center justify-center text-red-400 shrink-0">
              <AlertTriangle className="h-4 w-4" />
            </div>
            <div>
              <DialogTitle className="text-sm font-bold tracking-tight text-white uppercase">
                Remove Project Member
              </DialogTitle>
              <p className="text-[11px] text-zinc-500 font-mono mt-0.5">
                Revoke resource permissions
              </p>
            </div>
          </div>

          <DialogDescription className="text-xs text-zinc-400 font-sans leading-relaxed pt-1">
            Are you sure you want to remove{" "}
            <span className="text-white font-semibold font-mono underline decoration-white/20 underline-offset-4">
              {member.full_name || member.email || "this member"}
            </span>{" "}
            from this project? They will immediately lose access to all
            associated repositories, environments, and tasks.
          </DialogDescription>
        </DialogHeader>

        <DialogFooter className="gap-2 pt-5 bg-transparent sm:justify-end">
          <Button
            type="button"
            variant="outline"
            onClick={onClose}
            disabled={isPending}
            className="h-8 px-4 border-white/10 bg-black text-zinc-300 hover:bg-white/5 hover:text-white text-xs rounded-none transition-colors"
          >
            Cancel
          </Button>
          <Button
            type="button"
            onClick={handleConfirm}
            disabled={isPending}
            className="h-8 px-4 bg-red-600/90 text-white hover:bg-red-600 text-xs font-semibold rounded-none gap-2 transition-all disabled:opacity-40 shadow-sm"
          >
            {isPending ? (
              <Loader2 className="h-3.5 w-3.5 animate-spin" />
            ) : (
              <UserX className="h-3.5 w-3.5" />
            )}
            Remove Member
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
