'use client';

import React from 'react';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { DashboardLayout } from '@/components/common/layout/dashboard-layout';
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { useRouter } from 'next/navigation';
import { PREDEFINED_ROLES, isPredefinedRole } from '@/types/auth';
import toast from 'react-hot-toast';

// Schema for role form
const roleFormSchema = z.object({
  name: z.string().min(1, 'Role name is required'),
  description: z.string().optional(),
});

type RoleFormData = z.infer<typeof roleFormSchema>;

// Mock modules for permissions
const mockModules = [
  { id: '1', name: 'customers', description: 'Customer management' },
  { id: '2', name: 'invoices', description: 'Invoice management' },
  { id: '3', name: 'inventory', description: 'Inventory management' },
  { id: '4', name: 'production', description: 'Production management' },
  { id: '5', name: 'reports', description: 'Reporting' },
  { id: '6', name: 'employees', description: 'Employee management' },
  { id: '7', name: 'roles', description: 'Role management' },
];

// Mock role data - will be replaced with actual data from Supabase
const mockRole = {
  id: '1',
  name: 'Admin',
  description: 'Administrator with full access',
  created_at: new Date().toISOString(),
  updated_at: new Date().toISOString(),
};

// Mock permissions - will be replaced with actual data from Supabase
const mockRolePermissions: Record<string, { view: boolean; create: boolean; edit: boolean; delete: boolean }> = {
  '1': { view: true, create: true, edit: true, delete: true },
  '2': { view: true, create: true, edit: true, delete: true },
  '3': { view: true, create: true, edit: true, delete: true },
  '4': { view: true, create: true, edit: true, delete: true },
  '5': { view: true, create: true, edit: true, delete: true },
  '6': { view: true, create: true, edit: true, delete: true },
  '7': { view: true, create: true, edit: true, delete: true },
};

