import { createMiddlewareClient } from '@supabase/auth-helpers-nextjs';
import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { Database } from '@/types/supabase';

// This function can be marked `async` if using `await` inside
export async function middleware(request: NextRequest) {
  // Create a response object that we can modify
  const response = NextResponse.next();
  
  // Create a Supabase client for the middleware
  const supabase = createMiddlewareClient<Database>({ req: request, res: response });
  
  // Get the current user session
  const {
    data: { session },
  } = await supabase.auth.getSession();
  
  // Check if user is authenticated for protected routes
  const isAuthRoute = request.nextUrl.pathname.startsWith('/auth');
  const isDashboardRoute = request.nextUrl.pathname.startsWith('/dashboard');
  const isSalesRoute = request.nextUrl.pathname.startsWith('/sales');
  const isProtectedRoute = isDashboardRoute || isSalesRoute;
  
  // If accessing protected route without session, redirect to login
  if (isProtectedRoute && !session) {
    const redirectUrl = new URL('/auth/login', request.url);
    redirectUrl.searchParams.set('redirect', request.nextUrl.pathname);
    return NextResponse.redirect(redirectUrl);
  }
  
  // If accessing auth routes with session, redirect to dashboard
  if (isAuthRoute && session) {
    return NextResponse.redirect(new URL('/dashboard', request.url));
  }
  
  // If user is authenticated, set company context for data isolation
  if (session) {
    // Get user profile with company information
    const { data: profile } = await supabase
      .from('employees')
      .select('company_id')
      .eq('user_id', session.user.id)
      .single();
    
    if (profile?.company_id) {
      // Set company context for RLS policies
      await supabase.rpc('set_app_variables', {
        p_user_id: session.user.id,
        p_company_id: profile.company_id
      });
    }
  }
  
  return response;
}

// Configure the middleware to run on specific paths
export const config = {
  matcher: [
    // Apply to all routes except static files, api routes, and _next
    '/((?!_next/static|_next/image|favicon.ico|api/|public/).*)',
  ],
};
