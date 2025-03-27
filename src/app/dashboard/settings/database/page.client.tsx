
'use client';

import React from 'react';
import { DashboardLayout } from '@/components/common/layout/dashboard-layout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import enhancedToast from '@/lib/toast-utils';
import { executeSQLMigration } from '@/lib/supabase/migrations';

export default function DatabaseSettingsPage() {
  const [sql, setSql] = React.useState('');
  const [result, setResult] = React.useState<any>(null);
  const [isExecuting, setIsExecuting] = React.useState(false);

  const handleExecuteSQL = async () => {
    if (!sql.trim()) {
      enhancedToast.error('Please enter SQL to execute');
      return;
    }

    setIsExecuting(true);
    setResult(null);
    
    try {
      const response = await executeSQLMigration(sql);
      setResult(response);
      
      if (response.success) {
        enhancedToast.info('SQL executed successfully');
      } else {
        enhancedToast.error(response.error || 'Failed to execute SQL');
      }
    } catch (error: any) {
      console.error('Error executing SQL:', error);
      setResult({ success: false, error: error.message });
      enhancedToast.error(error.message || 'Failed to execute SQL');
    } finally {
      setIsExecuting(false);
    }
  };

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <h1 className="text-2xl font-semibold text-gray-800">Database Management</h1>
        </div>
        
        <Card>
          <CardHeader>
            <CardTitle>SQL Console</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <label className="text-sm font-medium">Enter SQL Query</label>
              <Textarea
                value={sql}
                onChange={(e) => setSql(e.target.value)}
                placeholder="SELECT * FROM your_table"
                className="h-32 font-mono"
              />
            </div>
            
            <div className="flex justify-end">
              <Button
                onClick={handleExecuteSQL}
                isLoading={isExecuting}
                loadingText="Executing..."
              >
                Execute SQL
              </Button>
            </div>
            
            {result && (
              <div className="mt-4 border rounded-md p-4">
                <h3 className="text-lg font-medium mb-2">Result</h3>
                <pre className="bg-gray-50 p-4 rounded-md overflow-auto max-h-96 text-sm">
                  {JSON.stringify(result, null, 2)}
                </pre>
              </div>
            )}
            
            <div className="mt-4 p-4 bg-yellow-50 rounded-md border border-yellow-200">
              <p className="text-yellow-800 text-sm">
                <strong>Warning:</strong> Be careful when executing SQL queries. Changes made to your database are permanent. Make sure to back up your data before making significant changes.
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  );
}
