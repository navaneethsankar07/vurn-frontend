import { useState } from "react";
import { Eye, EyeOff, ExternalLink } from "lucide-react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useChangePasswordMutation } from "../api/accountMutations";
import { useLoginMethodQuery } from "../api/accountQueries";
import {
  changePasswordSchema,
  type ChangePasswordSchema,
} from "../schemas/securitySettingsSchema";
import { toast } from "sonner";

export default function SecuritySettingsPage() {
  const [showCurrent, setShowCurrent] = useState(false);
  const [showNew, setShowNew] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);

  const { data: loginMethodData, isLoading: isLoadingMethod } =
    useLoginMethodQuery();
  const changePasswordMutation = useChangePasswordMutation();

  const {
    register,
    handleSubmit,
    reset,
    setError,
    formState: { errors },
  } = useForm<ChangePasswordSchema>({
    resolver: zodResolver(changePasswordSchema),
    defaultValues: {
      current_password: "",
      new_password: "",
      confirm_password: "",
    },
  });

  const onSubmit = (data: ChangePasswordSchema) => {
    changePasswordMutation.mutate(data, {
      onSuccess: (response) => {
        reset();
        toast.success(response.message);
      },
      onError: (error: any) => {
        const apiErrors = error?.response?.data;
        if (apiErrors?.current_password) {
          setError("current_password", {
            type: "server",
            message: Array.isArray(apiErrors.current_password)
              ? apiErrors.current_password[0]
              : apiErrors.current_password,
          });
        }
        if (apiErrors?.new_password) {
          setError("new_password", {
            type: "server",
            message: Array.isArray(apiErrors.new_password)
              ? apiErrors.new_password[0]
              : apiErrors.new_password,
          });
        }
        if (apiErrors?.confirm_password) {
          setError("confirm_password", {
            type: "server",
            message: Array.isArray(apiErrors.confirm_password)
              ? apiErrors.confirm_password[0]
              : apiErrors.confirm_password,
          });
        }
      },
    });
  };

  if (isLoadingMethod) {
    return (
      <div className="font-mono text-sm text-gray-400">
        Loading security details...
      </div>
    );
  }

  const isEmailLogin = loginMethodData?.is_email_login;

  return (
    <div className="w-full max-w-5xl space-y-8 font-mono">
      <div className="border-b border-white/10 pb-4">
        <h2 className="text-lg font-semibold tracking-tight text-white">
          Security
        </h2>
        <p className="mt-1 text-xs text-gray-400">
          Manage your personal account preferences.
        </p>
      </div>

      {!isEmailLogin ? (
        <div className="rounded-[3px] border border-white/10 bg-[#030303] p-5 space-y-3">
          <h3 className="text-sm font-semibold text-white">
            Google Authentication
          </h3>
          <p className="text-xs text-gray-400 leading-relaxed">
            Your account is authenticated using Google. Password management is
            handled directly through your Google Account.
          </p>
          <div className="pt-2">
            <a
              href="https://myaccount.google.com/security"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 rounded-[3px] border border-white/10 bg-[#141416] px-4 py-2.5 text-xs font-medium text-white transition-colors hover:bg-white/10"
            >
              <span>Manage Google Account Security</span>
              <ExternalLink className="h-3.5 w-3.5 text-gray-400" />
            </a>
          </div>
        </div>
      ) : (
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          <div>
            <h3 className="text-sm font-semibold text-white">
              Change Password
            </h3>
            <p className="mt-1 text-xs text-gray-400">
              Use a strong, unique password to protect your account.
            </p>
          </div>

          <div className="space-y-2">
            <label className="text-xs text-gray-300">Current Password</label>
            <div className="relative">
              <input
                type={showCurrent ? "text" : "password"}
                {...register("current_password")}
                placeholder="••••••••"
                className="w-full rounded-[3px] border border-white/10 bg-[#030303] px-3.5 py-2.5 pr-10 text-sm text-white placeholder-gray-600 outline-none focus:border-white/30"
              />
              <button
                type="button"
                onClick={() => setShowCurrent(!showCurrent)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-300 transition-colors"
              >
                {showCurrent ? (
                  <EyeOff className="h-4 w-4" />
                ) : (
                  <Eye className="h-4 w-4" />
                )}
              </button>
            </div>
            {errors.current_password && (
              <p className="text-[11px] text-red-400">
                {errors.current_password.message}
              </p>
            )}
          </div>

          <div className="space-y-2">
            <label className="text-xs text-gray-300">New Password</label>
            <div className="relative">
              <input
                type={showNew ? "text" : "password"}
                {...register("new_password")}
                placeholder="••••••••"
                className="w-full rounded-[3px] border border-white/10 bg-[#030303] px-3.5 py-2.5 pr-10 text-sm text-white placeholder-gray-600 outline-none focus:border-white/30"
              />
              <button
                type="button"
                onClick={() => setShowNew(!showNew)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-300 transition-colors"
              >
                {showNew ? (
                  <EyeOff className="h-4 w-4" />
                ) : (
                  <Eye className="h-4 w-4" />
                )}
              </button>
            </div>
            {errors.new_password && (
              <p className="text-[11px] text-red-400">
                {errors.new_password.message}
              </p>
            )}
          </div>

          <div className="space-y-2">
            <label className="text-xs text-gray-300">Confirm Password</label>
            <div className="relative">
              <input
                type={showConfirm ? "text" : "password"}
                {...register("confirm_password")}
                placeholder="••••••••"
                className="w-full rounded-[3px] border border-white/10 bg-[#030303] px-3.5 py-2.5 pr-10 text-sm text-white placeholder-gray-600 outline-none focus:border-white/30"
              />
              <button
                type="button"
                onClick={() => setShowConfirm(!showConfirm)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-300 transition-colors"
              >
                {showConfirm ? (
                  <EyeOff className="h-4 w-4" />
                ) : (
                  <Eye className="h-4 w-4" />
                )}
              </button>
            </div>
            {errors.confirm_password && (
              <p className="text-[11px] text-red-400">
                {errors.confirm_password.message}
              </p>
            )}
          </div>

          <div className="pt-2 flex justify-end">
            <button
              type="submit"
              disabled={changePasswordMutation.isPending}
              className="rounded-[3px] border border-amber-500/80 bg-amber-500/10 px-5 py-2 text-xs font-semibold text-amber-500 transition-colors hover:bg-amber-500/20 disabled:opacity-50"
            >
              {changePasswordMutation.isPending
                ? "Updating..."
                : "Update Password"}
            </button>
          </div>
        </form>
      )}
    </div>
  );
}
