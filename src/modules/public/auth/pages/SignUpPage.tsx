import { useState } from "react";
import { Link } from "react-router-dom";

import { SignupForm } from "../components/signup/SignupForm";
import { VerifyEmailForm } from "../components/signup/VerifyEmailForm";
import { SignupVisualPanel } from "../components/signup/SignupVisualPanel";

export default function SignupPage() {
  const [step, setStep] = useState<"register" | "verify">("register");
  const [email, setEmail] = useState("");

  return (
    <main className="grid min-h-[calc(100vh-4rem)] flex-1 grid-cols-1 lg:grid-cols-2">
      <div className="flex items-center justify-center px-4 py-12 sm:px-6 lg:px-16">
        <div className="w-full max-w-md">
          <h1 className="text-3xl font-extrabold tracking-tight sm:text-4xl">
            Create Your Workspace
          </h1>

          <p className="mt-3 text-base text-gray-400">
            Start planning projects, managing sprints and shipping better
            software with your team.
          </p>

          <div className="mt-8">
            {step === "register" ? (
              <SignupForm
                onOTPSent={(email) => {
                  setEmail(email);
                  setStep("verify");
                }}
              />
            ) : (
              <VerifyEmailForm email={email} onBack={()=> setStep("register")} />
            )}
          </div>

          {step === "register" && (
            <>
              <p className="mt-6 text-sm text-gray-400">
                Already have an account?{" "}
                <Link
                  to="/login"
                  className="font-medium text-primary hover:text-primary/80 transition-colors"
                >
                  Sign In
                </Link>
              </p>

              <p className="mt-10 font-mono text-xs leading-relaxed text-gray-600 uppercase tracking-wider">
                By creating an account, you agree to the{" "}
                <Link to="/terms" className="underline hover:text-gray-400">
                  Terms of Service
                </Link>{" "}
                and{" "}
                <Link to="/privacy" className="underline hover:text-gray-400">
                  Privacy Policy
                </Link>
                .
              </p>
            </>
          )}
        </div>
      </div>

      <SignupVisualPanel />
    </main>
  );
}