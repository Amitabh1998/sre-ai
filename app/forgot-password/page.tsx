"use client";

import { useState } from "react";
import Link from "next/link";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { ErrorMessage } from "@/components/ui/ErrorMessage";
import { forgotPasswordSchema, type ForgotPasswordFormData } from "@/lib/validation/schemas";

export default function ForgotPasswordPage() {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<ForgotPasswordFormData>({
    resolver: zodResolver(forgotPasswordSchema),
  });

  const onSubmit = async (data: ForgotPasswordFormData) => {
    setIsLoading(true);
    setError(null);
    
    try {
      // Mock password reset - in production, this would call an API
      await new Promise((resolve) => setTimeout(resolve, 1000));
      setSuccess(true);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to send reset link. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center px-4">
      <div className="w-full max-w-sm">
        <div className="mb-8 text-center">
          <div className="flex items-center justify-center gap-2 mb-6">
            <div className="h-10 w-10 rounded bg-primary flex items-center justify-center">
              <span className="text-white text-xl">✈</span>
            </div>
            <span className="text-2xl font-semibold text-white">SRE.ai</span>
          </div>
          <h1 className="text-3xl font-bold text-white mb-2">
            Reset your password
          </h1>
          <p className="text-slate-400">
            Enter your email address and we&apos;ll send you a link to reset your password.
          </p>
        </div>

        {success ? (
          <div className="rounded-lg border border-success/50 bg-success/10 p-4">
            <div className="flex items-start gap-3">
              <span className="material-symbols-outlined text-success">check_circle</span>
              <div>
                <p className="text-sm font-medium text-success">Reset link sent</p>
                <p className="text-sm text-slate-300 mt-1">
                  Check your email for password reset instructions.
                </p>
              </div>
            </div>
          </div>
        ) : (
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            {error && <ErrorMessage error={error} />}
            
            <Input
              type="email"
              label="Work Email"
              placeholder="name@company.com"
              icon={<span className="material-symbols-outlined">mail</span>}
              {...register("email")}
              error={errors.email?.message}
            />

            <Button
              type="submit"
              variant="primary"
              className="w-full"
              disabled={isLoading}
              loading={isLoading}
            >
              Send Reset Link
            </Button>
          </form>
        )}

        <p className="mt-6 text-center text-sm text-slate-400">
          Remember your password?{" "}
          <Link href="/login" className="text-primary hover:text-primary/80">
            Sign in
          </Link>
        </p>
      </div>
    </div>
  );
}

