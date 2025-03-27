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
import toast from 'react-hot-toast';
import { Role } from '@/types/auth';

// Schema for employee form
const employeeFormSchema = z.object({
  full_name: z.string().min(1, 'Full name is required'),
  email: z.string().email('Valid email is required'),
  phone: z.string().optional(),
  role_id: z.string().min(1, 'Role is required'),
  is_admin: z.boolean().default(false),
});

type EmployeeFormData = z.infer<typeof employeeFormSchema>;

export default function AddEmployeePage() {
  const router = useRouter();
  const [isLoading, setIsLoading] = React.useState(true);
  const [isSubmitting, setIsSubmitting] = React.useState(false);
  const [roles, setRoles] = React.useState<Role[]>([]);
  const [inviteOption, setInviteOption] = React.useState<'add' | 'add_and_invite'>('add');

  const { 
    control, 
    handleSubmit, 
    formState: { errors }
  } = useForm<EmployeeFormData>({
    resolver: zodResolver(employeeFormSchema),
    defaultValues: {
      full_name: '',
      email: '',
      phone: '',
      role_id: '',
      is_admin: false,
    }
  });

  // Load roles
  React.useEffect(() => {
    const fetchRoles = async () => {
      setIsLoading(true);
      try {
        const response = await fetch('/api/roles');
        if (!response.ok) {
          throw new Error('Failed to fetch roles');
        }
        
        const data = await response.json();
        setRoles(data.roles);
      } catch (error) {
        console.error('Error fetching roles:', error);
        toast.error('Failed to load roles');
      } finally {
        setIsLoading(false);
      }
    };

    fetchRoles();
  }, []);

  const onSubmit = async (data: EmployeeFormData) => {
    setIsSubmitting(true);
    try {
      const response = await fetch('/api/employees/new', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ...data,
          send_invite: inviteOption === 'add_and_invite',
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to create employee');
      }

      if (inviteOption === 'add_and_invite') {
        toast.success('Employee added and invitation sent');
      } else {
        toast.success('Employee added successfully');
      }
      
      router.push('/dashboard/employees');
    } catch (error: any) {
      console.error('Error adding employee:', error);
      toast.error(error.message || 'Failed to add employee');
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
                      >
                        <option value="">Select a role</option>
                        {roles.map(role => (
                          <option key={role.id} value={role.id}>
                            {role.name}
                          </option>
                        ))}
                      </select>
                      {errors.role_id && (
                        <p className="text-xs text-red-500">{errors.role_id.message}</p>
                      )}
                    </div>
                  )}
                />
                
                <Controller
                  name="is_admin"
                  control={control}
                  render={({ field }) => (
                    <div className="space-y-2 md:col-span-2">
                      <div className="flex items-center">
                        <input
                          type="checkbox"
                          id="is_admin"
                          className="h-4 w-4 text-blue-600 rounded"
                          checked={field.value}
                          onChange={(e) => field.onChange(e.target.checked)}
                        />
                        <label htmlFor="is_admin" className="ml-2 block text-sm text-gray-700">
                          Grant admin privileges
                        </label>
                      </div>
                      <p className="text-xs text-gray-500">
                        Admins can manage employees, roles, and have access to all system settings.
                      </p>
                    </div>
                  )}
                />
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
