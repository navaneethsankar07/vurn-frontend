import { useState } from "react";
import { AlertTriangle, X } from "lucide-react";
import { toast } from "sonner";
import { useRequestDeleteOrgMutation } from "../../api/organizationMutations";

interface RequestDeleteModalProps {
  isOpen: boolean;
  onClose: () => void;
  orgName: string;
  slug: string;
  onSuccessNext: () => void;
}

export function RequestDeleteModal({
  isOpen,
  onClose,
  orgName,
  slug,
  onSuccessNext,
}: RequestDeleteModalProps) {
  const [typedName, setTypedName] = useState("");
  const requestDeleteMutation = useRequestDeleteOrgMutation(slug);

  if (!isOpen) return null;

  const isConfirmed = typedName.trim() === orgName;

  const handleRequest = () => {
    if (!isConfirmed) return;

    requestDeleteMutation.mutate(typedName.trim(), {
      onSuccess: () => {
        toast.success("Authorization code sent to your email.");
        setTypedName("");
        onClose();
        onSuccessNext();
      },
      onError: (error: any) => {
        const data = error?.response?.data;
        const message =
          data?.name?.[0] ||
          data?.detail ||
          error?.message ||
          "Failed to request deletion.";
        toast.error(message);
      },
    });
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4 font-mono text-xs">
      <div className="w-full max-w-md rounded-xs border border-[#F87171]/30 bg-[#09090b] text-gray-300 shadow-2xl overflow-hidden">
        <div className="flex items-center justify-between border-b border-white/10 p-4 sm:p-5">
          <div className="flex items-center gap-3">
            <div className="flex h-8 w-8 items-center justify-center rounded-xs border border-[#F87171]/30 bg-[#F87171]/10 text-[#F87171]">
              <AlertTriangle className="h-4 w-4" />
            </div>
            <h2 className="text-xs sm:text-sm font-medium text-white">
              Delete Organization
            </h2>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="text-gray-400 hover:text-white transition-colors"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        <div className="p-4 sm:p-5 space-y-4">
          <p className="text-gray-400 text-[11px] leading-relaxed">
            This will permanently delete{" "}
            <span className="font-semibold text-white">{orgName}</span>,
            including all projects, documents, members and associated data. This
            action cannot be undone.
          </p>

          <div className="space-y-1.5">
            <label className="block text-[11px] text-gray-300">
              Type <span className="text-[#F87171] font-semibold">{orgName}</span>{" "}
              to confirm
            </label>
            <input
              type="text"
              value={typedName}
              onChange={(e) => setTypedName(e.target.value)}
              placeholder={orgName}
              className="w-full rounded-xs border border-white/10 bg-[#121215] px-3 py-2 text-white placeholder-gray-600 focus:border-[#F87171]/50 focus:outline-none transition-colors text-xs"
            />
          </div>
        </div>

        <div className="flex items-center justify-end gap-2.5 border-t border-white/10 p-4 sm:p-5">
          <button
            type="button"
            onClick={onClose}
            className="px-3 py-1.5 text-gray-400 hover:text-white transition-colors text-xs"
          >
            Cancel
          </button>
          <button
            type="button"
            disabled={!isConfirmed || requestDeleteMutation.isPending}
            onClick={handleRequest}
            className="rounded-xs bg-[#121215] hover:bg-[#1c1214] text-[#F87171] border border-[#F87171]/30 hover:border-[#F87171]/50 px-3.5 py-1.5 transition-colors disabled:opacity-40 disabled:cursor-not-allowed font-medium text-xs"
          >
            {requestDeleteMutation.isPending
              ? "Sending..."
              : "Delete Organization"}
          </button>
        </div>
      </div>
    </div>
  );
}