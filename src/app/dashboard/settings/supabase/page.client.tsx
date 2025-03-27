'use client';

import React from 'react';
import { DashboardLayout } from '@/components/common/layout/dashboard-layout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import toast from 'react-hot-toast';

export default function SupabaseStatusPage() {
  const [isChecking, setIsChecking] = React.useState(false);
  const [connectionStatus, setConnectionStatus] = React.useState<{
    success: boolean;
    message: string;
  } | null>(null);
  const [config, setConfig] = React.useState<{
    url: string;
    keyLastFour: string;
  } | null>(null);

  const checkConnection = async () => {
    setIsChecking(true);
    try {
      const response = await fetch('/api/supabase/status');
      if (!response.ok) {
        throw new Error('Failed to check connection');
      }
      
      const data = await response.json();
      setConnectionStatus(data);
      
      if (data.success) {
        toast.success('Connected to Supabase successfully');
      } else {
        toast.error(`Connection failed: ${data.message}`);
      }
    } catch (error: any) {
      console.error('Error checking connection:', error);
      toast.error(error.message || 'Failed to check connection');
    } finally {
      setIsChecking(false);
    }
  };

  const getConfig = async () => {
    try {
      const response = await fetch('/api/supabase/status', {
        method: 'POST',
      });
      if (!response.ok) {
        throw new Error('Failed to get configuration');
      }
      
      const data = await response.json();
      setConfig(data);
    } catch (error: any) {
      console.error('Error getting configuration:', error);
      toast.error(error.message || 'Failed to get configuration');
    }
  };

  React.useEffect(() => {
    // Get configuration on mount
    getConfig();
    
    // Check connection on mount
    checkConnection();
  }, []);

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <h1 className="text-2xl font-semibold text-gray-800">Supabase Status</h1>
          <Button 
            onClick={checkConnection}
            isLoading={isChecking}
            loadingText="Checking..."
          >
            Check Connection
          </Button>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Card>
            <CardHeader>
              <CardTitle>Connection Status</CardTitle>
            </CardHeader>
            <CardContent>
              {connectionStatus ? (
                <div className="space-y-4">
                  <div className="flex items-center space-x-2">
                    <div className={`h-4 w-4 rounded-full ${connectionStatus.success ? 'bg-green-500' : 'bg-red-500'}`}></div>
                    <span className="font-medium">{connectionStatus.success ? 'Connected' : 'Disconnected'}</span>
                  </div>
                  <p className="text-gray-600">{connectionStatus.message}</p>
                </div>
              ) : (
                <div className="flex justify-center items-center h-24">
                  <p className="text-gray-500">Checking connection status...</p>
                </div>
              )}
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader>
              <CardTitle>Configuration</CardTitle>
            </CardHeader>
            <CardContent>
              {config ? (
                <div className="space-y-4">
                  <div>
                    <h3 className="font-medium text-gray-700">Supabase URL</h3>
                    <p className="text-gray-600 break-all">{config.url}</p>
                  </div>
                  <div>
                    <h3 className="font-medium text-gray-700">API Key</h3>
                    <p className="text-gray-600">••••••••••••{config.keyLastFour}</p>
                  </div>
                  <p className="text-sm text-gray-500">
                    These values are configured in <code className="bg-gray-100 px-1 py-0.5 rounded">src/lib/supabase/client.ts</code>
                  </p>
                </div>
              ) : (
                <div className="flex justify-center items-center h-24">
                  <p className="text-gray-500">Loading configuration...</p>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
        
        <Card>
          <CardHeader>
            <CardTitle>Supabase Integration</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <p>
                This application is configured to use Supabase as its backend database and authentication provider.
                The connection is established using the Supabase client library and the credentials provided.
              </p>
              
              <h3 className="font-medium text-gray-700">Features</h3>
              <ul className="list-disc pl-5 space-y-1">
                <li>Authentication and user management</li>
                <li>Role-based access control</li>
                <li>Employee management</li>
                <li>Company data storage</li>
                <li>Real-time updates (coming soon)</li>
              </ul>
              
              <h3 className="font-medium text-gray-700">Switching to Self-Hosted Supabase</h3>
              <p>
                To switch to a self-hosted Supabase instance, update the URL and API key in the environment variables:
              </p>
              <pre className="bg-gray-100 p-3 rounded text-sm overflow-x-auto">
                {`NEXT_PUBLIC_SUPABASE_URL=your_self_hosted_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_self_hosted_key`}
              </pre>
              <p className="text-sm text-gray-500">
                You can also modify these values directly in <code className="bg-gray-100 px-1 py-0.5 rounded">src/lib/supabase/client.ts</code>
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  );
}
