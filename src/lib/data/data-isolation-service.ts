import { supabase } from '@/lib/supabase/client';
import { PostgrestFilterBuilder } from '@supabase/postgrest-js';

// Type for allowed table names to eliminate the "string is not assignable to never" errors
type AllowedTable = 
  | 'companies' 
  | 'roles' 
  | 'modules' 
  | 'permissions' 
  | 'employees' 
  | 'invitations' 
  | 'products' 
  | 'transactions' 
  | 'transaction_items' 
  | 'customers'
  | 'categories';

/**
 * Set app variables for data isolation (company context and user context)
 */
export async function setIsolationContext(userId: string, companyId: string): Promise<boolean> {
  try {
    const { error } = await supabase.rpc('set_app_variables', {
      p_user_id: userId,
      p_company_id: companyId
    });

    if (error) throw error;
    
    return true;
  } catch (error) {
    console.error('Error setting isolation context:', error);
    return false;
  }
}

/**
 * Fetch data from a table with pagination, filtering, and sorting
 */
export async function fetchTableData<T>(
  table: AllowedTable,
  options: {
    page?: number;
    limit?: number;
    filterColumn?: string;
    filterValue?: string;
    sortColumn?: string;
    sortOrder?: 'asc' | 'desc';
    selectFields?: string;
  } = {}
): Promise<{
  data: T[];
  count: number;
  page: number;
  limit: number;
  totalPages: number;
}> {
  try {
    let query: PostgrestFilterBuilder<any, any, any> = supabase
      .from(table)
      .select(options.selectFields || '*', { count: 'exact' });

    // Apply filters
    if (options.filterColumn && options.filterValue) {
      query = query.ilike(options.filterColumn, `%${options.filterValue}%`);
    }

    // Apply sorting
    if (options.sortColumn) {
      query = query.order(options.sortColumn, { ascending: options.sortOrder === 'asc' });
    }

    const page = options.page || 1;
    const limit = options.limit || 10;
    const startIndex = (page - 1) * limit;
    const endIndex = startIndex + limit - 1;

    query = query.range(startIndex, endIndex);

    const { data, error, count } = await query;

    if (error) throw error;

    const totalCount = count || 0;
    const totalPages = Math.ceil(totalCount / limit);

    return {
      data: data || [],
      count: totalCount,
      page,
      limit,
      totalPages,
    };
  } catch (error) {
    console.error('Error fetching table data:', error);
    return {
      data: [],
      count: 0,
      page: 1,
      limit: 10,
      totalPages: 0,
    };
  }
}

/**
 * Insert data into a table
 */
export async function insertTableData<T>(table: AllowedTable, data: T): Promise<T | null> {
  try {
    const { data: insertedData, error } = await supabase
      .from(table)
      .insert([data])
      .select()
      .single();

    if (error) throw error;

    return insertedData;
  } catch (error) {
    console.error('Error inserting table data:', error);
    return null;
  }
}

/**
 * Update data in a table
 */
export async function updateTableData<T>(table: AllowedTable, id: string, updates: Partial<T>, idColumn: string = 'id'): Promise<T | null> {
  try {
    const { data: updatedData, error } = await supabase
      .from(table)
      .update(updates)
      .eq(idColumn, id)
      .select()
      .single();

    if (error) throw error;

    return updatedData;
  } catch (error) {
    console.error('Error updating table data:', error);
    return null;
  }
}

/**
 * Delete data from a table
 */
export async function deleteTableData(table: AllowedTable, id: string, idColumn: string = 'id'): Promise<boolean> {
  try {
    const { error } = await supabase
      .from(table)
      .delete()
      .eq(idColumn, id);

    if (error) throw error;

    return true;
  } catch (error) {
    console.error('Error deleting table data:', error);
    return false;
  }
}
