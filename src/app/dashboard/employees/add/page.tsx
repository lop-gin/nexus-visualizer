'use client';

import React from 'react';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { DashboardLayout } from '@/components/common/layout/dashboard-layout';
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { useRouter } from 'next/navigation';
import toast from 'react-hot-toast';
import { employeeInviteSchema, type EmployeeInvite, PREDEFINED_ROLES } from '@/types/auth';
import { Role } from '@/types/auth';

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

export default function AddEmployeePage() {
  const router = useRouter();
  const [isLoading, setIsLoading] = React.useState(true);
  const [isSubmitting, setIsSubmitting] = React.useState(false);
  const [roles, setRoles] = React.useState<Role[]>([]);
  const [showCustomRole, setShowCustomRole] = React.useState(false);
  const [inviteOption, setInviteOption] = React.useState<'add' | 'add_and_invite'>('add');

  const { 
    control, 
    handleSubmit, 
    formState: { errors },
    watch,
    setValue
  } = useForm<EmployeeInvite>({
    resolver: zodResolver(employeeInviteSchema),
    defaultValues: {
      full_name: '',
      email: '',
      phone: '',
      role_id: '',
      custom_role: '',
    }
  });

  const selectedRoleId = watch('role_id');

  // Load roles
  React.useEffect(() => {
    const fetchRoles = async () => {
      setIsLoading(true);
      try {
        // Simulate API call
        await new Promise(resolve => setTimeout(resolve, 1000));
        
        // In a real implementation, we would fetch roles from Supabase
        setRoles(mockRoles);
      } catch (error) {
        console.error('Error fetching roles:', error);
        toast.error('Failed to load roles');
      } finally {
        setIsLoading(false);
      }
    };

    fetchRoles();
  }, []);

  // Handle role selection change
  React.useEffect(() => {
    if (selectedRoleId === 'custom') {
      setShowCustomRole(true);
    } else {
      setShowCustomRole(false);
    }
  }, [selectedRoleId]);

  const onSubmit = async (data: EmployeeInvite) => {
    setIsSubmitting(true);
    try {
      // Here we would normally save the employee to the database
      console.log('Employee data:', data);
      console.log('Invite option:', inviteOption);
      
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      if (inviteOption === 'add_and_invite') {
        toast.success('Employee added and invitation sent');
      } else {
        toast.success('Employee added successfully');
      }
      
      router.push('/dashboard/employees');
    } catch (error) {
      console.error('Error adding employee:', error);
      toast.error('Failed to add employee');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <h1 className="text-2xl font-semibold text-gray-800">Add Employee</h1>
        </div>
        
        <Card>
          <CardHeader>
            <CardTitle>Employee Information</CardTitle>
          </CardHeader>
          <CardContent>
            <form id="employee-form" onSubmit={handleSubmit(onSubmit)} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <Controller
                  name="full_name"
                  control={control}
                  render={({ field }) => (
                    <Input
                      label="Full Name"
                      error={errors.full_name?.message}
                      {...field}
                    />
                  )}
                />
                
                <Controller
                  name="email"
                  control={control}
                  render={({ field }) => (
                    <Input
                      type="email"
                      label="Email"
                      error={errors.email?.message}
                      {...field}
                    />
                  )}
                />
                
                <Controller
                  name="phone"
                  control={control}
                  render={({ field }) => (
                    <Input
                      label="Phone Number"
                      error={errors.phone?.message}
                      {...field}
                    />
                  )}
                />
                
                <Controller
                  name="role_id"
                  control={control}
                  render={({ field }) => (
                    <div className="space-y-2">
                      <label className="block text-sm font-medium text-gray-700">
                        Role
                      </label>
                      <select
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                        {...field}
                        onChange={(e) => {
                          field.onChange(e);
                          if (e.target.value === 'custom') {
                            setShowCustomRole(true);
                          } else {
                            setShowCustomRole(false);
                          }
                        }}
                      >
                        <option value="">Select a role</option>
                        {roles.map(role => (
                          <option key={role.id} value={role.id}>
                            {role.name}
                          </option>
                        ))}
                        <option value="custom">Create Custom Role</option>
                      </select>
                      {errors.role_id && (
                        <p className="text-xs text-red-500">{errors.role_id.message}</p>
                      )}
                    </div>
                  )}
                />
                
                {showCustomRole && (
                  <Controller
                    name="custom_role"
                    control={control}
                    render={({ field }) => (
                      <Input
                        label="Custom Role Name"
                        error={errors.custom_role?.message}
                        {...field}
                      />
                    )}
                  />
                )}
              </div>
            </form>
          </CardContent>
          <CardFooter className="flex justify-between">
            <Button
              type="button"
              variant="outline"
              onClick={() => router.push('/dashboard/employees')}
            >
              Cancel
            </Button>
            <div className="space-x-4">
              <Button
                type="button"
                onClick={() => {
                  setInviteOption('add');
                  document.getElementById('employee-form')?.dispatchEvent(
                    new Event('submit', { cancelable: true, bubbles: true })
                  );
                }}
                variant="outline"
                isLoading={isSubmitting && inviteOption === 'add'}
                loadingText="Adding..."
                disabled={isSubmitting}
              >
                Add Employee
              </Button>
              <Button
                type="button"
                onClick={() => {
                  setInviteOption('add_and_invite');
                  document.getElementById('employee-form')?.dispatchEvent(
                    new Event('submit', { cancelable: true, bubbles: true })
                  );
                }}
                isLoading={isSubmitting && inviteOption === 'add_and_invite'}
                loadingText="Adding & Inviting..."
                disabled={isSubmitting}
              >
                Add & Invite
              </Button>
            </div>
          </CardFooter>
        </Card>
      </div>
    </DashboardLayout>
  );
}
