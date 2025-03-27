
import { supabase } from '../supabase/client';
import { Product, Category } from '@/types/inventory';

// Fix type conversion issues in these functions
export const fetchProductById = async (id: string): Promise<Product | null> => {
  try {
    const { data, error } = await supabase
      .from('products')
      .select(`
        *,
        category:categories(id, name, description)
      `)
      .eq('id', id)
      .single();

    if (error) {
      console.error('Error fetching product:', error);
      throw error;
    }

    return data;
  } catch (error) {
    console.error('Error in fetchProductById:', error);
    return null;
  }
};

export const fetchProducts = async (): Promise<Product[]> => {
  try {
    const { data, error } = await supabase
      .from('products')
      .select(`
        *,
        category:categories(id, name, description)
      `)
      .order('name');

    if (error) {
      console.error('Error fetching products:', error);
      throw error;
    }

    return data || [];
  } catch (error) {
    console.error('Error in fetchProducts:', error);
    return [];
  }
};

export const createProduct = async (product: Omit<Product, 'id' | 'created_at' | 'updated_at' | 'created_by' | 'updated_by'>): Promise<{ success: boolean; product?: Product; error?: string }> => {
  try {
    // Convert categoryId to proper format if it's a string
    const productToInsert = {
      ...product,
      category_id: product.category_id ? String(product.category_id) : null
    };

    const { data, error } = await supabase
      .from('products')
      .insert(productToInsert)
      .select()
      .single();

    if (error) throw error;

    return { success: true, product: data };
  } catch (error: any) {
    console.error('Error creating product:', error);
    return { 
      success: false, 
      error: error.message || 'Failed to create product' 
    };
  }
};

export const updateProduct = async (id: string, product: Partial<Product>): Promise<{ success: boolean; error?: string }> => {
  try {
    // Convert categoryId to proper format if it's a string
    const productToUpdate = {
      ...product,
      category_id: product.category_id ? String(product.category_id) : undefined,
      updated_at: new Date().toISOString()
    };

    const { error } = await supabase
      .from('products')
      .update(productToUpdate)
      .eq('id', id);

    if (error) throw error;

    return { success: true };
  } catch (error: any) {
    console.error('Error updating product:', error);
    return { 
      success: false, 
      error: error.message || 'Failed to update product' 
    };
  }
};

export const deleteProduct = async (id: string): Promise<{ success: boolean; error?: string }> => {
  try {
    const { error } = await supabase
      .from('products')
      .delete()
      .eq('id', id);

    if (error) throw error;

    return { success: true };
  } catch (error: any) {
    console.error('Error deleting product:', error);
    return { 
      success: false, 
      error: error.message || 'Failed to delete product' 
    };
  }
};

// This function needs to be created or corrected since it's causing TypeScript errors
export const fetchCategories = async (): Promise<Category[]> => {
  try {
    // This is using a table that might not exist in the schema yet
    // Using 'categories' string directly for now
    const { data, error } = await supabase
      .from('categories')
      .select('*')
      .order('name');

    if (error) {
      console.error('Error fetching categories:', error);
      throw error;
    }

    return data || [];
  } catch (error) {
    console.error('Error in fetchCategories:', error);
    return [];
  }
};

export const createCategory = async (category: Omit<Category, 'id'>): Promise<{ success: boolean; category?: Category; error?: string }> => {
  try {
    const { data, error } = await supabase
      .from('categories')
      .insert(category)
      .select()
      .single();

    if (error) throw error;

    return { success: true, category: data };
  } catch (error: any) {
    console.error('Error creating category:', error);
    return { 
      success: false, 
      error: error.message || 'Failed to create category' 
    };
  }
};

// Export the module
const productService = {
  fetchProductById,
  fetchProducts,
  createProduct,
  updateProduct,
  deleteProduct,
  fetchCategories,
  createCategory
};

export default productService;
