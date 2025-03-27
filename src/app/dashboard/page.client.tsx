'use client';

import React from 'react';
import { DashboardLayout } from '@/components/common/layout/dashboard-layout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/providers/auth-provider';
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs';
import { Database } from '@/types/supabase';
import toast from 'react-hot-toast';

export default function DashboardPage() {
  const { user, signOut } = useAuth();
  const [isLoading, setIsLoading] = React.useState(true);
  const [companyData, setCompanyData] = React.useState<any>(null);
  const [employeeData, setEmployeeData] = React.useState<any>(null);
  const supabase = createClientComponentClient<Database>();

  // Fetch company and employee data
  React.useEffect(() => {
    const fetchData = async () => {
      if (!user) return;
      
      setIsLoading(true);
      try {
        // Get employee data for current user
        const { data: employee, error: employeeError } = await supabase
          .from('employees')
          .select(`
            *,
            company:company_id(*),
            role:role_id(*)
          `)
          .eq('user_id', user.id)
          .single();
        
        if (employeeError) {
          throw employeeError;
        }
        
        setEmployeeData(employee);
        setCompanyData(employee.company);
        
      } catch (error: any) {
        console.error('Error fetching data:', error);
        toast.error('Failed to load dashboard data');
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchData();
  }, [user, supabase]);

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <h1 className="text-2xl font-semibold text-gray-800">Dashboard</h1>
          <Button onClick={signOut} variant="outline">Sign Out</Button>
        </div>
        
        {isLoading ? (
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
              <p className="text-gray-600">Loading dashboard data...</p>
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>User Information</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div>
                    <h3 className="font-medium text-gray-700">Email</h3>
                    <p className="text-gray-600">{user?.email}</p>
                  </div>
                  <div>
                    <h3 className="font-medium text-gray-700">Name</h3>
                    <p className="text-gray-600">{employeeData?.full_name || 'Not available'}</p>
                  </div>
                  <div>
                    <h3 className="font-medium text-gray-700">Role</h3>
                    <p className="text-gray-600">{employeeData?.role?.name || 'Not assigned'}</p>
                  </div>
                  <div>
                    <h3 className="font-medium text-gray-700">Admin Status</h3>
                    <p className="text-gray-600">{employeeData?.is_admin ? 'Administrator' : 'Regular User'}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader>
                <CardTitle>Company Information</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div>
                    <h3 className="font-medium text-gray-700">Company Name</h3>
                    <p className="text-gray-600">{companyData?.name || 'Not available'}</p>
                  </div>
                  <div>
                    <h3 className="font-medium text-gray-700">Company Type</h3>
                    <p className="text-gray-600">
                      {companyData?.type === 'manufacturer' ? 'Manufacturer' : 
                       companyData?.type === 'distributor' ? 'Distributor' : 
                       companyData?.type === 'both' ? 'Manufacturer & Distributor' : 
                       'Not specified'}
                    </p>
                  </div>
                  <div>
                    <h3 className="font-medium text-gray-700">Address</h3>
                    <p className="text-gray-600">{companyData?.address || 'Not available'}</p>
                  </div>
                  <div>
                    <h3 className="font-medium text-gray-700">Contact</h3>
                    <p className="text-gray-600">
                      {companyData?.phone ? `Phone: ${companyData.phone}` : ''}
                      {companyData?.email ? (companyData?.phone ? ', ' : '') + `Email: ${companyData.email}` : ''}
                      {!companyData?.phone && !companyData?.email ? 'Not available' : ''}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
            
            <Card className="md:col-span-2">
              <CardHeader>
                <CardTitle>Quick Actions</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <Button 
                    onClick={() => window.location.href = '/dashboard/employees'}
                    className="h-auto py-6 flex flex-col items-center justify-center"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 mb-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
                    </svg>
                    <span>Manage Employees</span>
                  </Button>
                  
                  <Button 
                    onClick={() => window.location.href = '/dashboard/roles'}
                    className="h-auto py-6 flex flex-col items-center justify-center"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 mb-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                    </svg>
                    <span>Manage Roles</span>
                  </Button>
                  
                  <Button 
                    onClick={() => window.location.href = '/dashboard/settings/database'}
                    className="h-auto py-6 flex flex-col items-center justify-center"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 mb-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                    </svg>
                    <span>Database Settings</span>
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        )}
      </div>
    </DashboardLayout>
  );
}
