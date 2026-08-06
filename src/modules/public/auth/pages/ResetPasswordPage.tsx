import { useState } from "react";
import { useSearchParams, Link } from "react-router-dom";

import { ResetPasswordForm } from "../components/reset-password/ResetPasswordForm";
import { ResetPasswordSuccess } from "../components/reset-password/ResetPasswordSuccess";
import { SignupVisualPanel } from "../components/signup/SignupVisualPanel";

export default function ResetPasswordPage() {
  const [searchParams] = useSearchParams();
  const token = searchParams.get("token") || "";
  const [isSuccess, setIsSuccess] = useState(false);

  return (
    <main className="grid min-h-[calc(100vh-4rem)] flex-1 grid-cols-1 lg:grid-cols-2">
      <div className="flex items-center justify-center px-4 py-12 sm:px-6 lg:px-16">
        <div className="w-full max-w-md">
          {!isSuccess ? (
            <ResetPasswordForm
              token={token}
              onSuccess={() => setIsSuccess(true)}
            />
          ) : (
            <ResetPasswordSuccess />
          )}

          <p className="mt-10 font-mono text-xs leading-relaxed text-gray-600 uppercase tracking-wider">
            By accessing this service, you agree to the{" "}
            <Link to="/terms" className="underline hover:text-gray-400">
              Terms of Service
            </Link>{" "}
            and{" "}
            <Link to="/privacy" className="underline hover:text-gray-400">
              Privacy Policy
            </Link>
            .
          </p>
        </div>
      </div>

      <SignupVisualPanel />
    </main>
  );
}