'use client';

import React from 'react';
import { DashboardLayout } from '@/components/common/layout/dashboard-layout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { DataTable } from '@/components/common/data-display/data-table';
import { useRouter } from 'next/navigation';
import { Employee } from '@/types/auth';
import { PlusCircle } from 'lucide-react';

// Mock data for employees - will be replaced with actual data from Supabase
const mockEmployees: Employee[] = [
  {
    id: '1',
    full_name: 'John Doe',
    email: 'john.doe@example.com',
    phone: '+1234567890',
    company_name: 'Acme Inc',
    company_type: 'Manufacturer',
    role_id: '1',
    role: {
      id: '1',
      name: 'Admin',
      description: 'Administrator with full access',
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    },
    is_admin: true,
    status: 'active',
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
    address: null,
  },
  {
    id: '2',
    full_name: 'Jane Smith',
    email: 'jane.smith@example.com',
    phone: '+1987654321',
    company_name: 'Acme Inc',
    company_type: 'Manufacturer',
    role_id: '2',
    role: {
      id: '2',
      name: 'Sales Supervisor',
      description: 'Manages sales team and has access to all sales functions',
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    },
    is_admin: false,
    status: 'active',
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
    address: null,
  },
  {
    id: '3',
    full_name: 'Bob Johnson',
    email: 'bob.johnson@example.com',
    phone: '+1122334455',
    company_name: 'Acme Inc',
    company_type: 'Manufacturer',
    role_id: '3',
    role: {
      id: '3',
      name: 'Sales Rep',
      description: 'Can create and manage sales documents',
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    },
    is_admin: false,
    status: 'active',
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
    address: null,
  },
];

export default function EmployeesPage() {
  const router = useRouter();
  const [isLoading, setIsLoading] = React.useState(true);
  const [employees, setEmployees] = React.useState<Employee[]>([]);

  React.useEffect(() => {
    // Simulate loading data from API
    const timer = setTimeout(() => {
      setEmployees(mockEmployees);
      setIsLoading(false);
    }, 1000);

    return () => clearTimeout(timer);
  }, []);

  const handleAddEmployee = () => {
    router.push('/dashboard/employees/add');
  };

  const handleEmployeeClick = (employee: Employee) => {
    router.push(`/dashboard/employees/${employee.id}`);
  };

  const columns = [
    {
      header: 'Name',
      accessor: 'full_name',
    },
    {
      header: 'Email',
      accessor: 'email',
    },
    {
      header: 'Phone',
      accessor: 'phone',
    },
    {
      header: 'Role',
      accessor: (employee: Employee) => employee.role?.name || 'No role assigned',
    },
    {
      header: 'Status',
      accessor: (employee: Employee) => (
        <span className={`px-2 py-1 rounded-full text-xs ${
          employee.status === 'active' 
            ? 'bg-green-100 text-green-800' 
            : 'bg-gray-100 text-gray-800'
        }`}>
          {employee.status === 'active' ? 'Active' : 'Inactive'}
        </span>
      ),
    },
    {
      header: 'Actions',
      accessor: (employee: Employee) => (
        <Button 
          variant="outline" 
          size="sm"
          onClick={(e) => {
            e.stopPropagation();
            handleEmployeeClick(employee);
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
          <h1 className="text-2xl font-semibold text-gray-800">Employees Management</h1>
          <Button 
            onClick={handleAddEmployee}
            leftIcon={<PlusCircle className="h-4 w-4 mr-2" />}
          >
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
              onRowClick={handleEmployeeClick}
              emptyMessage="No employees found. Add your first employee by clicking 'Add Employee'."
            />
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  );
}
