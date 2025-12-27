/**
 * Application-wide constants
 */

export const APP_CONFIG = {
  name: "SRE Agent",
  version: "2.4.0-stable",
  description: "AI-Powered SRE Agent for Incident Response",
} as const;

export const ROUTES = {
  HOME: "/",
  LOGIN: "/login",
  SIGNUP: "/signup",
  FORGOT_PASSWORD: "/forgot-password",
  ONBOARDING: "/onboarding",
  DASHBOARD: "/dashboard",
  INCIDENTS: "/dashboard/incidents",
  INTEGRATIONS: "/dashboard/integrations",
  SETTINGS: "/dashboard/settings",
} as const;

export const STORAGE_KEYS = {
  AUTH: "auth-storage",
  THEME: "theme-preference",
  PREFERENCES: "user-preferences",
} as const;

export const SEVERITY_LEVELS = {
  P1: { label: "P1", color: "severity-p1", priority: 1 },
  P2: { label: "P2", color: "severity-p2", priority: 2 },
  P3: { label: "P3", color: "severity-p3", priority: 3 },
  P4: { label: "P4", color: "default", priority: 4 },
} as const;

export const INCIDENT_STATUS = {
  AI_INVESTIGATING: "ai-investigating",
  HUMAN_INTERVENTION: "human-intervention",
  RESOLVED: "resolved",
  AUTO_HEALED: "auto-healed",
  INVESTIGATING: "investigating",
  ACTIVE: "active",
} as const;

export const TIME_RANGES = [
  { label: "Last 24 hours", value: "24h" },
  { label: "Last 7 days", value: "7d" },
  { label: "Last 30 days", value: "30d" },
  { label: "Last 90 days", value: "90d" },
] as const;

export const INTEGRATION_CATEGORIES = {
  ALERTING: "alerting",
  OBSERVABILITY: "observability",
  SOURCE_CONTROL: "source-control",
  COMMUNICATION: "communication",
} as const;

export const API_ENDPOINTS = {
  AUTH: "/api/auth",
  INCIDENTS: "/api/incidents",
  INTEGRATIONS: "/api/integrations",
  WEBHOOKS_ALERTS: "/api/webhooks/alerts",
} as const;

export const VALIDATION_RULES = {
  EMAIL: {
    PATTERN: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
    MESSAGE: "Invalid email address",
  },
  PASSWORD: {
    MIN_LENGTH: 8,
    MESSAGE: "Password must be at least 8 characters",
  },
} as const;

export const PAGINATION = {
  DEFAULT_PAGE_SIZE: 10,
  MAX_PAGE_SIZE: 100,
} as const;

