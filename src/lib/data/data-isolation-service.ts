
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs';
import { Database } from '@/types/supabase';

// Define types for tables allowed in our service
export type AllowedTable = 
  | 'companies'
  | 'employees'
  | 'roles'
  | 'invitations'
  | 'modules'
  | 'permissions'
  | 'products'
  | 'categories'
  | 'transactions'
  | 'transaction_items'
  | 'customers';

/**
 * Generic service for CRUD operations with proper company isolation
 */
export class DataIsolationService {
  private supabase = createClientComponentClient<Database>();
  
  /**
   * Create a new record in a table with company_id from the current user
   */
  async create<T extends Record<string, any>>(
    table: AllowedTable,
    data: Omit<T, 'company_id' | 'created_at' | 'updated_at'>
  ): Promise<T> {
    try {
      // Get the current user's company
      const { data: { session } } = await this.supabase.auth.getSession();
      if (!session) throw new Error('Not authenticated');
      
      // Get the user's company
      const { data: employee, error: employeeError } = await this.supabase
        .from('employees')
        .select('company_id')
        .eq('user_id', session.user.id)
        .single();
        
      if (employeeError) throw employeeError;
      if (!employee) throw new Error('No company found for user');
      
      // Insert data with company_id
      const insertData = {
        ...data,
        company_id: employee.company_id
      };
      
      const { data: newRecord, error } = await this.supabase
        .from(table)
        .insert(insertData as any)
        .select()
        .single();
        
      if (error) throw error;
      if (!newRecord) throw new Error(`Failed to create record in ${table}`);
      
      return newRecord as T;
    } catch (error) {
      console.error(`Error creating record in ${table}:`, error);
      throw error;
    }
  }
  
  /**
   * Fetch a single record by ID
   */
  async getById<T>(
    table: AllowedTable,
    id: string
  ): Promise<T | null> {
    try {
      const { data, error } = await this.supabase
        .from(table)
        .select('*')
        .eq('id', id)
        .maybeSingle();
        
      if (error) throw error;
      return data as T | null;
    } catch (error) {
      console.error(`Error fetching record from ${table}:`, error);
      throw error;
    }
  }
  
  /**
   * Update a record by ID
   */
  async update<T>(
    table: AllowedTable,
    id: string,
    data: Partial<T>
  ): Promise<T> {
    try {
      // Remove fields that shouldn't be updated directly
      const updateData = { ...data };
      delete (updateData as any).company_id;
      delete (updateData as any).created_at;
      
      const { data: updatedRecord, error } = await this.supabase
        .from(table)
        .update(updateData as any)
        .eq('id', id)
        .select()
        .single();
        
      if (error) throw error;
      if (!updatedRecord) throw new Error(`Record not found in ${table}`);
      
      return updatedRecord as T;
    } catch (error) {
      console.error(`Error updating record in ${table}:`, error);
      throw error;
    }
  }
  
  /**
   * Delete a record by ID
   */
  async delete(
    table: AllowedTable,
    id: string
  ): Promise<{ success: boolean }> {
    try {
      const { error } = await this.supabase
        .from(table)
        .delete()
        .eq('id', id);
        
      if (error) throw error;
      
      return { success: true };
    } catch (error) {
      console.error(`Error deleting record from ${table}:`, error);
      throw error;
    }
  }
  
  /**
   * List records with pagination and filtering
   */
  async list<T>(
    table: AllowedTable,
    {
      page = 1,
      limit = 50,
      filters = {},
      orderBy = 'created_at',
      ascending = false
    }: {
      page?: number;
      limit?: number;
      filters?: Record<string, any>;
      orderBy?: string;
      ascending?: boolean;
    } = {}
  ): Promise<{ data: T[]; count: number }> {
    try {
      // Calculate pagination
      const from = (page - 1) * limit;
      const to = from + limit - 1;
      
      // Start building the query
      let query = this.supabase
        .from(table)
        .select('*', { count: 'exact' })
        .range(from, to);
        
      // Apply filters
      Object.entries(filters).forEach(([key, value]) => {
        if (value !== undefined && value !== null && value !== '') {
          if (typeof value === 'string' && value.includes('*')) {
            // Use ILIKE for pattern matching
            query = query.ilike(key, value.replace(/\*/g, '%'));
          } else {
            query = query.eq(key, value);
          }
        }
      });
      
      // Apply ordering
      query = ascending 
        ? query.order(orderBy, { ascending: true })
        : query.order(orderBy, { ascending: false });
        
      const { data, error, count } = await query;
      
      if (error) throw error;
      
      return {
        data: (data || []) as T[],
        count: count || 0
      };
    } catch (error) {
      console.error(`Error listing records from ${table}:`, error);
      throw error;
    }
  }
}

// Export a singleton instance
export const dataService = new DataIsolationService();
