'use client';

import React from 'react';
import { DashboardLayout } from '@/components/common/layout/dashboard-layout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { DataTable } from '@/components/common/data-display/data-table';
import { useRouter } from 'next/navigation';
import { Role } from '@/types/auth';
import { PlusCircle } from 'lucide-react';

// Mock data for roles - will be replaced with actual data from Supabase
const mockRoles: Role[] = [
  {
    id: '1',
    name: 'Admin',
    description: 'Administrator with full access',
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },
  {
    id: '2',
    name: 'Sales Supervisor',
    description: 'Manages sales team and has access to all sales functions',
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },
  {
    id: '3',
    name: 'Sales Rep',
    description: 'Can create and manage sales documents',
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },
  {
    id: '4',
    name: 'Procurement Supervisor',
    description: 'Manages procurement team and has access to all procurement functions',
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },
  {
    id: '5',
    name: 'Custom Role',
    description: 'A custom role with specific permissions',
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },
];

export default function RolesPage() {
  const router = useRouter();
  const [isLoading, setIsLoading] = React.useState(true);
  const [roles, setRoles] = React.useState<Role[]>([]);

  React.useEffect(() => {
    // Simulate loading data from API
    const timer = setTimeout(() => {
      setRoles(mockRoles);
      setIsLoading(false);
    }, 1000);

    return () => clearTimeout(timer);
  }, []);

  const handleAddRole = () => {
    router.push('/dashboard/roles/new');
  };

  const handleRoleClick = (role: Role) => {
    router.push(`/dashboard/roles/${role.id}`);
  };

  const columns = [
    {
      header: 'Role Name',
      accessor: 'name',
    },
    {
      header: 'Description',
      accessor: 'description',
    },
    {
      header: 'Created',
      accessor: (role: Role) => {
        const date = new Date(role.created_at || '');
        return date.toLocaleDateString();
      },
    },
    {
      header: 'Actions',
      accessor: (role: Role) => (
        <Button 
          variant="outline" 
          size="sm"
          onClick={(e) => {
            e.stopPropagation();
            handleRoleClick(role);
          }}
        >
          Edit
        </Button>
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
            leftIcon={<PlusCircle className="h-4 w-4 mr-2" />}
          >
            Add New Role
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
              onRowClick={handleRoleClick}
              emptyMessage="No roles found. Create your first role by clicking 'Add New Role'."
            />
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  );
}