export default function EditRolePage({ params }: { params: { id: string } }) {
  const router = useRouter();
  const [isLoading, setIsLoading] = React.useState(true);
  const [isSubmitting, setIsSubmitting] = React.useState(false);
  const [permissions, setPermissions] = React.useState<Record<string, { view: boolean; create: boolean; edit: boolean; delete: boolean }>>({});
  const [role, setRole] = React.useState<typeof mockRole | null>(null);

  const { 
    control, 
    handleSubmit, 
    formState: { errors },
    reset,
    watch
  } = useForm<RoleFormData>({
    resolver: zodResolver(roleFormSchema),
    defaultValues: {
      name: '',
      description: '',
    }
  });

  const roleName = watch('name');
  const isPredefined = isPredefinedRole(roleName);

  // Fetch role data
  React.useEffect(() => {
    const fetchRole = async () => {
      setIsLoading(true);
      try {
        // Simulate API call
        await new Promise(resolve => setTimeout(resolve, 1000));
        
        // In a real implementation, we would fetch the role from Supabase
        setRole(mockRole);
        setPermissions(mockRolePermissions);
        
        reset({
          name: mockRole.name,
          description: mockRole.description || '',
        });
      } catch (error) {
        console.error('Error fetching role:', error);
        toast.error('Failed to load role data');
      } finally {
        setIsLoading(false);
      }
    };

    fetchRole();
  }, [params.id, reset]);

  const handlePermissionChange = (moduleId: string, permission: 'view' | 'create' | 'edit' | 'delete', value: boolean) => {
    // Don't allow changes for predefined roles
    if (isPredefined) return;

    setPermissions(prev => ({
      ...prev,
      [moduleId]: {
        ...prev[moduleId],
        [permission]: value,
        // If a higher permission is granted, automatically grant lower permissions
        ...(permission === 'delete' && value ? { edit: true, create: true, view: true } : {}),
        ...(permission === 'edit' && value ? { create: true, view: true } : {}),
        ...(permission === 'create' && value ? { view: true } : {}),
        // If a lower permission is revoked, automatically revoke higher permissions
        ...(permission === 'view' && !value ? { create: false, edit: false, delete: false } : {}),
        ...(permission === 'create' && !value ? { edit: false, delete: false } : {}),
        ...(permission === 'edit' && !value ? { delete: false } : {}),
      }
    }));
  };

  const onSubmit = async (data: RoleFormData) => {
    // Don't allow changes for predefined roles
    if (isPredefined) {
      toast.error('Predefined roles cannot be modified');
      return;
    }

    setIsSubmitting(true);
    try {
      // Here we would normally save the role and permissions to the database
      console.log('Role data:', data);
      console.log('Permissions:', permissions);
      
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      toast.success('Role updated successfully');
      router.push('/dashboard/roles');
    } catch (error) {
      console.error('Error updating role:', error);
      toast.error('Failed to update role');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isLoading) {
    return (
      <DashboardLayout>
        <div className="flex justify-center items-center h-64">
          <div className="flex flex-col items-center">
            <svg
              className="animate-spin h-8 w-8 text-blue-600 mb-4"
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
            >
              <circle
                className="opacity-25"
                cx="12"
                cy="12"
                r="10"
                stroke="currentColor"
                strokeWidth="4"
              ></circle>
              <path
                className="opacity-75"
                fill="currentColor"
                d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
              ></path>
            </svg>
            <p className="text-gray-600">Loading role data...</p>
          </div>
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <h1 className="text-2xl font-semibold text-gray-800">Edit Role: {role?.name}</h1>
        </div>
        
        <form onSubmit={handleSubmit(onSubmit)}>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="md:col-span-1">
              <Card>
                <CardHeader>
                  <CardTitle>Role Details</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <Controller
                    name="name"
                    control={control}
                    render={({ field }) => (
                      <Input
                        label="Role Name"
                        error={errors.name?.message}
                        disabled={isPredefined}
                        {...field}
                      />
                    )}
                  />
                  
                  <Controller
                    name="description"
                    control={control}
                    render={({ field }) => (
                      <div className="space-y-2">
                        <label className="block text-sm font-medium text-gray-700">
                          Description
                        </label>
                        <textarea
                          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:bg-gray-100 disabled:text-gray-500"
                          rows={4}
                          placeholder="Role description"
                          disabled={isPredefined}
                          {...field}
                        />
                      </div>
                    )}
                  />
                  
                  {isPredefined && (
                    <div className="bg-yellow-50 p-3 rounded-md text-yellow-800 text-sm">
                      This is a predefined role. It cannot be modified.
                    </div>
                  )}
                </CardContent>
              </Card>
            </div>
            
            <div className="md:col-span-2">
              <Card>
                <CardHeader>
                  <CardTitle>Permissions</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="overflow-x-auto">
                    <table className="w-full border-collapse">
                      <thead>
                        <tr className="bg-gray-50">
                          <th className="text-left p-3 border-b">Module</th>
                          <th className="text-center p-3 border-b">View</th>
                          <th className="text-center p-3 border-b">Create</th>
                          <th className="text-center p-3 border-b">Edit</th>
                          <th className="text-center p-3 border-b">Delete</th>
                        </tr>
                      </thead>
                      <tbody>
                        {mockModules.map(module => (
                          <tr key={module.id} className="border-b">
                            <td className="p-3">
                              <div className="font-medium">{module.name}</div>
                              <div className="text-sm text-gray-500">{module.description}</div>
                            </td>
                            <td className="text-center p-3">
                              <input
                                type="checkbox"
                                checked={permissions[module.id]?.view || false}
                                onChange={(e) => handlePermissionChange(module.id, 'view', e.target.checked)}
                                disabled={isPredefined}
                                className="h-4 w-4 text-blue-600 rounded disabled:opacity-50"
                              />
                            </td>
                            <td className="text-center p-3">
                              <input
                                type="checkbox"
                                checked={permissions[module.id]?.create || false}
                                onChange={(e) => handlePermissionChange(module.id, 'create', e.target.checked)}
                                disabled={isPredefined || !permissions[module.id]?.view}
                                className="h-4 w-4 text-blue-600 rounded disabled:opacity-50"
                              />
                            </td>
                            <td className="text-center p-3">
                              <input
                                type="checkbox"
                                checked={permissions[module.id]?.edit || false}
                                onChange={(e) => handlePermissionChange(module.id, 'edit', e.target.checked)}
                                disabled={isPredefined || !permissions[module.id]?.create}
                                className="h-4 w-4 text-blue-600 rounded disabled:opacity-50"
                              />
                            </td>
                            <td className="text-center p-3">
                              <input
                                type="checkbox"
                                checked={permissions[module.id]?.delete || false}
                                onChange={(e) => handlePermissionChange(module.id, 'delete', e.target.checked)}
                                disabled={isPredefined || !permissions[module.id]?.edit}
                                className="h-4 w-4 text-blue-600 rounded disabled:opacity-50"
                              />
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </CardContent>
                <CardFooter className="flex justify-end space-x-4">
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => router.push('/dashboard/roles')}
                  >
                    Cancel
                  </Button>
                  <Button
                    type="submit"
                    isLoading={isSubmitting}
                    loadingText="Saving..."
                    disabled={isPredefined}
                  >
                    Save Changes
                  </Button>
                </CardFooter>
              </Card>
            </div>
          </div>
        </form>
      </div>
    </DashboardLayout>
  );
}
