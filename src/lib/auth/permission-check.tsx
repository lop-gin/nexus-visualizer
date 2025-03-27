import { createClientComponentClient } from '@supabase/auth-helpers-nextjs';
import { Database } from '@/types/supabase';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';
import { useCompany } from '@/providers/company-provider';
import toast from 'react-hot-toast';

// Higher-order component to protect routes based on permissions
export function withPermissionCheck<P extends object>(
  Component: React.ComponentType<P>,
  requiredModule: string,
  requiredAction: 'view' | 'create' | 'edit' | 'delete' = 'view'
) {
  return function ProtectedComponent(props: P) {
    const { checkPermission, isLoading } = useCompany();
    const router = useRouter();
    
    useEffect(() => {
      if (!isLoading && !checkPermission(requiredModule, requiredAction)) {
        toast.error(`You don't have permission to ${requiredAction} ${requiredModule}`);
        router.push('/dashboard');
      }
    }, [isLoading, requiredModule, requiredAction]);
    
    if (isLoading) {
      return <div className="flex justify-center items-center h-screen">Loading...</div>;
    }
    
    if (checkPermission(requiredModule, requiredAction)) {
      return <Component {...props} />;
    }
    
    return null;
  };
}

// Hook to check if current user belongs to a specific company
export function useCompanyCheck() {
  const supabase = createClientComponentClient<Database>();
  const router = useRouter();
  
  const checkCompanyAccess = async (companyId: string): Promise<boolean> => {
    try {
      // Get current user session
      const { data: { session } } = await supabase.auth.getSession();
      
      if (!session) {
        router.push('/auth/login');
        return false;
      }
      
      // Get user's company
      const { data: employee, error } = await supabase
        .from('employees')
        .select('company_id')
        .eq('user_id', session.user.id)
        .single();
      
      if (error || !employee) {
        throw new Error('Failed to verify company access');
      }
      
      // Check if user belongs to the requested company
      return employee.company_id === companyId;
    } catch (error) {
      console.error('Error checking company access:', error);
      return false;
    }
  };
  
  return { checkCompanyAccess };
}

// Function to apply RLS policies to a database query
export function applyCompanyFilter(query: any, companyId: string) {
  return query.eq('company_id', companyId);
}
