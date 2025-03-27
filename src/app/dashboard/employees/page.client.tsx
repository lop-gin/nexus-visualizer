
'use client';

import React from 'react';
import { DashboardLayout } from '@/components/common/layout/dashboard-layout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { DataTable } from '@/components/common/data-display/data-table';
import { useRouter } from 'next/navigation';
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs';
import { Database } from '@/types/supabase';
import { Employee } from '@/types/auth';
import { PlusCircle, Edit, Trash2, Mail } from 'lucide-react';
import toast from 'react-hot-toast';
import { isValidStatus, ensureString } from '@/lib/utils';

export default function EmployeesPage() {
  const router = useRouter();
  const [isLoading, setIsLoading] = React.useState(true);
  const [employees, setEmployees] = React.useState<Employee[]>([]);
  const [isDeleting, setIsDeleting] = React.useState<string | null>(null);
  const [isSendingInvite, setIsSendingInvite] = React.useState<string | null>(null);
  const supabase = createClientComponentClient<Database>();

  // Fetch employees
  React.useEffect(() => {
    const fetchEmployees = async () => {
      setIsLoading(true);
      try {
        const { data, error } = await supabase
          .from('employees')
          .select(`
            *,
            role:role_id(id, name)
          `)
          .order('full_name');
        
        if (error) {
          throw error;
        }
        
        // Transform and validate the data
        const validEmployees = (data || []).map(emp => ({
          id: emp.id,
          full_name: emp.full_name,
          email: emp.email,
          phone: emp.phone,
          address: emp.address,
          company_id: emp.company_id,
          role_id: emp.role_id,
          role: emp.role,
          is_admin: emp.is_admin || false,
          status: isValidStatus(emp.status) ? emp.status : 'invited',
          created_at: emp.created_at,
          updated_at: emp.updated_at,
          user_id: emp.user_id,
          invitation_sent: emp.invitation_sent || false,
        }));
        
        setEmployees(validEmployees);
      } catch (error: any) {
        console.error('Error fetching employees:', error);
        toast.error('Failed to load employees');
      } finally {
        setIsLoading(false);
      }
    };

    fetchEmployees();
  }, [supabase]);

  const handleAddEmployee = () => {
    router.push('/dashboard/employees/add');
  };

  const handleEditEmployee = (employeeId: string) => {
    if (employeeId) {
      router.push(`/dashboard/employees/${employeeId}`);
    }
  };

  const handleDeleteEmployee = async (employeeId: string, employeeName: string) => {
    if (!employeeId) return;
    
    if (confirm(`Are you sure you want to delete ${employeeName}? This action cannot be undone.`)) {
      setIsDeleting(employeeId);
      try {
        const { error } = await supabase
          .from('employees')
          .delete()
          .eq('id', employeeId);

        if (error) {
          throw error;
        }

        // Remove employee from state
        setEmployees(prev => prev.filter(employee => employee.id !== employeeId));
        toast.success('Employee deleted successfully');
      } catch (error: any) {
        console.error('Error deleting employee:', error);
        toast.error(error.message || 'Failed to delete employee');
      } finally {
        setIsDeleting(null);
      }
    }
  };

  const handleSendInvite = async (employeeId: string, employeeEmail: string) => {
    if (!employeeId) return;
    
    setIsSendingInvite(employeeId);
    try {
      // Call API to send invitation
      const response = await fetch(`/api/employees/${employeeId}/invite`, {
        method: 'POST',
      });
      
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to send invitation');
      }
      
      toast.success(`Invitation sent to ${employeeEmail}`);
      
      // Update employee status in state
      setEmployees(prev => prev.map(emp => 
        emp.id === employeeId ? { ...emp, invitation_sent: true } : emp
      ));
    } catch (error: any) {
      console.error('Error sending invitation:', error);
      toast.error(error.message || 'Failed to send invitation');
    } finally {
      setIsSendingInvite(null);
    }
  };

  // Define columns with type-safe accessors
  const columns = [
    {
      header: 'Name',
      accessor: (employee: Employee) => employee.full_name
    },
    {
      header: 'Email',
      accessor: (employee: Employee) => employee.email
    },
    {
      header: 'Phone',
      accessor: (employee: Employee) => employee.phone || 'Not provided',
      className: 'hidden md:table-cell',
    },
    {
      header: 'Role',
      accessor: (employee: Employee) => employee.role?.name || 'Not assigned',
    },
    {
      header: 'Status',
      accessor: (employee: Employee) => (
        <span className={`px-2 py-1 rounded-full text-xs ${
          employee.user_id 
            ? 'bg-green-100 text-green-800' 
            : employee.invitation_sent
              ? 'bg-yellow-100 text-yellow-800'
              : 'bg-gray-100 text-gray-800'
        }`}>
          {employee.user_id 
            ? 'Active' 
            : employee.invitation_sent
              ? 'Invited'
              : 'Not Invited'}
        </span>
      ),
    },
    {
      header: 'Actions',
      accessor: (employee: Employee) => (
        <div className="flex space-x-2">
          <Button
            variant="outline"
            size="sm"
            onClick={(e) => {
              e.stopPropagation();
              if (employee.id) {
                handleEditEmployee(employee.id);
              }
            }}
          >
            <Edit className="h-4 w-4" />
            <span className="sr-only">Edit</span>
          </Button>
          
          {!employee.user_id && (
            <Button
              variant="outline"
              size="sm"
              className="text-blue-600 hover:text-blue-700 hover:bg-blue-50"
              onClick={(e) => {
                e.stopPropagation();
                if (employee.id) {
                  handleSendInvite(employee.id, employee.email);
                }
              }}
              disabled={isSendingInvite === employee.id}
            >
              {isSendingInvite === employee.id ? (
                <svg className="animate-spin h-4 w-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
              ) : (
                <Mail className="h-4 w-4" />
              )}
              <span className="sr-only">Send Invite</span>
            </Button>
          )}
          
          <Button
            variant="outline"
            size="sm"
            className="text-red-600 hover:text-red-700 hover:bg-red-50"
            onClick={(e) => {
              e.stopPropagation();
              if (employee.id) {
                handleDeleteEmployee(employee.id, employee.full_name);
              }
            }}
            disabled={isDeleting === employee.id}
          >
            {isDeleting === employee.id ? (
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
          <h1 className="text-2xl font-semibold text-gray-800">Employee Management</h1>
          <Button 
            onClick={handleAddEmployee}
          >
            <PlusCircle className="h-4 w-4 mr-2" />
            Add Employee
          </Button>
        </div>
        
        <Card>
          <CardHeader>
            <CardTitle>All Employees</CardTitle>
          </CardHeader>
          <CardContent>
            <DataTable
              data={employees}
              columns={columns}
              isLoading={isLoading}
              onRowClick={(employee) => employee.id && handleEditEmployee(employee.id)}
              emptyMessage="No employees found. Add your first employee by clicking 'Add Employee'."
            />
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  );
}
