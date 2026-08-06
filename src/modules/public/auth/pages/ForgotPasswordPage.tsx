import { useState } from "react";
import { Link } from "react-router-dom";

import { ForgotPasswordForm } from "../components/forgot-password/ForgotPasswordForm";
import { ResetEmailSent } from "../components/forgot-password/ResetEmailSent";
import { SignupVisualPanel } from "../components/signup/SignupVisualPanel";
import { useForgotPasswordMutation } from "../api/authMutations";

export default function ForgotPasswordPage() {
  const [step, setStep] = useState<"forgot" | "sent">("forgot");
  const [email, setEmail] = useState("");
  const forgotPasswordMutation = useForgotPasswordMutation();

  return (
    <main className="grid min-h-[calc(100vh-4rem)] flex-1 grid-cols-1 lg:grid-cols-2">
      <div className="flex items-center justify-center px-4 py-12 sm:px-6 lg:px-16">
        <div className="w-full max-w-md">
          {step === "forgot" ? (
            <ForgotPasswordForm
              onEmailSent={(email) => {
                setEmail(email);
                setStep("sent");
              }}
            />
          ) : (
            <ResetEmailSent
              email={email}
              onResend={(email) => {
                forgotPasswordMutation.mutate({ email });
              }}
            />
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
