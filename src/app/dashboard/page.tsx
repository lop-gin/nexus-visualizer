'use client';

import React from 'react';
import { DashboardLayout } from '@/components/common/layout/dashboard-layout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useAuth } from '@/lib/auth/AuthContext';

export default function DashboardPage() {
  const { user, session } = useAuth();
  const userMetadata = session?.user?.user_metadata;

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div className="bg-white shadow rounded-lg p-6">
          <h1 className="text-2xl font-semibold text-gray-800 mb-4">Welcome to your Dashboard</h1>
          <p className="text-gray-600">
            Hello, {userMetadata?.full_name || user?.email}! This is your personalized dashboard.
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Card>
            <CardHeader>
              <CardTitle>Quick Actions</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                <a href="/dashboard/sales/invoice" className="block text-blue-600 hover:underline">Create Invoice</a>
                <a href="/dashboard/employees/add" className="block text-blue-600 hover:underline">Add Employee</a>
                <a href="/dashboard/roles" className="block text-blue-600 hover:underline">Manage Roles</a>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader>
              <CardTitle>Recent Activity</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-gray-600">No recent activity to display.</p>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader>
              <CardTitle>Account Summary</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                <p className="text-gray-600">Company: {userMetadata?.company_name || 'Not specified'}</p>
                <p className="text-gray-600">Type: {userMetadata?.company_type || 'Not specified'}</p>
                <p className="text-gray-600">Email: {user?.email}</p>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </DashboardLayout>
  );
}
