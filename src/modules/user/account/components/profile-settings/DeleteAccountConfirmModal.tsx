import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { AlertTriangle, Check, Mail, Trash2 } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { Modal } from "@/components/ui/modal";
import {
  deleteAccountConfirmSchema,
  type DeleteAccountConfirmSchema,
} from "../../schemas/dangerZoneSchema";
import {
  useConfirmAccountDeletionMutation,
  useRequestAccountDeletionMutation,
} from "../../api/accountMutations";
import { DANGER_ZONE_CONSTANTS } from "../../constants";

interface Props {
  isOpen: boolean;
  onClose: () => void;
  maskedEmail?: string;
}

export function DeleteAccountConfirmModal({
  isOpen,
  onClose,
  maskedEmail,
}: Props) {
  const navigate = useNavigate();
  const confirmMutation = useConfirmAccountDeletionMutation();
  const resendMutation = useRequestAccountDeletionMutation();

  const {
    register,
    handleSubmit,
    reset,
    setError,
    formState: { errors },
  } = useForm<DeleteAccountConfirmSchema>({
    resolver: zodResolver(deleteAccountConfirmSchema),
    defaultValues: {
      otp: "",
    },
  });

  const handleClose = () => {
    reset();
    onClose();
  };

  const handleResendOtp = () => {
    resendMutation.mutate({
      confirmation: DANGER_ZONE_CONSTANTS.CONFIRMATION_PHRASE,
    });
  };

  const onSubmit = (data: DeleteAccountConfirmSchema) => {
    confirmMutation.mutate(data, {
      onSuccess: () => {
        reset();
        navigate("/login", { replace: true });
      },
      onError: (error: any) => {
        const message =
          error?.response?.data?.otp ||
          error?.response?.data?.message ||
          "Invalid OTP";
        setError("otp", {
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
        <div className="flex items-center gap-2 font-mono text-red-500">
          <AlertTriangle className="h-4 w-4" />
          <span className="text-sm font-semibold tracking-wide">
            Delete Account
          </span>
        </div>
      }
    >
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-5 font-mono">
        <div className="space-y-2">
          <div className="flex items-center justify-between text-xs font-medium text-white">
            <span>Verify your identity</span>
            <Mail className="h-4 w-4 text-gray-400" />
          </div>
          <p className="text-xs leading-relaxed text-gray-400">
            Send a one-time password to {maskedEmail || "your registered email"}{" "}
            before deleting your account.
          </p>
        </div>

        <div className="flex items-center gap-2 text-xs text-amber-500">
          <Check className="h-3.5 w-3.5" />
          <span>OTP sent to {maskedEmail || "your email"}</span>
        </div>

        <div className="space-y-2">
          <input
            type="text"
            maxLength={DANGER_ZONE_CONSTANTS.OTP_LENGTH}
            {...register("otp")}
            placeholder="Enter 6-digit OTP"
            className="w-full rounded-[3px] border border-white/10 bg-[#030303] px-3.5 py-2.5 text-xs text-white placeholder-gray-600 tracking-wider outline-none focus:border-white/30"
          />
          {errors.otp && (
            <p className="text-[11px] text-red-400">{errors.otp.message}</p>
          )}

          <div className="pt-1">
            <button
              type="button"
              onClick={handleResendOtp}
              disabled={resendMutation.isPending}
              className="text-xs text-gray-400 underline transition-colors hover:text-white disabled:opacity-50"
            >
              {resendMutation.isPending ? "Resending..." : "Resend OTP"}
            </button>
          </div>
        </div>

        <div className="flex justify-end gap-3 border-t border-white/10 pt-2">
          <button
            type="button"
            onClick={handleClose}
            className="rounded-[3px] border border-white/10 bg-[#141416] px-4 py-2 text-xs font-medium text-white transition-colors hover:bg-white/10"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={confirmMutation.isPending}
            className="inline-flex items-center gap-2 rounded-[3px] border border-red-500/30 bg-red-950/80 px-4 py-2 text-xs font-semibold text-red-200 transition-colors hover:bg-red-900/80 disabled:opacity-50"
          >
            <Trash2 className="h-3.5 w-3.5" />
            <span>
              {confirmMutation.isPending ? "Deleting..." : "Delete Account"}
            </span>
          </button>
        </div>
      </form>
    </Modal>
  );
}
