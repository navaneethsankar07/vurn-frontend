import { useState } from "react";
import { Eye, EyeOff, ArrowRight } from "lucide-react";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";

import { type RegisterRequest } from "../../types";

import { registerSchema } from "../../schemas/registerSchema";

import { useSendOTPMutation } from "../../api/authMutations";
import { GoogleAuthButton } from "../shared/GoogleAuthButton";

interface SignupFormProps {
  onOTPSent: (email: string) => void;
}

export function SignupForm({ onOTPSent }: SignupFormProps) {
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const sendOTPMutation = useSendOTPMutation();
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<RegisterRequest>({
    resolver: zodResolver(registerSchema),
  });

  const onSubmit = (data: RegisterRequest) => {
    sendOTPMutation.mutate(data, {
      onSuccess: () => {
        onOTPSent(data.email);
      },

      onError: (error) => {
        console.error(error);
      },
    });
  };

  return (
    <div className="rounded-xl border border-white/10 bg-white/3 p-6 sm:p-8">
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        {/* First & Last Name */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label
              htmlFor="first_name"
              className="text-xs font-mono uppercase tracking-wider text-gray-400"
            >
              First Name
            </Label>
            <Input
              id="first_name"
              type="text"
              placeholder="John"
              autoComplete="given-name"
              {...register("first_name")}
              className="h-12 border-white/10 bg-black/40 text-white placeholder:text-gray-600 focus-visible:ring-amber-500/40 rounded-sm"
            />
            {errors.first_name && (
              <p className="text-xs text-red-500">
                {errors.first_name.message}
              </p>
            )}
          </div>

          <div className="space-y-2">
            <Label
              htmlFor="last_name"
              className="text-xs font-mono uppercase tracking-wider text-gray-400"
            >
              Last Name
            </Label>
            <Input
              id="last_name"
              type="text"
              placeholder="Doe"
              autoComplete="family-name"
              {...register("last_name")}
              className="h-12 border-white/10 bg-black/40 text-white placeholder:text-gray-600 focus-visible:ring-amber-500/40 rounded-sm"
            />
            {errors.last_name && (
              <p className="text-xs text-red-500">{errors.last_name.message}</p>
            )}
          </div>
        </div>

        {/* Username */}
        <div className="space-y-2">
          <Label
            htmlFor="username"
            className="text-xs font-mono uppercase tracking-wider text-gray-400"
          >
            Username
          </Label>
          <Input
            id="username"
            type="text"
            placeholder="johndoe"
            autoComplete="username"
            {...register("username")}
            className="h-12 border-white/10 bg-black/40 text-white placeholder:text-gray-600 focus-visible:ring-amber-500/40 rounded-sm"
          />
          {errors.username && (
            <p className="text-xs text-red-500">{errors.username.message}</p>
          )}
        </div>

        {/* Email */}
        <div className="space-y-2">
          <Label
            htmlFor="email"
            className="text-xs font-mono uppercase tracking-wider text-gray-400"
          >
            Email Address
          </Label>
          <Input
            id="email"
            type="email"
            placeholder="john@company.com"
            autoComplete="email"
            {...register("email")}
            className="h-12 border-white/10 bg-black/40 text-white placeholder:text-gray-600 focus-visible:ring-amber-500/40 rounded-sm"
          />
          {errors.email && (
            <p className="text-xs text-red-500">{errors.email.message}</p>
          )}
        </div>

        {/* Password + Confirm */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label
              htmlFor="password"
              className="text-xs font-mono uppercase tracking-wider text-gray-400"
            >
              Password
            </Label>
            <div className="relative">
              <Input
                id="password"
                type={showPassword ? "text" : "password"}
                placeholder="••••••••"
                autoComplete="new-password"
                {...register("password")}
                className="h-12 border-white/10 bg-black/40 pr-10 text-white placeholder:text-gray-600 focus-visible:ring-amber-500/40 rounded-sm"
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
                className="h-12 border-white/10 bg-black/40 pr-10 text-white placeholder:text-gray-600 focus-visible:ring-amber-500/40 rounded-sm"
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

          <div className="flex gap-1.5">
            <span className="h-1 flex-1 rounded-full bg-primary" />
            <span className="h-1 flex-1 rounded-full bg-primary" />
            <span className="h-1 flex-1 rounded-full bg-white/10" />
            <span className="h-1 flex-1 rounded-full bg-white/10" />
          </div>
        </div>

        {/* Submit */}
        <Button
          type="submit"
          className="h-12 w-full rounded-sm gap-2 bg-primary text-base font-semibold text-black hover:bg-amber-500/90"
        >
          Create Account
          <ArrowRight className="h-4 w-4" />
        </Button>

        <div className="flex items-center gap-4">
          <Separator className="flex-1 bg-white/10" />
          <span className="text-xs font-mono uppercase tracking-wider text-gray-500">
            Or
          </span>
          <Separator className="flex-1 bg-white/10" />
        </div>

        <div className="grid grid-cols-2 gap-3">
          <div id="google-button" className="hidden">
            <GoogleAuthButton />
          </div>

          <button
            type="button"
            aria-label="Continue with Google"
            onClick={() => {
              const googleButton = document.querySelector(
                "#google-button div[role='button']",
              ) as HTMLDivElement | null;

              googleButton?.click();
            }}
            className="flex h-12 items-center justify-center rounded-sm border  border-white/10 bg-black/40 text-white transition-colors hover:bg-white/5"
          >
            <svg className="h-5 w-5" viewBox="0 0 24 24">
              <path
                fill="#EA4335"
                d="M12 5c1.6 0 3 .6 4.1 1.6l3.1-3.1C17.3 1.7 14.8 1 12 1 7.5 1 3.7 3.6 1.9 7.3l3.7 2.9C6.5 7.2 9 5 12 5z"
              />
              <path
                fill="#4285F4"
                d="M23.5 12.3c0-.8-.1-1.6-.2-2.3H12v4.5h6.5c-.3 1.5-1.1 2.8-2.4 3.7l3.7 2.9c2.2-2 3.7-5 3.7-8.8z"
              />
              <path
                fill="#FBBC05"
                d="M5.6 14.8c-.2-.7-.4-1.5-.4-2.3s.2-1.6.4-2.3L1.9 7.3C.7 9.7 0 10.8 0 12.5s.7 2.8 1.9 5.2l3.7-2.9z"
              />
              <path
                fill="#34A853"
                d="M12 23c3.2 0 6-1.1 8-3l-3.7-2.9c-1.1.7-2.5 1.2-4.3 1.2-3 0-5.5-2.2-6.4-5.2L1.9 16C3.7 19.7 7.5 23 12 23z"
              />
            </svg>
          </button>

          <button
            type="button"
            aria-label="Continue with GitHub"
            className="flex h-12 items-center justify-center rounded-sm border border-white/10 bg-black/40 text-white transition-colors hover:bg-white/5"
          >
            <svg
              className="h-5 w-5 fill-current"
              viewBox="0 0 24 24"
              aria-hidden="true"
            >
              <path
                fillRule="evenodd"
                clipRule="evenodd"
                d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.53 1.032 1.53 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z"
              />
            </svg>
          </button>
        </div>
      </form>
    </div>
  );
}
