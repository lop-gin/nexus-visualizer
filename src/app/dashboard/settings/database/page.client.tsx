'use client';

import React from 'react';
import { DashboardLayout } from '@/components/common/layout/dashboard-layout';
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import toast from 'react-hot-toast';

export default function DatabaseInitializationPage() {
  const [isChecking, setIsChecking] = React.useState(false);
  const [isInitializing, setIsInitializing] = React.useState(false);
  const [isInitialized, setIsInitialized] = React.useState<boolean | null>(null);
  const [initializationResult, setInitializationResult] = React.useState<{
    success: boolean;
    message?: string;
    error?: string;
  } | null>(null);

  const checkInitialization = async () => {
    setIsChecking(true);
    try {
      const response = await fetch('/api/supabase/migrations');
      if (!response.ok) {
        throw new Error('Failed to check database initialization');
      }
      
      const data = await response.json();
      setIsInitialized(data.initialized);
      
      if (data.initialized) {
        toast.success('Database is already initialized');
      } else {
        toast.info('Database needs initialization');
      }
    } catch (error: any) {
      console.error('Error checking initialization:', error);
      toast.error(error.message || 'Failed to check database initialization');
    } finally {
      setIsChecking(false);
    }
  };

  const initializeDatabase = async () => {
    setIsInitializing(true);
    try {
      const response = await fetch('/api/supabase/migrations', {
        method: 'POST',
      });
      
      const data = await response.json();
      setInitializationResult(data);
      
      if (data.success) {
        setIsInitialized(true);
        toast.success('Database initialized successfully');
      } else {
        toast.error(`Initialization failed: ${data.error}`);
      }
    } catch (error: any) {
      console.error('Error initializing database:', error);
      toast.error(error.message || 'Failed to initialize database');
      setInitializationResult({
        success: false,
        error: error.message || 'Failed to initialize database',
      });
    } finally {
      setIsInitializing(false);
    }
  };

  React.useEffect(() => {
    // Check initialization status on mount
    checkInitialization();
  }, []);

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <h1 className="text-2xl font-semibold text-gray-800">Database Management</h1>
          <Button 
            onClick={checkInitialization}
            isLoading={isChecking}
            loadingText="Checking..."
          >
            Check Status
          </Button>
        </div>
        
        <Card>
          <CardHeader>
            <CardTitle>Database Initialization</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-center space-x-2">
                <div className={`h-4 w-4 rounded-full ${
                  isInitialized === null 
                    ? 'bg-gray-300' 
                    : isInitialized 
                      ? 'bg-green-500' 
                      : 'bg-yellow-500'
                }`}></div>
                <span className="font-medium">
                  {isInitialized === null 
                    ? 'Checking status...' 
                    : isInitialized 
                      ? 'Database is initialized' 
                      : 'Database needs initialization'}
                </span>
              </div>
              
              <p className="text-gray-600">
                {isInitialized === null 
                  ? 'Checking if the database tables and initial data are set up...' 
                  : isInitialized 
                    ? 'All required database tables and initial data are already set up.' 
                    : 'The database needs to be initialized with the required tables and initial data.'}
              </p>
              
              {initializationResult && (
                <div className={`p-4 rounded-md ${
                  initializationResult.success 
                    ? 'bg-green-50 text-green-700' 
                    : 'bg-red-50 text-red-700'
                }`}>
                  <p className="font-medium">
                    {initializationResult.success 
                      ? 'Initialization Successful' 
                      : 'Initialization Failed'}
                  </p>
                  <p className="text-sm mt-1">
                    {initializationResult.message || initializationResult.error || 
                     (initializationResult.success 
                       ? 'All database tables and initial data have been set up successfully.' 
                       : 'There was an error initializing the database.')}
                  </p>
                </div>
              )}
            </div>
          </CardContent>
          <CardFooter>
            <Button
              onClick={initializeDatabase}
              isLoading={isInitializing}
              loadingText="Initializing..."
              disabled={isInitializing || isInitialized === true}
              className="w-full"
            >
              Initialize Database
            </Button>
          </CardFooter>
        </Card>
        
        <Card>
          <CardHeader>
            <CardTitle>Database Schema</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <p>
                The database schema includes the following tables:
              </p>
              
              <ul className="list-disc pl-5 space-y-1">
                <li><strong>companies</strong> - Stores information about manufacturing and distribution companies</li>
                <li><strong>roles</strong> - Defines user roles with predefined and custom options</li>
                <li><strong>modules</strong> - Represents different sections of the application</li>
                <li><strong>permissions</strong> - Maps roles to modules with specific access levels</li>
                <li><strong>employees</strong> - Stores employee information and their association with companies and roles</li>
                <li><strong>invitations</strong> - Manages employee invitation process</li>
              </ul>
              
              <p className="text-sm text-gray-500 mt-4">
                The initialization process creates all these tables with appropriate constraints and relationships,
                sets up row-level security policies, and populates the database with predefined roles and modules.
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  );
}
