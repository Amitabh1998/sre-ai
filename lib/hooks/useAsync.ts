/**
 * Custom hook for handling async operations with loading and error states
 */

import { useState, useCallback } from "react";
import type { ApiResponse } from "@/lib/types";
import { getErrorMessage } from "@/lib/errors";

interface UseAsyncState<T> {
  data: T | null;
  loading: boolean;
  error: string | null;
}

interface UseAsyncReturn<T> extends UseAsyncState<T> {
  execute: (...args: unknown[]) => Promise<T | null>;
  reset: () => void;
}

export function useAsync<T>(
  asyncFunction: (...args: unknown[]) => Promise<ApiResponse<T> | T>
): UseAsyncReturn<T> {
  const [state, setState] = useState<UseAsyncState<T>>({
    data: null,
    loading: false,
    error: null,
  });

  const execute = useCallback(
    async (...args: unknown[]): Promise<T | null> => {
      setState({ data: null, loading: true, error: null });

      try {
        const result = await asyncFunction(...args);

        // #region agent log
        fetch('http://127.0.0.1:7242/ingest/9d0d4316-5196-4a61-b4fa-5b55f0cc76f5',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({location:'lib/hooks/useAsync.ts:34',message:'useAsync result received',data:{hasResult:!!result,resultType:typeof result,hasSuccess:result && typeof result === 'object' && 'success' in result,success:result && typeof result === 'object' && 'success' in result ? (result as any).success : undefined,hasData:result && typeof result === 'object' && 'success' in result ? !!(result as any).data : undefined,hasError:result && typeof result === 'object' && 'success' in result ? !!(result as any).error : undefined},timestamp:Date.now(),sessionId:'debug-session',runId:'run1',hypothesisId:'F'})}).catch(()=>{});
        // #endregion

        // Handle ApiResponse format
        if (result && typeof result === "object" && "success" in result) {
          const apiResponse = result as ApiResponse<T>;
          
          // #region agent log
          fetch('http://127.0.0.1:7242/ingest/9d0d4316-5196-4a61-b4fa-5b55f0cc76f5',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({location:'lib/hooks/useAsync.ts:40',message:'Processing ApiResponse',data:{success:apiResponse.success,hasData:!!apiResponse.data,hasError:!!apiResponse.error,errorMessage:apiResponse.error?.message},timestamp:Date.now(),sessionId:'debug-session',runId:'run1',hypothesisId:'F'})}).catch(()=>{});
          // #endregion
          
          if (apiResponse.success && apiResponse.data) {
            // #region agent log
            fetch('http://127.0.0.1:7242/ingest/9d0d4316-5196-4a61-b4fa-5b55f0cc76f5',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({location:'lib/hooks/useAsync.ts:43',message:'SETTING success state',data:{hasData:!!apiResponse.data},timestamp:Date.now(),sessionId:'debug-session',runId:'run1',hypothesisId:'F'})}).catch(()=>{});
            // #endregion
            setState({ data: apiResponse.data, loading: false, error: null });
            return apiResponse.data;
          } else {
            // #region agent log
            fetch('http://127.0.0.1:7242/ingest/9d0d4316-5196-4a61-b4fa-5b55f0cc76f5',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({location:'lib/hooks/useAsync.ts:47',message:'SETTING error state from ApiResponse',data:{errorMessage:apiResponse.error?.message || 'An error occurred'},timestamp:Date.now(),sessionId:'debug-session',runId:'run1',hypothesisId:'F'})}).catch(()=>{});
            // #endregion
            const errorMessage = apiResponse.error?.message || "An error occurred";
            setState({ data: null, loading: false, error: errorMessage });
            return null;
          }
        }

        // Handle direct data
        // #region agent log
        fetch('http://127.0.0.1:7242/ingest/9d0d4316-5196-4a61-b4fa-5b55f0cc76f5',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({location:'lib/hooks/useAsync.ts:52',message:'SETTING direct data state',data:{hasResult:!!result},timestamp:Date.now(),sessionId:'debug-session',runId:'run1',hypothesisId:'F'})}).catch(()=>{});
        // #endregion
        setState({ data: result as T, loading: false, error: null });
        return result as T;
      } catch (error) {
        // #region agent log
        fetch('http://127.0.0.1:7242/ingest/9d0d4316-5196-4a61-b4fa-5b55f0cc76f5',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({location:'lib/hooks/useAsync.ts:54',message:'SETTING error state from catch',data:{errorMessage:getErrorMessage(error)},timestamp:Date.now(),sessionId:'debug-session',runId:'run1',hypothesisId:'F'})}).catch(()=>{});
        // #endregion
        const errorMessage = getErrorMessage(error);
        setState({ data: null, loading: false, error: errorMessage });
        return null;
      }
    },
    [asyncFunction]
  );

  const reset = useCallback(() => {
    setState({ data: null, loading: false, error: null });
  }, []);

  return {
    ...state,
    execute,
    reset,
  };
}

