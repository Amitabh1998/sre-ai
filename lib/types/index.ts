/**
 * Shared TypeScript types and interfaces
 */

export interface User {
  id: string;
  email: string;
  name: string;
  avatar?: string;
  role?: "admin" | "member" | "viewer";
}

export interface Incident {
  id: string;
  title: string;
  service: string;
  severity: "P1" | "P2" | "P3" | "P4";
  status:
    | "ai-investigating"
    | "human-intervention"
    | "resolved"
    | "auto-healed"
    | "active"
    | "investigating";
  mttr: string | null;
  createdAt: string;
  resolvedAt?: string;
  description?: string;
  assignedTo?: string;
}

export interface Hypothesis {
  id: string;
  title: string;
  confidence: number;
  evidence: string[];
  suggestedFix: string;
}

export interface TimelineEvent {
  id: string;
  timestamp: string;
  type: "alert" | "investigation" | "action" | "resolution";
  title: string;
  description?: string;
}

export interface AIActivity {
  id: string;
  title: string;
  timestamp: string;
  type: "investigating" | "resolved" | "healed" | "health-check";
  description: string;
  details?: string[];
  isLive?: boolean;
}

export interface Integration {
  id: string;
  name: string;
  category: string;
  connected: boolean;
  logo?: string;
  config?: Record<string, unknown>;
}

export interface Metric {
  label: string;
  value: string;
  change?: string;
  trend?: "up" | "down";
  badge?: string;
  status?: string;
  icon: string;
}

export interface ApiError {
  message: string;
  code?: string;
  statusCode?: number;
  details?: Record<string, unknown>;
}

export interface ApiResponse<T> {
  data?: T;
  error?: ApiError;
  success: boolean;
}

export interface PaginationParams {
  page?: number;
  pageSize?: number;
  sortBy?: string;
  sortOrder?: "asc" | "desc";
}

export interface PaginatedResponse<T> {
  data: T[];
  pagination: {
    page: number;
    pageSize: number;
    total: number;
    totalPages: number;
  };
}

