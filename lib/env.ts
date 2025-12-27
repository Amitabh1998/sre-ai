/**
 * Environment variable validation and type-safe access
 */

const requiredEnvVars = [
  // Add required env vars here when backend is ready
] as const;

const optionalEnvVars = {
  NEXT_PUBLIC_API_URL: process.env.NEXT_PUBLIC_API_URL || "",
  NEXT_PUBLIC_APP_ENV: process.env.NEXT_PUBLIC_APP_ENV || "development",
} as const;

export const env = {
  ...optionalEnvVars,
  isDevelopment: optionalEnvVars.NEXT_PUBLIC_APP_ENV === "development",
  isProduction: optionalEnvVars.NEXT_PUBLIC_APP_ENV === "production",
} as const;

/**
 * Validate required environment variables
 * Call this at app startup
 */
export function validateEnv(): void {
  const missing: string[] = [];

  requiredEnvVars.forEach((varName) => {
    if (!process.env[varName]) {
      missing.push(varName);
    }
  });

  if (missing.length > 0) {
    throw new Error(
      `Missing required environment variables: ${missing.join(", ")}`
    );
  }
}

