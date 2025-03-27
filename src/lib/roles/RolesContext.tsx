'use client';

import React from 'react';
import { useRouter } from 'next/navigation';
import { Role, Permission } from '@/types/auth';

// Create context for roles and permissions
interface RolesContextType {
  roles: Role[];
  modules: any[];
  isLoading: boolean;
  hasPermission: (moduleName: string, action: 'view' | 'create' | 'edit' | 'delete') => boolean;
  refreshRoles: () => Promise<void>;
}

const RolesContext = React.createContext<RolesContextType | undefined>(undefined);

// Provider component
export function RolesProvider({ children }: { children: React.ReactNode }) {
  const [roles, setRoles] = React.useState<Role[]>([]);
  const [modules, setModules] = React.useState<any[]>([]);
  const [isLoading, setIsLoading] = React.useState(true);
  const [userPermissions, setUserPermissions] = React.useState<Record<string, Record<string, boolean>>>({});
  const router = useRouter();

  // Fetch roles and modules on mount
  const fetchRolesAndModules = React.useCallback(async () => {
    setIsLoading(true);
    try {
      // In a real implementation, these would be API calls to the server
      // For now, we'll use mock data
      const response = await fetch('/api/roles');
      const data = await response.json();
      setRoles(data.roles);
      setModules(data.modules);
      
      // Set up user permissions
      // In a real implementation, this would come from the server based on the user's role
      const permissions: Record<string, Record<string, boolean>> = {};
      data.modules.forEach((module: any) => {
        permissions[module.name] = {
          view: true,
          create: true,
          edit: true,
          delete: true,
        };
      });
      setUserPermissions(permissions);
    } catch (error) {
      console.error('Error fetching roles and modules:', error);
    } finally {
      setIsLoading(false);
    }
  }, []);

  React.useEffect(() => {
    fetchRolesAndModules();
  }, [fetchRolesAndModules]);

  // Check if user has permission for a specific action on a module
  const hasPermission = (moduleName: string, action: 'view' | 'create' | 'edit' | 'delete'): boolean => {
    if (!userPermissions[moduleName]) {
      return false;
    }
    return userPermissions[moduleName][action] || false;
  };

  // Refresh roles and modules
  const refreshRoles = async (): Promise<void> => {
    await fetchRolesAndModules();
  };

  return (
    <RolesContext.Provider
      value={{
        roles,
        modules,
        isLoading,
        hasPermission,
        refreshRoles,
      }}
    >
      {children}
    </RolesContext.Provider>
  );
}

// Custom hook to use the roles context
export function useRoles() {
  const context = React.useContext(RolesContext);
  if (context === undefined) {
    throw new Error('useRoles must be used within a RolesProvider');
  }
  return context;
}

// Higher-order component to protect routes based on permissions
export function withPermission(
  Component: React.ComponentType<any>,
  moduleName: string,
  action: 'view' | 'create' | 'edit' | 'delete'
) {
  return function ProtectedComponent(props: any) {
    const { hasPermission, isLoading } = useRoles();
    const router = useRouter();

    React.useEffect(() => {
      if (!isLoading && !hasPermission(moduleName, action)) {
        router.push('/dashboard');
      }
    }, [isLoading, router]);

    if (isLoading) {
      return <div>Loading...</div>;
    }

    if (!hasPermission(moduleName, action)) {
      return null;
    }

    return <Component {...props} />;
  };
}
