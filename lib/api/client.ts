/**
 * API Client - Centralized API request handling
 * Production-ready with error handling, retries, and type safety
 */

import type { ApiResponse, ApiError } from "@/lib/types";

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "";

interface RequestOptions extends RequestInit {
  timeout?: number;
  retries?: number;
}

class ApiClient {
  private baseURL: string;

  constructor(baseURL: string = API_BASE_URL) {
    this.baseURL = baseURL;
  }

  private async request<T>(
    endpoint: string,
    options: RequestOptions = {}
  ): Promise<ApiResponse<T>> {
    const {
      timeout = 10000,
      retries = 0,
      headers = {},
      ...fetchOptions
    } = options;

    const url = endpoint.startsWith("http") ? endpoint : `${this.baseURL}${endpoint}`;

    // Get mock auth from localStorage (for development/testing)
    // The auth store saves: { isAuthenticated: true, user: {...} }
    let mockAuthHeaders: HeadersInit = {};
    if (typeof window !== "undefined") {
      try {
        const authStorage = localStorage.getItem("auth-storage");
        // #region agent log
        fetch('http://127.0.0.1:7242/ingest/9d0d4316-5196-4a61-b4fa-5b55f0cc76f5',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({location:'lib/api/client.ts:40',message:'Reading auth-storage from localStorage',data:{hasAuthStorage:!!authStorage,authStorageLength:authStorage?.length},timestamp:Date.now(),sessionId:'debug-session',runId:'run1',hypothesisId:'A'})}).catch(()=>{});
        // #endregion
        if (authStorage) {
          const authData = JSON.parse(authStorage);
          // Check both Zustand format (state.user) and direct format (user)
          const user = authData?.state?.user || authData?.user;
          const isAuthenticated = authData?.state?.isAuthenticated ?? authData?.isAuthenticated;
          
          // #region agent log
          fetch('http://127.0.0.1:7242/ingest/9d0d4316-5196-4a61-b4fa-5b55f0cc76f5',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({location:'lib/api/client.ts:47',message:'Parsed auth data',data:{hasUser:!!user,userEmail:user?.email,userId:user?.id,isAuthenticated},timestamp:Date.now(),sessionId:'debug-session',runId:'run1',hypothesisId:'A'})}).catch(()=>{});
          // #endregion
          
          if (user && isAuthenticated) {
            mockAuthHeaders = {
              "x-mock-user-id": user.id || "dev-user-id",
              "x-mock-user-email": user.email || "dev@example.com",
            };
            // #region agent log
            fetch('http://127.0.0.1:7242/ingest/9d0d4316-5196-4a61-b4fa-5b55f0cc76f5',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({location:'lib/api/client.ts:52',message:'Setting mock auth headers',data:{mockUserId:mockAuthHeaders['x-mock-user-id'],mockUserEmail:mockAuthHeaders['x-mock-user-email']},timestamp:Date.now(),sessionId:'debug-session',runId:'run1',hypothesisId:'A'})}).catch(()=>{});
            // #endregion
          }
        }
      } catch (e) {
        // #region agent log
        fetch('http://127.0.0.1:7242/ingest/9d0d4316-5196-4a61-b4fa-5b55f0cc76f5',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({location:'lib/api/client.ts:55',message:'Error reading localStorage',data:{error:String(e)},timestamp:Date.now(),sessionId:'debug-session',runId:'run1',hypothesisId:'A'})}).catch(()=>{});
        // #endregion
      }
    }

    const defaultHeaders: HeadersInit = {
      "Content-Type": "application/json",
      ...mockAuthHeaders,
      ...headers,
    };

    let lastError: Error | null = null;

    for (let attempt = 0; attempt <= retries; attempt++) {
      try {
        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), timeout);

        // #region agent log
        fetch('http://127.0.0.1:7242/ingest/9d0d4316-5196-4a61-b4fa-5b55f0cc76f5',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({location:'lib/api/client.ts:85',message:'Making API request',data:{url,endpoint,method:fetchOptions.method || 'GET',hasMockHeaders:!!mockAuthHeaders['x-mock-user-id'],mockUserEmail:mockAuthHeaders['x-mock-user-email']},timestamp:Date.now(),sessionId:'debug-session',runId:'run1',hypothesisId:'B'})}).catch(()=>{});
        // #endregion
        const response = await fetch(url, {
          ...fetchOptions,
          headers: defaultHeaders,
          signal: controller.signal,
          credentials: "include", // Include cookies for NextAuth session
        });
        
        // #region agent log
        fetch('http://127.0.0.1:7242/ingest/9d0d4316-5196-4a61-b4fa-5b55f0cc76f5',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({location:'lib/api/client.ts:55',message:'API response received',data:{status:response.status,statusText:response.statusText,ok:response.ok},timestamp:Date.now(),sessionId:'debug-session',runId:'run1',hypothesisId:'B'})}).catch(()=>{});
        // #endregion

        clearTimeout(timeoutId);

        if (!response.ok) {
          const errorData = await this.parseErrorResponse(response);
          return {
            success: false,
            error: errorData,
          };
        }

        const data = await response.json();

        return {
          success: true,
          data: data as T,
        };
      } catch (error) {
        lastError = error as Error;

        // Don't retry on abort or client errors
        if (error instanceof Error && error.name === "AbortError") {
          return {
            success: false,
            error: {
              message: "Request timeout",
              code: "TIMEOUT",
              statusCode: 408,
            },
          };
        }

        // Retry logic
        if (attempt < retries) {
          await this.delay(Math.pow(2, attempt) * 1000); // Exponential backoff
          continue;
        }
      }
    }

    return {
      success: false,
      error: {
        message: lastError?.message || "Request failed",
        code: "NETWORK_ERROR",
      },
    };
  }

  private async parseErrorResponse(response: Response): Promise<ApiError> {
    try {
      const text = await response.text();
      let errorData: any = {};
      
      try {
        errorData = JSON.parse(text);
      } catch {
        // If not JSON, use the text as message
        errorData = { message: text || response.statusText };
      }
      
      return {
        message: errorData.error || errorData.message || `HTTP ${response.status}: ${response.statusText}`,
        code: errorData.code,
        statusCode: response.status,
        details: errorData.details || errorData,
      };
    } catch (error) {
      return {
        message: `HTTP ${response.status}: ${response.statusText}`,
        statusCode: response.status,
      };
    }
  }

  private delay(ms: number): Promise<void> {
    return new Promise((resolve) => setTimeout(resolve, ms));
  }

  async get<T>(endpoint: string, options?: RequestOptions): Promise<ApiResponse<T>> {
    // #region agent log
    fetch('http://127.0.0.1:7242/ingest/9d0d4316-5196-4a61-b4fa-5b55f0cc76f5',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({location:'lib/api/client.ts:176',message:'API client GET called',data:{endpoint},timestamp:Date.now(),sessionId:'debug-session',runId:'run1',hypothesisId:'N'})}).catch(()=>{});
    // #endregion
    return this.request<T>(endpoint, { ...options, method: "GET" });
  }

  async post<T>(
    endpoint: string,
    data?: unknown,
    options?: RequestOptions
  ): Promise<ApiResponse<T>> {
    return this.request<T>(endpoint, {
      ...options,
      method: "POST",
      body: data ? JSON.stringify(data) : undefined,
    });
  }

  async put<T>(
    endpoint: string,
    data?: unknown,
    options?: RequestOptions
  ): Promise<ApiResponse<T>> {
    return this.request<T>(endpoint, {
      ...options,
      method: "PUT",
      body: data ? JSON.stringify(data) : undefined,
    });
  }

  async delete<T>(endpoint: string, options?: RequestOptions): Promise<ApiResponse<T>> {
    return this.request<T>(endpoint, { ...options, method: "DELETE" });
  }
}

export const apiClient = new ApiClient();

