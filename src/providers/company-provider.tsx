import { createClientComponentClient } from '@supabase/auth-helpers-nextjs';
import { Database } from '@/types/supabase';
import { useRouter } from 'next/navigation';
import { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import toast from 'react-hot-toast';

// Define the company context type
type CompanyContextType = {
  companyId: string | null;
  userId: string | null;
  roleName: string | null;
  isAdmin: boolean;
  isLoading: boolean;
  checkPermission: (module: string, action: 'view' | 'create' | 'edit' | 'delete') => boolean;
  permissions: Record<string, { view: boolean; create: boolean; edit: boolean; delete: boolean }>;
  refreshPermissions: () => Promise<void>;
};

// Create the context with default values
const CompanyContext = createContext<CompanyContextType>({
  companyId: null,
  userId: null,
  roleName: null,
  isAdmin: false,
  isLoading: true,
  checkPermission: () => false,
  permissions: {},
  refreshPermissions: async () => {},
});

// Hook to use the company context
export const useCompany = () => useContext(CompanyContext);

// Provider component for company context
export const CompanyProvider = ({ children }: { children: ReactNode }) => {
  const supabase = createClientComponentClient<Database>();
  const router = useRouter();
  const [companyId, setCompanyId] = useState<string | null>(null);
  const [userId, setUserId] = useState<string | null>(null);
  const [roleName, setRoleName] = useState<string | null>(null);
  const [isAdmin, setIsAdmin] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [permissions, setPermissions] = useState<Record<string, { view: boolean; create: boolean; edit: boolean; delete: boolean }>>({});

  // Function to fetch user permissions
  const fetchPermissions = async (roleId: string) => {
    try {
      const { data, error } = await supabase
        .from('permissions')
        .select(`
          can_view,
          can_create,
          can_edit,
          can_delete,
          module:module_id(id, name)
        `)
        .eq('role_id', roleId);

      if (error) {
        throw error;
      }

      // Transform permissions data into a more usable format
      const permissionsMap: Record<string, { view: boolean; create: boolean; edit: boolean; delete: boolean }> = {};
      
      data.forEach(permission => {
        if (permission.module && permission.module.name) {
          permissionsMap[permission.module.name] = {
            view: permission.can_view,
            create: permission.can_create,
            edit: permission.can_edit,
            delete: permission.can_delete,
          };
        }
      });

      return permissionsMap;
    } catch (error) {
      console.error('Error fetching permissions:', error);
      return {};
    }
  };

  // Function to refresh permissions
  const refreshPermissions = async () => {
    setIsLoading(true);
    try {
      const { data: { session } } = await supabase.auth.getSession();
      
      if (!session) {
        router.push('/auth/login');
        return;
      }

      setUserId(session.user.id);

      // Get user profile with company and role information
      const { data: profile, error: profileError } = await supabase
        .from('employees')
        .select('company_id, role_id, role:role_id(name)')
        .eq('user_id', session.user.id)
        .single();

      if (profileError || !profile) {
        throw profileError || new Error('Profile not found');
      }

      setCompanyId(profile.company_id);
      setRoleName(profile.role?.name || null);
      
      // Check if user is an admin
      const isUserAdmin = profile.role?.name === 'SuperAdmin' || profile.role?.name === 'Admin';
      setIsAdmin(isUserAdmin);

      // Fetch permissions for the user's role
      const permissionsData = await fetchPermissions(profile.role_id);
      setPermissions(permissionsData);

      // Set company context for RLS policies
      await supabase.rpc('set_app_variables', {
        p_user_id: session.user.id,
        p_company_id: profile.company_id
      });
    } catch (error) {
      console.error('Error setting up company context:', error);
      toast.error('Failed to load user permissions');
      // Handle authentication errors
      if (error instanceof Error && error.message.includes('auth')) {
        router.push('/auth/login');
      }
    } finally {
      setIsLoading(false);
    }
  };

  // Function to check if user has permission for a specific action
  const checkPermission = (module: string, action: 'view' | 'create' | 'edit' | 'delete'): boolean => {
    // Admins have all permissions
    if (isAdmin) return true;
    
    // Check specific permission
    const modulePermissions = permissions[module];
    if (!modulePermissions) return false;
    
    return modulePermissions[action] || false;
  };

  // Initialize company context on component mount
  useEffect(() => {
    refreshPermissions();
    
    // Set up auth state change listener
    const { data: { subscription } } = supabase.auth.onAuthStateChange((event) => {
      if (event === 'SIGNED_OUT') {
        setCompanyId(null);
        setUserId(null);
        setRoleName(null);
        setIsAdmin(false);
        setPermissions({});
        router.push('/auth/login');
      } else if (event === 'SIGNED_IN' || event === 'USER_UPDATED') {
        refreshPermissions();
      }
    });

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  return (
    <CompanyContext.Provider
      value={{
        companyId,
        userId,
        roleName,
        isAdmin,
        isLoading,
        checkPermission,
        permissions,
        refreshPermissions,
      }}
    >
      {children}
    </CompanyContext.Provider>
  );
};

// Higher-order component to protect client components
export function withCompanyProtection<P extends object>(
  Component: React.ComponentType<P>,
  requiredModule?: string,
  requiredAction: 'view' | 'create' | 'edit' | 'delete' = 'view'
) {
  return function ProtectedComponent(props: P) {
    const { isLoading, checkPermission } = useCompany();
    const router = useRouter();

    useEffect(() => {
      // If required module is specified, check permission
      if (!isLoading && requiredModule && !checkPermission(requiredModule, requiredAction)) {
        toast.error('You do not have permission to access this page');
        router.push('/dashboard');
      }
    }, [isLoading, requiredModule, requiredAction]);

    if (isLoading) {
      return <div className="flex items-center justify-center min-h-screen">Loading...</div>;
    }

    // If no specific module is required, or user has permission, render the component
    if (!requiredModule || checkPermission(requiredModule, requiredAction)) {
      return <Component {...props} />;
    }

    // This should not be visible due to the redirect in useEffect
    return null;
  };
}
