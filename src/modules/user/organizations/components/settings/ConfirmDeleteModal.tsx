import { AlertTriangle, X } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  useConfirmDeleteOrgMutation,
  useRequestDeleteOrgMutation,
} from "../../api/organizationMutations";
import {
  confirmDeleteSchema,
  type ConfirmDeleteFormValues,
} from "../../schemas/confirmDeleteSchema";

interface ConfirmDeleteModalProps {
  isOpen: boolean;
  onClose: () => void;
  slug: string;
  orgName: string;
}

export function ConfirmDeleteModal({
  isOpen,
  onClose,
  slug,
  orgName,
}: ConfirmDeleteModalProps) {
  const navigate = useNavigate();

  const confirmDeleteMutation = useConfirmDeleteOrgMutation(slug);
  const requestDeleteMutation = useRequestDeleteOrgMutation(slug);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isValid },
  } = useForm<ConfirmDeleteFormValues>({
    resolver: zodResolver(confirmDeleteSchema),
    mode: "onChange",
    defaultValues: {
      code: "",
    },
  });

  if (!isOpen) return null;

  const handleConfirm = (data: ConfirmDeleteFormValues) => {
    confirmDeleteMutation.mutate(data.code, {
      onSuccess: () => {
        toast.success("Organization deleted successfully.");
        reset();
        onClose();
        navigate("/organizations");
      },
      onError: (error: any) => {
        const message =
          error?.response?.data?.detail ||
          error?.message ||
          "Invalid code or deletion failed.";
        toast.error(message);
      },
    });
  };

  const handleResendCode = () => {
    requestDeleteMutation.mutate(orgName, {
      onSuccess: () => {
        toast.success("A new authorization code has been sent to your email.");
      },
      onError: (error: any) => {
        const message =
          error?.response?.data?.detail ||
          error?.message ||
          "Failed to resend code.";
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
      <div className="w-full max-w-md rounded-xs border border-[#F87171]/30 bg-[#09090b] text-gray-300 shadow-2xl overflow-hidden">
        <div className="flex items-center justify-between border-b border-white/10 p-4 sm:p-5">
          <div className="flex items-center gap-3">
            <div className="flex h-8 w-8 items-center justify-center rounded-xs border border-[#F87171]/30 bg-[#F87171]/10 text-[#F87171]">
              <AlertTriangle className="h-4 w-4" />
            </div>
            <h2 className="text-xs sm:text-sm font-medium text-white">
              Confirm Deletion
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

        <form onSubmit={handleSubmit(handleConfirm)}>
          <div className="p-4 sm:p-5 space-y-4">
            <p className="text-gray-400 text-[11px] leading-relaxed">
              Enter the authorization code sent to your email to permanently
              delete this organization.
            </p>

            <div className="space-y-1.5">
              <div className="flex items-center justify-between">
                <label className="block text-[11px] text-gray-300">
                  Authorization Code
                </label>
                <button
                  type="button"
                  onClick={handleResendCode}
                  disabled={requestDeleteMutation.isPending}
                  className="text-[10px] text-[#F87171] hover:text-[#F87171]/80 underline disabled:opacity-50"
                >
                  {requestDeleteMutation.isPending
                    ? "Resending..."
                    : "Resend code"}
                </button>
              </div>
              <input
                type="text"
                {...register("code")}
                placeholder="Enter 6-character code"
                maxLength={6}
                className={`w-full rounded-xs border bg-[#121215] px-3 py-2 text-white placeholder-gray-600 focus:outline-none transition-colors text-xs ${
                  errors.code
                    ? "border-red-500/80 focus:border-red-500"
                    : "border-white/10 focus:border-[#F87171]/50"
                }`}
              />
              {errors.code && (
                <p className="text-red-400 text-[11px]">
                  {errors.code.message}
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
              disabled={!isValid || confirmDeleteMutation.isPending}
              className="rounded-xs bg-[#121215] hover:bg-[#1c1214] text-[#F87171] border border-[#F87171]/30 hover:border-[#F87171]/50 px-3.5 py-1.5 transition-colors disabled:opacity-40 disabled:cursor-not-allowed font-medium text-xs"
            >
              {confirmDeleteMutation.isPending
                ? "Deleting..."
                : "Confirm Deletion"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}