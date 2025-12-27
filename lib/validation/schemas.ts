/**
 * Zod validation schemas for forms
 */

import { z } from "zod";
import { VALIDATION_RULES } from "@/lib/constants";

export const emailSchema = z
  .string()
  .min(1, "Email is required")
  .email(VALIDATION_RULES.EMAIL.MESSAGE)
  .regex(VALIDATION_RULES.EMAIL.PATTERN, VALIDATION_RULES.EMAIL.MESSAGE);

export const passwordSchema = z
  .string()
  .min(
    VALIDATION_RULES.PASSWORD.MIN_LENGTH,
    VALIDATION_RULES.PASSWORD.MESSAGE
  )
  .regex(
    /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/,
    "Password must contain at least one uppercase letter, one lowercase letter, and one number"
  );

export const loginSchema = z.object({
  email: emailSchema,
  password: z.string().min(1, "Password is required"),
});

export const signupSchema = z
  .object({
    email: emailSchema,
    password: passwordSchema,
    confirmPassword: z.string(),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords don't match",
    path: ["confirmPassword"],
  });

export const forgotPasswordSchema = z.object({
  email: emailSchema,
});

export const inviteMemberSchema = z.object({
  email: emailSchema,
  role: z.enum(["admin", "member", "viewer"]),
});

export type LoginFormData = z.infer<typeof loginSchema>;
export type SignupFormData = z.infer<typeof signupSchema>;
export type ForgotPasswordFormData = z.infer<typeof forgotPasswordSchema>;
export type InviteMemberFormData = z.infer<typeof inviteMemberSchema>;

