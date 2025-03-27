import { createClientComponentClient } from '@supabase/auth-helpers-nextjs';
import { Database } from '@/types/supabase';
import { Product } from '@/types/inventory';
import toast from 'react-hot-toast';

// Service functions for product management
export const useProductService = () => {
  const supabase = createClientComponentClient<Database>();
  
  // Fetch all products for the current company
  const getProducts = async (): Promise<Product[]> => {
    try {
      const { data, error } = await supabase
        .from('products')
        .select('*, category:category_id(id, name)')
        .order('name');
      
      if (error) {
        throw error;
      }
      
      return data || [];
    } catch (error: any) {
      console.error('Error fetching products:', error);
      toast.error('Failed to load products');
      return [];
    }
  };
  
  // Get a single product by ID
  const getProductById = async (id: string): Promise<Product | null> => {
    try {
      const { data, error } = await supabase
        .from('products')
        .select('*, category:category_id(id, name)')
        .eq('id', id)
        .single();
      
      if (error) {
        throw error;
      }
      
      return data;
    } catch (error: any) {
      console.error('Error fetching product:', error);
      toast.error('Failed to load product details');
      return null;
    }
  };
  
  // Create a new product
  const createProduct = async (product: Omit<Product, 'id' | 'created_at' | 'updated_at' | 'created_by' | 'updated_by'>): Promise<Product | null> => {
    try {
      const { data, error } = await supabase
        .from('products')
        .insert([product])
        .select()
        .single();
      
      if (error) {
        throw error;
      }
      
      toast.success('Product created successfully');
      return data;
    } catch (error: any) {
      console.error('Error creating product:', error);
      toast.error(error.message || 'Failed to create product');
      return null;
    }
  };
  
  // Update an existing product
  const updateProduct = async (id: string, product: Partial<Product>): Promise<Product | null> => {
    try {
      const { data, error } = await supabase
        .from('products')
        .update(product)
        .eq('id', id)
        .select()
        .single();
      
      if (error) {
        throw error;
      }
      
      toast.success('Product updated successfully');
      return data;
    } catch (error: any) {
      console.error('Error updating product:', error);
      toast.error(error.message || 'Failed to update product');
      return null;
    }
  };
  
  // Delete a product
  const deleteProduct = async (id: string): Promise<boolean> => {
    try {
      const { error } = await supabase
        .from('products')
        .delete()
        .eq('id', id);
      
      if (error) {
        throw error;
      }
      
      toast.success('Product deleted successfully');
      return true;
    } catch (error: any) {
      console.error('Error deleting product:', error);
      toast.error(error.message || 'Failed to delete product');
      return false;
    }
  };
  
  // Fetch all categories for the current company
  const getCategories = async () => {
    try {
      const { data, error } = await supabase
        .from('categories')
        .select('*')
        .order('name');
      
      if (error) {
        throw error;
      }
      
      return data || [];
    } catch (error: any) {
      console.error('Error fetching categories:', error);
      toast.error('Failed to load categories');
      return [];
    }
  };
  
  // Create a new category
  const createCategory = async (category: { name: string; description?: string; company_id: number }) => {
    try {
      const { data, error } = await supabase
        .from('categories')
        .insert([category])
        .select()
        .single();
      
      if (error) {
        throw error;
      }
      
      toast.success('Category created successfully');
      return data;
    } catch (error: any) {
      console.error('Error creating category:', error);
      toast.error(error.message || 'Failed to create category');
      return null;
    }
  };
  
  return {
    getProducts,
    getProductById,
    createProduct,
    updateProduct,
    deleteProduct,
    getCategories,
    createCategory
  };
};

export default useProductService;
