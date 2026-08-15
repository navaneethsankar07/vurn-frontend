import { useState } from "react";
import { Eye, EyeOff, ArrowRight } from "lucide-react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

import {
  resetPasswordSchema,
  type ResetPasswordFormData,
} from "../../schemas/resetPasswordSchema";
import { useResetPasswordMutation } from "../../api/authMutations";
import type { ResetPasswordRequest } from "../../types";
import { toast } from "sonner";

interface ResetPasswordFormProps {
  token: string;
  onSuccess?: () => void;
}

export function ResetPasswordForm({
  token,
  onSuccess,
}: ResetPasswordFormProps) {
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const resetPasswordMutation = useResetPasswordMutation();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<ResetPasswordFormData>({
    resolver: zodResolver(resetPasswordSchema),
  });

  const onSubmit = (data: ResetPasswordFormData) => {
    const payload: ResetPasswordRequest = {
      token,
      password: data.password,
      confirm_password: data.confirm_password,
    };

    resetPasswordMutation.mutate(payload, {
      onSuccess: (response) => {
        toast.success(response.message);

        onSuccess?.();
      },
      onError: (error) => {
        console.error(error);
      },
    });
  };

  return (
    <div className="w-full rounded-xl border border-white/10 bg-white/3 p-6 sm:p-8">
      <h2 className="text-3xl font-extrabold tracking-tight text-white">
        Reset Password
      </h2>
      <p className="mt-3 text-sm text-gray-400">
        Please enter your new password below to secure your account.
      </p>

      <form onSubmit={handleSubmit(onSubmit)} className="mt-8 space-y-6">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label
              htmlFor="password"
              className="text-xs font-mono uppercase tracking-wider text-gray-400"
            >
              New Password
            </Label>
            <div className="relative">
              <Input
                id="password"
                type={showPassword ? "text" : "password"}
                placeholder="••••••••"
                autoComplete="new-password"
                {...register("password")}
                className="h-12 border-white/10 bg-black/40 pr-10 text-white placeholder:text-gray-600 focus-visible:ring-primary/40 rounded-sm"
              />
              <button
                type="button"
                onClick={() => setShowPassword((v) => !v)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-300"
                aria-label={showPassword ? "Hide password" : "Show password"}
              >
                {showPassword ? (
                  <EyeOff className="h-4 w-4" />
                ) : (
                  <Eye className="h-4 w-4" />
                )}
              </button>
            </div>
            {errors.password && (
              <p className="text-xs text-red-500">{errors.password.message}</p>
            )}
          </div>

          <div className="space-y-2">
            <Label
              htmlFor="confirmPassword"
              className="text-xs font-mono uppercase tracking-wider text-gray-400"
            >
              Confirm
            </Label>
            <div className="relative">
              <Input
                id="confirmPassword"
                type={showConfirm ? "text" : "password"}
                placeholder="••••••••"
                autoComplete="new-password"
                {...register("confirm_password")}
                className="h-12 border-white/10 bg-black/40 pr-10 text-white placeholder:text-gray-600 focus-visible:ring-primary/40 rounded-sm"
              />
              <button
                type="button"
                onClick={() => setShowConfirm((v) => !v)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-300"
                aria-label={showConfirm ? "Hide password" : "Show password"}
              >
                {showConfirm ? (
                  <EyeOff className="h-4 w-4" />
                ) : (
                  <Eye className="h-4 w-4" />
                )}
              </button>
            </div>
            {errors.confirm_password && (
              <p className="text-xs text-red-500">
                {errors.confirm_password.message}
              </p>
            )}
          </div>

          <div className="flex gap-1.5 sm:col-span-2">
            <span className="h-1 flex-1 rounded-full bg-primary" />
            <span className="h-1 flex-1 rounded-full bg-primary" />
            <span className="h-1 flex-1 rounded-full bg-white/10" />
            <span className="h-1 flex-1 rounded-full bg-white/10" />
          </div>
        </div>

        <Button
          type="submit"
          disabled={resetPasswordMutation.isPending}
          className="h-12 w-full rounded-sm gap-2 bg-primary text-base font-semibold text-black hover:bg-primary/90"
        >
          {resetPasswordMutation.isPending ? "Resetting..." : "Reset Password"}
          <ArrowRight className="h-4 w-4" />
        </Button>
      </form>
    </div>
  );
}
