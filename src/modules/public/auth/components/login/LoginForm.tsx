import { useState } from "react";
import { Eye, EyeOff, ArrowRight } from "lucide-react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import {
  loginSchema,
  type LoginFormData,
} from "../../schemas/loginSchema";
import type { LoginRequest } from "../../types";
import { useLoginMutation } from "../../api/authMutations";
import { GoogleAuthButton } from "../shared/GoogleAuthButton";

interface LoginFormProps {}

export function LoginForm({}: LoginFormProps) {
  const [showPassword, setShowPassword] = useState(false);
  const loginMutation = useLoginMutation();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
  });

  const onSubmit = (data: LoginFormData) => {
    const payload: LoginRequest = {
      email: data.email,
      password: data.password,
    };

    loginMutation.mutate(payload, {
      onSuccess: (response) => {
        console.log("Message:", response.message);
        console.log("User:", response.user);
        console.log("Access Token:", response.access);

        // TODO:
        // Dispatch Redux auth state
        // Navigate to dashboard
      },

      onError: (error) => {
        console.error(error);
      },
    });
  };

  return (
    <div className="rounded-xl border border-white/10 bg-white/3 p-6 sm:p-8">
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
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
            className="h-12 border-white/10 bg-black/40 text-white placeholder:text-gray-600 focus-visible:ring-primary/40 rounded-sm"
          />
          {errors.email && (
            <p className="text-xs text-red-500">{errors.email.message}</p>
          )}
        </div>

        {/* Password */}
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <Label
              htmlFor="password"
              className="text-xs font-mono uppercase tracking-wider text-gray-400"
            >
              Password
            </Label>
            <a
              href="#forgot-password"
              className="text-xs font-mono uppercase tracking-wider text-primary hover:text-primary/80 transition-colors"
            >
              Forgot?
            </a>
          </div>
          <div className="relative">
            <Input
              id="password"
              type={showPassword ? "text" : "password"}
              placeholder="••••••••"
              autoComplete="current-password"
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

        {/* Submit */}
        <Button
          type="submit"
          disabled={loginMutation.isPending}
          className="h-12 w-full rounded-sm gap-2 bg-primary text-base font-semibold text-black hover:bg-primary/90"
        >
          {loginMutation.isPending ? "Signing In..." : "Sign In"}
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
          <button
            type="button"
            aria-label="Continue with Google"
            className="flex h-12 items-center justify-center rounded-sm border border-white/10 bg-white transition-colors hover:bg-white/80 hover:border-black"
          >
            <GoogleAuthButton />
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