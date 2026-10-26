import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { AlertTriangle } from "lucide-react";
import { Modal } from "@/components/ui/modal";
import {
  deleteAccountRequestSchema,
  type DeleteAccountRequestSchema,
} from "../../schemas/dangerZoneSchema";
import { useRequestAccountDeletionMutation } from "../../api/accountMutations";
import { DANGER_ZONE_CONSTANTS } from "../../constants";
import { toast } from "sonner";

interface Props {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: (maskedEmail?: string) => void;
}

export function DeleteAccountRequestModal({
  isOpen,
  onClose,
  onSuccess,
}: Props) {
  const requestMutation = useRequestAccountDeletionMutation();

  const {
    register,
    handleSubmit,
    reset,
    setError,
    formState: { errors },
  } = useForm<DeleteAccountRequestSchema>({
    resolver: zodResolver(deleteAccountRequestSchema),
    defaultValues: {
      confirmation: "",
    },
  });

  const handleClose = () => {
    reset();
    onClose();
  };

  const onSubmit = (data: DeleteAccountRequestSchema) => {
    requestMutation.mutate(data, {
      onSuccess: (response) => {
        reset();
        onSuccess(response?.masked_email);
        toast.success(response.message)

      },
      onError: (error: any) => {
        const message =
          error?.response?.data?.confirmation ||
          error?.response?.data?.message ||
          "Failed to request deletion";
          toast.error(message)
        setError("confirmation", {
          type: "server",
          message: Array.isArray(message) ? message[0] : message,
        });
      },
    });
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={handleClose}
      title={
        <div className="flex items-center gap-2 text-red-500">
          <AlertTriangle className="h-4 w-4" />
          <span className="text-sm font-semibold tracking-wide">
            Delete Account
          </span>
        </div>
      }
    >
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-5 font-mono">
        <p className="text-xs leading-relaxed text-gray-300">
          Deleting your account permanently removes all owned personal data.
          This action cannot be undone.
        </p>

        <div className="space-y-2">
          <label className="text-xs text-gray-400">
            Type{" "}
            <span className="font-semibold text-white">
              {DANGER_ZONE_CONSTANTS.CONFIRMATION_PHRASE}
            </span>{" "}
            to confirm.
          </label>
          <input
            type="text"
            {...register("confirmation")}
            placeholder={DANGER_ZONE_CONSTANTS.CONFIRMATION_PHRASE}
            className="w-full rounded-[3px] border border-white/10 bg-[#030303] px-3.5 py-2.5 text-xs text-white placeholder-gray-600 outline-none focus:border-red-500/50"
          />
          {errors.confirmation && (
            <p className="text-[11px] text-red-400">
              {errors.confirmation.message}
            </p>
          )}
        </div>

        <div className="flex justify-end gap-3 pt-2 border-t border-white/10">
          <button
            type="button"
            onClick={handleClose}
            className="rounded-[3px] border border-white/10 bg-[#141416] px-4 py-2 text-xs font-medium text-white transition-colors hover:bg-white/10"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={requestMutation.isPending}
            className="rounded-[3px] bg-red-600 px-4 py-2 text-xs font-semibold text-white transition-colors hover:bg-red-700 disabled:opacity-50"
          >
            {requestMutation.isPending ? "Sending OTP..." : "Continue"}
          </button>
        </div>
      </form>
    </Modal>
  );
}
