import { createClientComponentClient } from '@supabase/auth-helpers-nextjs';
import { Database } from '@/types/supabase';
import toast from 'react-hot-toast';

// Service to handle data access with company isolation
export const useDataIsolationService = () => {
  const supabase = createClientComponentClient<Database>();
  
  // Function to ensure company context is set before any data operation
  const ensureCompanyContext = async () => {
    try {
      // Get current user session
      const { data: { session } } = await supabase.auth.getSession();
      
      if (!session) {
        throw new Error('No active session');
      }
      
      // Get user's company
      const { data: employee, error } = await supabase
        .from('employees')
        .select('company_id')
        .eq('user_id', session.user.id)
        .single();
      
      if (error || !employee) {
        throw new Error('Failed to get company information');
      }
      
      // Set company context for RLS policies
      await supabase.rpc('set_app_variables', {
        p_user_id: session.user.id,
        p_company_id: employee.company_id
      });
      
      return employee.company_id;
    } catch (error) {
      console.error('Error ensuring company context:', error);
      throw error;
    }
  };
  
  // Generic function to fetch data with company isolation
  const fetchIsolatedData = async <T,>(
    tableName: string,
    select: string = '*',
    additionalQuery?: (query: any) => any
  ): Promise<T[]> => {
    try {
      await ensureCompanyContext();
      
      let query = supabase
        .from(tableName)
        .select(select);
      
      // Apply additional query parameters if provided
      if (additionalQuery) {
        query = additionalQuery(query);
      }
      
      const { data, error } = await query;
      
      if (error) {
        throw error;
      }
      
      return data as T[];
    } catch (error) {
      console.error(`Error fetching ${tableName}:`, error);
      toast.error(`Failed to load ${tableName}`);
      return [];
    }
  };
  
  // Generic function to insert data with company isolation
  const insertIsolatedData = async <T,>(
    tableName: string,
    data: any
  ): Promise<T | null> => {
    try {
      const companyId = await ensureCompanyContext();
      
      // Add company_id to the data if not already present
      const dataWithCompany = {
        ...data,
        company_id: data.company_id || companyId
      };
      
      const { data: result, error } = await supabase
        .from(tableName)
        .insert([dataWithCompany])
        .select()
        .single();
      
      if (error) {
        throw error;
      }
      
      return result as T;
    } catch (error) {
      console.error(`Error inserting into ${tableName}:`, error);
      toast.error(`Failed to create ${tableName.slice(0, -1)}`);
      return null;
    }
  };
  
  // Generic function to update data with company isolation
  const updateIsolatedData = async <T,>(
    tableName: string,
    id: string,
    data: any
  ): Promise<T | null> => {
    try {
      await ensureCompanyContext();
      
      const { data: result, error } = await supabase
        .from(tableName)
        .update(data)
        .eq('id', id)
        .select()
        .single();
      
      if (error) {
        throw error;
      }
      
      return result as T;
    } catch (error) {
      console.error(`Error updating ${tableName}:`, error);
      toast.error(`Failed to update ${tableName.slice(0, -1)}`);
      return null;
    }
  };
  
  // Generic function to delete data with company isolation
  const deleteIsolatedData = async (
    tableName: string,
    id: string
  ): Promise<boolean> => {
    try {
      await ensureCompanyContext();
      
      const { error } = await supabase
        .from(tableName)
        .delete()
        .eq('id', id);
      
      if (error) {
        throw error;
      }
      
      return true;
    } catch (error) {
      console.error(`Error deleting from ${tableName}:`, error);
      toast.error(`Failed to delete ${tableName.slice(0, -1)}`);
      return false;
    }
  };
  
  return {
    ensureCompanyContext,
    fetchIsolatedData,
    insertIsolatedData,
    updateIsolatedData,
    deleteIsolatedData
  };
};

export default useDataIsolationService;
