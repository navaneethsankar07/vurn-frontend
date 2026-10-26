import { Link } from "react-router-dom";
import { Check, ArrowRight } from "lucide-react";

export function ResetPasswordSuccess() {
  return (
    <div className="w-full rounded-xl border border-white/10 bg-white/3 p-6 sm:p-8">
      <div className="flex h-12 w-12 items-center justify-center rounded-full border border-primary/30 bg-primary/10">
        <Check className="h-6 w-6 text-primary" />
      </div>

      <h2 className="mt-6 text-3xl font-extrabold tracking-tight text-white">
        Password Reset
      </h2>

      <p className="mt-3 text-sm text-gray-400">
        Your password has been successfully updated. You can now log in with
        your new credentials.
      </p>

      <div className="mt-8">
        <Link
          to="/login"
          className="flex h-12 w-full items-center justify-center gap-2 rounded-sm bg-primary text-base font-semibold text-black transition-colors hover:bg-primary/90"
        >
          Continue to Sign In
          <ArrowRight className="h-4 w-4" />
        </Link>
      </div>
    </div>
  );
}
