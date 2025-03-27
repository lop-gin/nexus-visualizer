
'use client';

import React, { useState } from 'react';
import { FormLayout, FormHeader, FormSection } from '@/components/common/layout/form-layout';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Card } from '@/components/ui/card';
import { executeSQLMigration, MigrationResult } from '@/lib/supabase/migrations';
import toast from 'react-hot-toast';

const DatabaseSettingsPage = () => {
  const [sqlQuery, setSqlQuery] = useState<string>('');
  const [isExecuting, setIsExecuting] = useState<boolean>(false);
  const [result, setResult] = useState<MigrationResult | null>(null);

  const executeSql = async () => {
    if (!sqlQuery.trim()) {
      toast.error('Please enter an SQL query');
      return;
    }

    setIsExecuting(true);
    try {
      const response = await fetch('/api/supabase/migrations', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ sql: sqlQuery }),
      });

      const data = await response.json();
      setResult(data);

      if (data.success) {
        toast.success(data.message || 'SQL executed successfully');
      } else {
        toast.error(data.error || 'Error executing SQL');
      }
    } catch (error: any) {
      console.error('Error executing SQL:', error);
      toast.error('Error executing SQL: ' + (error.message || 'Unknown error'));
    } finally {
      setIsExecuting(false);
    }
  };

  const handleSqlChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setSqlQuery(e.target.value);
  };

  return (
    <FormLayout>
      <FormHeader title="Database Settings" subtitle="Manage your database schema and data" />
      
      <div className="container px-4 py-6">
        <FormSection className="mb-8">
          <h2 className="text-xl font-semibold mb-4">Execute SQL</h2>
          <p className="text-gray-600 mb-4">
            Run SQL queries directly against your database. Use with caution as this can modify your data permanently.
          </p>
          
          <div className="space-y-4">
            <Textarea
              value={sqlQuery}
              onChange={handleSqlChange}
              rows={10}
              placeholder="Enter your SQL query here..."
              className="font-mono text-sm"
              disabled={isExecuting}
            />
            
            <div className="flex justify-end">
              <Button
                onClick={executeSql}
                disabled={isExecuting || !sqlQuery.trim()}
                className="ml-auto"
              >
                {isExecuting ? 'Executing...' : 'Execute SQL'}
              </Button>
            </div>
          </div>
        </FormSection>
        
        {result && (
          <Card className="p-4">
            <h3 className="text-lg font-semibold mb-2">Results</h3>
            <div className="bg-gray-50 p-4 rounded-md border">
              <p className={`text-sm mb-2 ${result.success ? 'text-green-600' : 'text-red-600'}`}>
                {result.success ? 'Success' : 'Error'}
              </p>
              
              {result.success ? (
                <div>
                  <p className="text-sm text-gray-600 mb-2">
                    {result.message || 'Query executed successfully.'}
                  </p>
                  {Array.isArray(result.results) && result.results.length > 0 && (
                    <pre className="text-xs bg-gray-900 text-gray-100 p-4 rounded overflow-auto max-h-60">
                      {JSON.stringify(result.results, null, 2)}
                    </pre>
                  )}
                </div>
              ) : (
                <p className="text-sm text-red-600">
                  {result.error || 'An unknown error occurred.'}
                </p>
              )}
            </div>
          </Card>
        )}
      </div>
    </FormLayout>
  );
};

export default DatabaseSettingsPage;
