import { Link } from "react-router-dom";
import { Mail, ArrowLeft } from "lucide-react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

import {
  forgotPasswordSchema,
  type ForgotPasswordFormData,
} from "../../schemas/forgotPasswordSchema";
import { useForgotPasswordMutation } from "../../api/authMutations";
import { toast } from "sonner";

interface ForgotPasswordFormProps {
  onEmailSent: (email: string) => void;
}

export function ForgotPasswordForm({
  onEmailSent,
}: ForgotPasswordFormProps) {
  const forgotPasswordMutation = useForgotPasswordMutation();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<ForgotPasswordFormData>({
    resolver: zodResolver(forgotPasswordSchema),
  });

  const onSubmit = (data: ForgotPasswordFormData) => {
    forgotPasswordMutation.mutate(data, {
      onSuccess: (response) => {

        onEmailSent(data.email);
        toast.success(response.message);

      },

      onError: (error) => {
        console.error(error);
      },
    });
  };

  return (
    <div className="w-full rounded-xl border border-white/10 bg-white/3 p-6 sm:p-8">
      <h2 className="text-3xl font-extrabold tracking-tight text-white">
        Forgot Password
      </h2>

      <p className="mt-3 text-sm text-gray-400">
        Enter your account email and we&apos;ll send you a secure password reset
        link.
      </p>

      <form onSubmit={handleSubmit(onSubmit)} className="mt-8 space-y-6">
        <div className="space-y-2">
          <Label
            htmlFor="email"
            className="flex items-center gap-2 text-xs font-mono uppercase tracking-wider text-gray-400"
          >
            <Mail className="h-3.5 w-3.5 text-gray-400" />
            Email Address
          </Label>

          <Input
            id="email"
            type="email"
            placeholder="john@company.com"
            autoComplete="email"
            {...register("email")}
            className="h-12 rounded-sm border-white/10 bg-black/40 text-white placeholder:text-gray-600 focus-visible:ring-primary/40"
          />

          {errors.email && (
            <p className="text-xs text-red-500">
              {errors.email.message}
            </p>
          )}
        </div>

        <Button
          type="submit"
          disabled={forgotPasswordMutation.isPending}
          className="h-12 w-full rounded-sm bg-primary text-base font-semibold text-black hover:bg-primary/90"
        >
          {forgotPasswordMutation.isPending
            ? "Sending Link..."
            : "Send Reset Link"}
        </Button>

        <div className="pt-2 text-center">
          <Link
            to="/login"
            className="inline-flex items-center gap-2 text-sm font-semibold text-primary transition-colors hover:text-primary/80"
          >
            <ArrowLeft className="h-4 w-4" />
            Back to Sign In
          </Link>
        </div>
      </form>
    </div>
  );
}