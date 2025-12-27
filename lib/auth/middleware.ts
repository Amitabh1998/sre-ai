/**
 * Auth middleware for API routes
 */

import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { requireUser } from "./session";
import type { User } from "@/lib/db/types";

export async function requireAuth() {
  try {
    return await requireUser();
  } catch (error) {
    throw new Error("Unauthorized");
  }
}

type RouteHandler = (
  req: NextRequest,
  user: User,
  context?: any
) => Promise<NextResponse>;

type RouteHandlerWithContext = (
  req: NextRequest,
  user: User,
  context: any
) => Promise<NextResponse>;

/**
 * Higher-order function to wrap API route handlers with authentication
 * Supports two patterns:
 * 1. withAuth(handler)(req) - for standard route handlers
 * 2. export const GET = withAuth(handler) - for Next.js route handlers with params
 */
export function withAuth(
  handler: RouteHandler | RouteHandlerWithContext
): ((req: NextRequest, context?: any) => Promise<NextResponse>) {
  return async (req: NextRequest, context?: any) => {
    try {
      // Development mode: Allow mock auth via header
      // In production, this should be removed and only use real Supabase Auth
      const devMode = process.env.NODE_ENV === "development";
      const mockUserId = req.headers.get("x-mock-user-id");
      const mockUserEmail = req.headers.get("x-mock-user-email");
      
      // #region agent log
      fetch('http://127.0.0.1:7242/ingest/9d0d4316-5196-4a61-b4fa-5b55f0cc76f5',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({location:'lib/auth/middleware.ts:43',message:'withAuth middleware entry',data:{devMode,hasMockUserId:!!mockUserId,mockUserId,mockUserEmail,path:req.nextUrl.pathname},timestamp:Date.now(),sessionId:'debug-session',runId:'run1',hypothesisId:'C'})}).catch(()=>{});
      // #endregion
      
      let user: User | null = null;
      
      if (devMode && mockUserId && mockUserEmail) {
        // #region agent log
        fetch('http://127.0.0.1:7242/ingest/9d0d4316-5196-4a61-b4fa-5b55f0cc76f5',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({location:'lib/auth/middleware.ts:49',message:'Using mock auth path',data:{mockUserEmail},timestamp:Date.now(),sessionId:'debug-session',runId:'run1',hypothesisId:'D'})}).catch(()=>{});
        // #endregion
        // Use mock user for development/testing
        // Try to find user in database first (using service client to bypass RLS)
        const { createServiceClient } = await import("@/lib/supabase/server");
        const supabaseService = createServiceClient();
        
        const { data: dbUser, error: userError } = await supabaseService
          .from("users")
          .select("*")
          .eq("email", mockUserEmail)
          .single();
        
        // #region agent log
        fetch('http://127.0.0.1:7242/ingest/9d0d4316-5196-4a61-b4fa-5b55f0cc76f5',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({location:'lib/auth/middleware.ts:59',message:'User lookup result',data:{foundUser:!!dbUser,userError:userError?.message,userEmail:dbUser?.email,userOrgId:dbUser?.organization_id},timestamp:Date.now(),sessionId:'debug-session',runId:'run1',hypothesisId:'D'})}).catch(()=>{});
        // #endregion
        
        if (dbUser && !userError) {
          // User exists in database, use it
          user = dbUser as User;
          // #region agent log
          fetch('http://127.0.0.1:7242/ingest/9d0d4316-5196-4a61-b4fa-5b55f0cc76f5',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({location:'lib/auth/middleware.ts:63',message:'Using database user',data:{userId:user.id,userOrgId:user.organization_id},timestamp:Date.now(),sessionId:'debug-session',runId:'run1',hypothesisId:'D'})}).catch(()=>{});
          // #endregion
        } else {
          // Create a mock user object - but we need an organization
          // Get first organization (handle case where none exists)
          // Use service client to bypass RLS since we're in dev mode with mock auth
          const { createServiceClient } = await import("@/lib/supabase/server");
          const supabase = createServiceClient();
          const { data: orgs, error: orgError } = await supabase
            .from("organizations")
            .select("id")
            .limit(1);
          
          let orgId: string | null = null;
          
          if (orgError) {
            console.error("Error fetching organizations:", orgError);
            return NextResponse.json(
              { 
                error: "Database error while fetching organization",
                details: orgError.message
              },
              { status: 500 }
            );
          }
          
          if (orgs && orgs.length > 0) {
            orgId = orgs[0].id;
          } else {
            // No organization exists - try to create a default one
            const { data: newOrg, error: createError } = await supabase
              .from("organizations")
              .insert({
                name: "Development Organization",
                slug: `dev-org-${Date.now()}`,
              })
              .select("id")
              .single();
            
            if (createError) {
              console.error("Error creating organization:", createError);
              return NextResponse.json(
                { 
                  error: "No organization found and failed to create one",
                  details: createError.message
                },
                { status: 400 }
              );
            }
            
            if (newOrg) {
              orgId = newOrg.id;
            }
          }
          
          if (!orgId) {
            // Still no organization - return helpful error
            return NextResponse.json(
              { 
                error: "No organization found. Please create an organization in Supabase first.",
                details: "Run this SQL in Supabase: INSERT INTO organizations (name, slug) VALUES ('My Company', 'my-company');"
              },
              { status: 400 }
            );
          }
          
          user = {
            id: mockUserId,
            email: mockUserEmail,
            name: mockUserEmail.split("@")[0],
            organization_id: orgId,
            role: "admin",
            avatar_url: null,
            created_at: new Date().toISOString(),
            updated_at: new Date().toISOString(),
          } as User;
        }
      } else {
        // #region agent log
        fetch('http://127.0.0.1:7242/ingest/9d0d4316-5196-4a61-b4fa-5b55f0cc76f5',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({location:'lib/auth/middleware.ts:139',message:'Trying real Supabase Auth',data:{},timestamp:Date.now(),sessionId:'debug-session',runId:'run1',hypothesisId:'E'})}).catch(()=>{});
        // #endregion
        // Try real Supabase Auth
        try {
          user = await requireUser();
          // #region agent log
          fetch('http://127.0.0.1:7242/ingest/9d0d4316-5196-4a61-b4fa-5b55f0cc76f5',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({location:'lib/auth/middleware.ts:142',message:'requireUser result',data:{hasUser:!!user},timestamp:Date.now(),sessionId:'debug-session',runId:'run1',hypothesisId:'E'})}).catch(()=>{});
          // #endregion
        } catch (authError) {
          // #region agent log
          fetch('http://127.0.0.1:7242/ingest/9d0d4316-5196-4a61-b4fa-5b55f0cc76f5',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({location:'lib/auth/middleware.ts:145',message:'requireUser failed',data:{error:String(authError)},timestamp:Date.now(),sessionId:'debug-session',runId:'run1',hypothesisId:'E'})}).catch(()=>{});
          // #endregion
        }
      }
      
      // #region agent log
      fetch('http://127.0.0.1:7242/ingest/9d0d4316-5196-4a61-b4fa-5b55f0cc76f5',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({location:'lib/auth/middleware.ts:149',message:'Final user check',data:{hasUser:!!user,userEmail:user?.email},timestamp:Date.now(),sessionId:'debug-session',runId:'run1',hypothesisId:'F'})}).catch(()=>{});
      // #endregion
      
      if (!user) {
        // #region agent log
        fetch('http://127.0.0.1:7242/ingest/9d0d4316-5196-4a61-b4fa-5b55f0cc76f5',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({location:'lib/auth/middleware.ts:152',message:'Returning 401 - no user',data:{devMode,hasMockUserId:!!mockUserId,hasMockUserEmail:!!mockUserEmail},timestamp:Date.now(),sessionId:'debug-session',runId:'run1',hypothesisId:'F'})}).catch(()=>{});
        // #endregion
        return NextResponse.json(
          { error: "Unauthorized" },
          { status: 401 }
        );
      }
      
      // If context is provided (Next.js route handler pattern with params), pass it to handler
      if (context && typeof context === "object" && "params" in context) {
        return (handler as RouteHandlerWithContext)(req, user, context);
      }
      
      // Otherwise, call handler without context (or with undefined context)
      return (handler as RouteHandler)(req, user, context);
    } catch (error) {
      // #region agent log
      fetch('http://127.0.0.1:7242/ingest/9d0d4316-5196-4a61-b4fa-5b55f0cc76f5',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({location:'lib/auth/middleware.ts:163',message:'withAuth catch block - returning 401',data:{error:String(error),errorName:error instanceof Error ? error.name : 'unknown',errorMessage:error instanceof Error ? error.message : 'unknown'},timestamp:Date.now(),sessionId:'debug-session',runId:'run1',hypothesisId:'G'})}).catch(()=>{});
      // #endregion
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      );
    }
  };
}

