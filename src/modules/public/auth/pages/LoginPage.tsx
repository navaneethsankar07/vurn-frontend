// src/pages/LoginPage.tsx
import { Link } from "react-router-dom";

import { LoginForm } from "../components/login/LoginForm";
import { SignupVisualPanel } from "../components/signup/SignupVisualPanel";

export default function LoginPage() {
  return (
    <main className="grid min-h-[calc(100vh-4rem)] flex-1 grid-cols-1 lg:grid-cols-2">
      <div className="flex items-center justify-center px-4 py-12 sm:px-6 lg:px-16">
        <div className="w-full max-w-md">
          <h1 className="text-3xl font-extrabold tracking-tight sm:text-4xl text-white">
            Welcome Back
          </h1>

          <p className="mt-3 text-base text-gray-400">
            Sign in to access your projects, track sprints, and continue
            building.
          </p>

          <div className="mt-8">
            <LoginForm />
          </div>

          <p className="mt-6 text-sm text-gray-400">
            Don&apos;t have an account?{" "}
            <Link
              to="/signup"
              className="font-medium text-primary hover:text-primary/80 transition-colors"
            >
              Sign Up
            </Link>
          </p>

          <p className="mt-10 font-mono text-xs leading-relaxed text-gray-600 uppercase tracking-wider">
            By signing in, you agree to the{" "}
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