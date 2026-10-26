import { Archive, X } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useArchiveOrgMutation } from "../../api/organizationMutations";
import {
  archiveOrgSchema,
  type ArchiveOrgFormValues,
} from "../../schemas/archiveOrgSchema";

interface ArchiveOrgModalProps {
  isOpen: boolean;
  onClose: () => void;
  orgName: string;
  slug: string;
}

export function ArchiveOrgModal({
  isOpen,
  onClose,
  orgName,
  slug,
}: ArchiveOrgModalProps) {
  const navigate = useNavigate();
  const archiveMutation = useArchiveOrgMutation(slug);

  const {
    register,
    handleSubmit,
    reset,
    setError,
    formState: { errors, isValid },
  } = useForm<ArchiveOrgFormValues>({
    resolver: zodResolver(archiveOrgSchema),
    mode: "onChange",
    defaultValues: {
      confirmName: "",
    },
  });

  if (!isOpen) return null;

  const handleArchive = (data: ArchiveOrgFormValues) => {
    if (data.confirmName.trim() !== orgName) {
      setError("confirmName", {
        type: "manual",
        message: "Organization name does not match",
      });
      return;
    }

    archiveMutation.mutate(undefined, {
      onSuccess: () => {
        toast.success("Organization archived successfully.");
        reset();
        onClose();
        navigate("/organizations");
      },
      onError: (error: any) => {
        const message =
          error?.response?.data?.detail ||
          error?.message ||
          "Failed to archive organization.";
        toast.error(message);
      },
    });
  };

  const handleClose = () => {
    reset();
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4 font-mono text-xs">
      <div className="w-full max-w-md rounded-xs border border-amber-500/30 bg-[#09090b] text-gray-300 shadow-2xl overflow-hidden">
        <div className="flex items-center justify-between border-b border-white/10 p-4 sm:p-5">
          <div className="flex items-center gap-3">
            <div className="flex h-8 w-8 items-center justify-center rounded-xs border border-amber-500/30 bg-amber-500/10 text-amber-400">
              <Archive className="h-4 w-4" />
            </div>
            <h2 className="text-xs sm:text-sm font-medium text-white">
              Archive Organization
            </h2>
          </div>
          <button
            type="button"
            onClick={handleClose}
            className="text-gray-400 hover:text-white transition-colors"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        <form onSubmit={handleSubmit(handleArchive)}>
          <div className="p-4 sm:p-5 space-y-4">
            <p className="text-gray-400 text-[11px] leading-relaxed">
              Archiving{" "}
              <span className="font-semibold text-white">{orgName}</span> will
              make all projects and data read-only. You can unarchive it
              anytime.
            </p>

            <div className="space-y-1.5">
              <label className="block text-[11px] text-gray-300">
                Type{" "}
                <span className="text-amber-400 font-semibold">{orgName}</span>{" "}
                to confirm
              </label>
              <input
                type="text"
                {...register("confirmName")}
                placeholder={orgName}
                className={`w-full rounded-xs border bg-[#121215] px-3 py-2 text-white placeholder-gray-600 focus:outline-none transition-colors text-xs ${
                  errors.confirmName
                    ? "border-red-500/80 focus:border-red-500"
                    : "border-white/10 focus:border-amber-500/50"
                }`}
              />
              {errors.confirmName && (
                <p className="text-red-400 text-[11px]">
                  {errors.confirmName.message}
                </p>
              )}
            </div>
          </div>

          <div className="flex items-center justify-end gap-2.5 border-t border-white/10 p-4 sm:p-5">
            <button
              type="button"
              onClick={handleClose}
              className="px-3 py-1.5 text-gray-400 hover:text-white transition-colors text-xs"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={!isValid || archiveMutation.isPending}
              className="rounded-xs bg-[#121215] hover:bg-amber-950/30 text-amber-400 border border-amber-500/30 hover:border-amber-500/50 px-3.5 py-1.5 transition-colors disabled:opacity-40 disabled:cursor-not-allowed font-medium text-xs"
            >
              {archiveMutation.isPending
                ? "Archiving..."
                : "Archive Organization"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
