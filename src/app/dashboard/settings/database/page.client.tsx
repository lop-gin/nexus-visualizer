
import React, { useState } from 'react';
import { DashboardLayout } from '@/components/common/layout/dashboard-layout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { executeSQLMigration, MigrationResult } from '@/lib/supabase/migrations';
import toast from 'react-hot-toast';
import { useCompany } from '@/providers/company-provider';

export default function DatabasePage() {
  const { isAdmin } = useCompany();
  const [sql, setSql] = useState('');
  const [executing, setExecuting] = useState(false);
  const [result, setResult] = useState<{ success: boolean; message: string }>({
    success: false,
    message: ''
  });

  const handleExecuteSQL = async () => {
    if (!sql.trim()) {
      toast.error('Please enter SQL to execute');
      return;
    }

    setExecuting(true);
    try {
      const res = await executeSQLMigration(sql);
      
      setResult({
        success: res.success,
        message: res.message || (res.error ? res.error : res.success ? 'SQL executed successfully' : 'Failed to execute SQL')
      });

      if (res.success) {
        toast.success('SQL executed successfully');
      } else {
        toast.error(res.error || 'Failed to execute SQL');
      }
    } catch (error: any) {
      console.error('Error executing SQL:', error);
      setResult({
        success: false,
        message: error.message || 'An error occurred while executing the SQL'
      });
      toast.error(error.message || 'An error occurred while executing the SQL');
    } finally {
      setExecuting(false);
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
            <CardTitle>Execute SQL</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="bg-yellow-50 border-l-4 border-yellow-400 p-4">
                <p className="text-sm text-yellow-700">
                  <strong>Warning:</strong> Executing raw SQL can be dangerous. 
                  Make sure you know what you are doing, as this can permanently 
                  alter your database.
                </p>
              </div>

              <Textarea
                label="SQL Statement"
                value={sql}
                onChange={e => setSql(e.target.value)}
                rows={10}
                placeholder="Enter SQL statement to execute..."
                className="font-mono"
                disabled={!isAdmin}
              />

              <div className="flex justify-end">
                <Button
                  onClick={handleExecuteSQL}
                  disabled={executing || !sql.trim() || !isAdmin}
                  isLoading={executing}
                  loadingText="Executing..."
                >
                  Execute SQL
                </Button>
              </div>

              {result.message && (
                <div className={`mt-4 p-4 border rounded ${result.success ? 'border-green-500 bg-green-50' : 'border-red-500 bg-red-50'}`}>
                  <h3 className={`font-medium ${result.success ? 'text-green-700' : 'text-red-700'}`}>
                    {result.success ? 'Success' : 'Error'}
                  </h3>
                  <p className="mt-1 text-sm whitespace-pre-wrap">
                    {result.message}
                  </p>
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  );
}
