import { createServerComponentClient } from '@supabase/auth-helpers-nextjs';
import { cookies } from 'next/headers';
import { Database } from '@/types/supabase';
import { redirect } from 'next/navigation';

// Higher-order component to protect server components and set company context
export async function withCompanyContext(Component: React.ComponentType<any>) {
  // Create Supabase client for server component
  const cookieStore = cookies();
  const supabase = createServerComponentClient<Database>({ cookies: () => cookieStore });
  
  // Get the current user session
  const { data: { session } } = await supabase.auth.getSession();
  
  // If no session, redirect to login
  if (!session) {
    redirect('/auth/login');
  }
  
  // Get user profile with company information
  const { data: profile } = await supabase
    .from('employees')
    .select('company_id, role_id, role:role_id(name)')
    .eq('user_id', session.user.id)
    .single();
  
  if (!profile) {
    // User authenticated but no employee profile found
    // This could happen if user was deleted from employees table but auth record remains
    await supabase.auth.signOut();
    redirect('/auth/login?error=profile_not_found');
  }
  
  // Set company context for RLS policies
  await supabase.rpc('set_app_variables', {
    p_user_id: session.user.id,
    p_company_id: profile.company_id
  });
  
  // Return the component with company context
  return <Component companyId={profile.company_id} roleId={profile.role_id} roleName={profile.role?.name} />;
}
