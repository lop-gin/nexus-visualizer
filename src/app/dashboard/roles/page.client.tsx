
'use client';

import React from 'react';
import { DashboardLayout } from '@/components/common/layout/dashboard-layout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { DataTable } from '@/components/common/data-display/data-table';
import { useRouter } from 'next/navigation';
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs';
import { Database } from '@/types/supabase';
import { Role } from '@/types/auth';
import { PlusCircle, Edit, Trash2 } from 'lucide-react';
import toast from 'react-hot-toast';
import { ensureString } from '@/lib/utils';

export default function RolesPage() {
  const router = useRouter();
  const [isLoading, setIsLoading] = React.useState(true);
  const [roles, setRoles] = React.useState<Role[]>([]);
  const [isDeleting, setIsDeleting] = React.useState<string | null>(null);
  const supabase = createClientComponentClient<Database>();

  // Fetch roles
  React.useEffect(() => {
    const fetchRoles = async () => {
      setIsLoading(true);
      try {
        const { data, error } = await supabase
          .from('roles')
          .select('*')
          .order('name');
        
        if (error) {
          throw error;
        }
        
        setRoles(data || []);
      } catch (error: any) {
        console.error('Error fetching roles:', error);
        toast.error('Failed to load roles');
      } finally {
        setIsLoading(false);
      }
    };

    fetchRoles();
  }, [supabase]);

  const handleAddRole = () => {
    router.push('/dashboard/roles/new');
  };

  const handleEditRole = (roleId: string) => {
    if (roleId) {
      router.push(`/dashboard/roles/${roleId}`);
    }
  };

  const handleDeleteRole = async (roleId: string, roleName: string, isPredefined: boolean) => {
    if (!roleId) return;
    
    if (isPredefined) {
      toast.error(`Cannot delete predefined role: ${roleName}`);
      return;
    }
    
    if (confirm(`Are you sure you want to delete ${roleName}? This action cannot be undone.`)) {
      setIsDeleting(roleId);
      try {
        const { error } = await supabase
          .from('roles')
          .delete()
          .eq('id', roleId);

        if (error) {
          throw error;
        }

        // Remove role from state
        setRoles(prev => prev.filter(role => role.id !== roleId));
        toast.success('Role deleted successfully');
      } catch (error: any) {
        console.error('Error deleting role:', error);
        toast.error(error.message || 'Failed to delete role');
      } finally {
        setIsDeleting(null);
      }
    }
  };

  const columns = [
    {
      header: 'Role Name',
      accessor: (role: Role) => role.name,
    },
    {
      header: 'Description',
      accessor: (role: Role) => role.description || 'No description',
      className: 'hidden md:table-cell',
    },
    {
      header: 'Type',
      accessor: (role: Role) => (
        <span className={`px-2 py-1 rounded-full text-xs ${
          role.is_predefined 
            ? 'bg-blue-100 text-blue-800' 
            : 'bg-green-100 text-green-800'
        }`}>
          {role.is_predefined ? 'Predefined' : 'Custom'}
        </span>
      ),
    },
    {
      header: 'Actions',
      accessor: (role: Role) => (
        <div className="flex space-x-2">
          <Button
            variant="outline"
            size="sm"
            onClick={(e) => {
              e.stopPropagation();
              if (role.id) {
                handleEditRole(role.id);
              }
            }}
          >
            <Edit className="h-4 w-4" />
            <span className="sr-only">Edit</span>
          </Button>
          
          <Button
            variant="outline"
            size="sm"
            className={`${role.is_predefined ? 'text-gray-400 cursor-not-allowed' : 'text-red-600 hover:text-red-700 hover:bg-red-50'}`}
            onClick={(e) => {
              e.stopPropagation();
              if (role.id) {
                handleDeleteRole(role.id, role.name, !!role.is_predefined);
              }
            }}
            disabled={!!role.is_predefined || isDeleting === role.id}
          >
            {isDeleting === role.id ? (
              <svg className="animate-spin h-4 w-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
            ) : (
              <Trash2 className="h-4 w-4" />
            )}
            <span className="sr-only">Delete</span>
          </Button>
        </div>
      ),
    },
  ];

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <h1 className="text-2xl font-semibold text-gray-800">Roles Management</h1>
          <Button 
            onClick={handleAddRole}
          >
            <PlusCircle className="h-4 w-4 mr-2" />
            Add Custom Role
          </Button>
        </div>
        
        <Card>
          <CardHeader>
            <CardTitle>All Roles</CardTitle>
          </CardHeader>
          <CardContent>
            <DataTable
              data={roles}
              columns={columns}
              isLoading={isLoading}
              onRowClick={(role) => role.id && handleEditRole(role.id)}
              emptyMessage="No roles found. Add your first custom role by clicking 'Add Custom Role'."
            />
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  );
}
