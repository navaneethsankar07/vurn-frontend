import { useEffect, useRef, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@/components/ui/button";
import { otpSchema, type OTPFormData } from "../../schemas/otpSchema";
import type { VerifyOTPRequest } from "../../types";
import {
  OTP_LENGTH,
  OTP_RESEND_SECONDS,
} from "@/utils/constants/auth.constants";
import {
  useRegisterMutation,
  useResendOtpMutation,
} from "../../api/authMutations";
import { useAppDispatch } from "@/app/hooks";
import { useNavigate } from "react-router-dom";
import { setCredentials } from "../../authSlice";
import { toast } from "sonner";

interface VerifyEmailFormProps {
  email: string;
  onBack: () => void;
}

export function VerifyEmailForm({ email, onBack }: VerifyEmailFormProps) {
  const [digits, setDigits] = useState<string[]>(Array(OTP_LENGTH).fill(""));
  const [secondsLeft, setSecondsLeft] = useState(OTP_RESEND_SECONDS);

  const inputsRef = useRef<Array<HTMLInputElement | null>>([]);

  const userRegistrationMutation = useRegisterMutation();
  const resendOtpMutation = useResendOtpMutation();
  const dispatch = useAppDispatch();
  const navigate = useNavigate();

  const {
    setValue,
    handleSubmit,
    formState: { errors },
  } = useForm<OTPFormData>({
    resolver: zodResolver(otpSchema),
    defaultValues: {
      otp: "",
    },
  });

  const code = digits.join("");
  const isComplete = code.length === OTP_LENGTH;

  useEffect(() => {
    setValue("otp", code, {
      shouldValidate: true,
    });
  }, [code, setValue]);

  useEffect(() => {
    if (secondsLeft <= 0) return;

    const timer = setInterval(() => {
      setSecondsLeft((seconds) => Math.max(0, seconds - 1));
    }, 1000);

    return () => clearInterval(timer);
  }, [secondsLeft]);

  function handleChange(index: number, value: string) {
    const digit = value.replace(/\D/g, "").slice(-1);

    setDigits((previous) => {
      const next = [...previous];
      next[index] = digit;
      return next;
    });

    if (digit && index < OTP_LENGTH - 1) {
      inputsRef.current[index + 1]?.focus();
    }
  }

  function handleKeyDown(
    index: number,
    event: React.KeyboardEvent<HTMLInputElement>,
  ) {
    if (event.key === "Backspace" && !digits[index] && index > 0) {
      inputsRef.current[index - 1]?.focus();
    }
  }

  function handlePaste(event: React.ClipboardEvent<HTMLInputElement>) {
    const pasted = event.clipboardData.getData("text").replace(/\D/g, "");

    if (!pasted) return;

    event.preventDefault();

    setDigits((previous) => {
      const next = [...previous];

      for (let i = 0; i < OTP_LENGTH; i++) {
        next[i] = pasted[i] ?? next[i] ?? "";
      }

      return next;
    });

    const nextEmptyIndex = Math.min(pasted.length, OTP_LENGTH - 1);

    inputsRef.current[nextEmptyIndex]?.focus();
  }

  function onSubmit(data: OTPFormData) {
    console.log("Form Submitted");
    console.log(data);
    const payload: VerifyOTPRequest = {
      email,
      otp: data.otp,
    };

    userRegistrationMutation.mutate(payload, {
      onSuccess: (response) => {
        dispatch(
          setCredentials({
            user: response.user,
            accessToken: response.access,
          }),
        );
        navigate("/dashboard");
        toast.success(response.message)
      },

      onError: (error) => {
        console.error(error);
      },
    });
  }

  function handleResend() {
    if (secondsLeft > 0 || resendOtpMutation.isPending) return;

    resendOtpMutation.mutate(email, {
      onSuccess: () => {
        setSecondsLeft(OTP_RESEND_SECONDS);
      },
      onError: (error: any) => {
        console.error(error);
        if (error?.response?.data?.retry_after_seconds) {
          setSecondsLeft(error.response.data.retry_after_seconds);
        }
      },
    });
  }

  return (
    <div className="w-full max-w-md rounded-xl border border-white/10 bg-white/3 p-6 sm:p-8">
      <h1 className="text-3xl font-extrabold tracking-tight text-white sm:text-4xl">
        Verify Your Email
      </h1>

      <p className="mt-4 text-base text-gray-400">
        We&apos;ve sent a 6-digit verification code to:
      </p>
      <p className="mt-1 font-mono text-lg font-semibold text-primary">
        {email}
      </p>

      <form onSubmit={handleSubmit(onSubmit)} className="mt-8 space-y-6">
        <div className="flex justify-between gap-2 sm:gap-3">
          {digits.map((digit, index) => (
            <input
              key={index}
              ref={(el) => {
                inputsRef.current[index] = el;
              }}
              type="text"
              inputMode="numeric"
              maxLength={1}
              value={digit}
              onChange={(e) => handleChange(index, e.target.value)}
              onKeyDown={(e) => handleKeyDown(index, e)}
              onPaste={handlePaste}
              aria-label={`Digit ${index + 1}`}
              className="h-16 w-full min-w-0 rounded-lg border border-white/10 bg-black/60 text-center font-mono text-2xl font-semibold text-white outline-none transition-colors focus:border-primary/60 focus:ring-2 focus:ring-primary/30"
            />
          ))}
        </div>

        {errors.otp && (
          <p className="text-center text-xs text-red-500">
            {errors.otp.message}
          </p>
        )}

        <Button
          type="submit"
          disabled={!isComplete || userRegistrationMutation.isPending}
          className="h-12 w-full bg-primary font-mono text-base font-semibold text-black hover:bg-primary/90 disabled:cursor-not-allowed disabled:bg-primary/40 disabled:text-black/60"
        >
          {userRegistrationMutation.isPending ? "Verifying..." : "Verify Email"}
        </Button>

        <p className="text-center text-sm text-gray-400">
          Didn&apos;t receive the code?{" "}
          {secondsLeft > 0 ? (
            <span className="font-mono text-gray-500">
              Resend in {secondsLeft}s
            </span>
          ) : (
            <button
              type="button"
              onClick={handleResend}
              disabled={resendOtpMutation.isPending}
              className="font-mono font-medium text-primary hover:text-primary/80 disabled:opacity-50"
            >
              {resendOtpMutation.isPending ? "Sending..." : "Resend code"}
            </button>
          )}
        </p>

        <div className="text-center">
          <button
            type="button"
            onClick={onBack}
            className="text-sm text-gray-500 transition-colors hover:text-gray-300"
          >
            Use a different email
          </button>
        </div>
      </form>
    </div>
  );
}