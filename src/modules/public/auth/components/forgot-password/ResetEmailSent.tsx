import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { Mail, ArrowLeft } from "lucide-react";

import { Button } from "@/components/ui/button";

interface ResetEmailSentProps {
  email: string;
  onResend: (email: string) => void;
  resendCooldown?: number;
}

export function ResetEmailSent({
  email,
  onResend,
  resendCooldown = 40,
}: ResetEmailSentProps) {
  const [secondsLeft, setSecondsLeft] = useState(0);

  useEffect(() => {
    if (secondsLeft <= 0) return;

    const timer = setInterval(() => {
      setSecondsLeft((seconds) => Math.max(0, seconds - 1));
    }, 1000);

    return () => clearInterval(timer);
  }, [secondsLeft]);

  function handleResendClick() {
    if (secondsLeft > 0) return;

    onResend(email);
    setSecondsLeft(resendCooldown);
  }

  return (
    <div className="w-full rounded-xl border border-white/10 bg-white/3 p-6 sm:p-8">
      <div className="flex h-12 w-12 items-center justify-center rounded-full border border-primary/30 bg-primary/10">
        <Mail className="h-5 w-5 text-primary" />
      </div>

      <h2 className="mt-6 text-3xl font-extrabold tracking-tight text-white">
        Check Your Email
      </h2>

      <p className="mt-4 text-sm text-gray-400">
        We&apos;ve sent a password reset link to:
      </p>

      <p className="mt-1 font-mono text-base font-semibold text-primary">
        {email}
      </p>

      <div className="mt-6 rounded-md border border-white/5 bg-black/40 p-4">
        <p className="text-xs leading-relaxed text-gray-400">
          If an account exists for this email, you&apos;ll receive instructions
          to reset your password.
        </p>
      </div>

      <div className="mt-8 space-y-3">
        <Button
          type="button"
          onClick={handleResendClick}
          disabled={secondsLeft > 0}
          variant="outline"
          className="h-12 w-full border-primary/40 bg-transparent font-mono text-xs uppercase tracking-wider text-primary hover:bg-primary/10 hover:text-primary disabled:border-white/10 disabled:text-gray-500"
        >
          {secondsLeft > 0 ? `Resend in ${secondsLeft}s` : "Resend Email"}
        </Button>

        <Link
          to="/login"
          className="flex h-12 w-full items-center justify-center gap-2 rounded-sm border border-white/10 bg-black/40 font-mono text-xs uppercase tracking-wider text-white transition-colors hover:bg-white/5"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to Sign In
        </Link>
      </div>
    </div>
  );
}
