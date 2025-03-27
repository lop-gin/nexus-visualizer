
'use client';

import React, { useState } from 'react';
import { DashboardLayout } from '@/components/common/layout/dashboard-layout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { executeSQLMigration, checkDatabaseStatus } from '@/lib/supabase/migrations';
import toast from 'react-hot-toast';

export default function DatabaseSettingsPage() {
  const [sqlQuery, setSqlQuery] = useState('');
  const [isExecuting, setIsExecuting] = useState(false);
  const [dbStatus, setDbStatus] = useState({ success: true, message: 'Checking database status...' });
  const [queryResult, setQueryResult] = useState<any>(null);

  // Check database status on component mount
  React.useEffect(() => {
    const checkStatus = async () => {
      try {
        const status = await checkDatabaseStatus();
        setDbStatus(status);
      } catch (error) {
        setDbStatus({ success: false, message: 'Failed to check database status' });
      }
    };

    checkStatus();
  }, []);

  const handleExecuteSQL = async () => {
    if (!sqlQuery.trim()) {
      toast.error('Please enter a SQL query to execute');
      return;
    }

    setIsExecuting(true);
    setQueryResult(null);
    
    try {
      const result = await executeSQLMigration(sqlQuery);
      
      if (result.success) {
        toast.success('SQL executed successfully');
        setQueryResult({ success: true, message: 'Query executed successfully' });
      } else {
        toast.error(result.error || 'Failed to execute SQL');
        setQueryResult({ success: false, error: result.error });
      }
    } catch (error: any) {
      toast.error(error.message || 'Failed to execute SQL');
      setQueryResult({ success: false, error: error.message });
    } finally {
      setIsExecuting(false);
    }
  };

  const handleSqlChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setSqlQuery(e.target.value);
  };

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <h1 className="text-2xl font-semibold text-gray-800">Database Management</h1>
        </div>
        
        <Card>
          <CardHeader>
            <CardTitle>Database Status</CardTitle>
          </CardHeader>
          <CardContent>
            <div className={`p-4 rounded-md ${dbStatus.success ? 'bg-green-50 text-green-800' : 'bg-red-50 text-red-800'}`}>
              {dbStatus.message}
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader>
            <CardTitle>Execute SQL</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <Textarea 
              label="SQL Query"
              rows={10}
              value={sqlQuery}
              onChange={handleSqlChange}
              placeholder="Enter SQL query to execute..."
            />
            
            <Button 
              onClick={handleExecuteSQL}
              disabled={isExecuting}
              className="w-full"
            >
              {isExecuting ? 'Executing...' : 'Execute SQL'}
            </Button>
            
            {queryResult && (
              <div className={`p-4 rounded-md mt-4 ${queryResult.success ? 'bg-green-50 text-green-800' : 'bg-red-50 text-red-800'}`}>
                {queryResult.success 
                  ? queryResult.message 
                  : `Error: ${queryResult.error}`}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  );
}
