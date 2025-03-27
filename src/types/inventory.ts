
/**
 * Product model
 */
export interface Product {
  id: number;
  name: string;
  description: string | null;
  primary_unit_of_measure: string;
  secondary_unit_of_measure: string | null;
  conversion_factor: number | null;
  category?: string | Category;
  default_unit_price?: number;
  default_tax_percent?: number;
  created_at?: string | null;
  updated_at?: string | null;
  created_by?: string | null;
  updated_by?: string | null;
}

/**
 * Category model
 */
export interface Category {
  id: string;
  name: string;
  description: string | null;
  created_at?: string | null;
  updated_at?: string | null;
  created_by?: string | null;
  updated_by?: string | null;
}

/**
 * Product unit type
 */
export interface ProductUnit {
  unit_type: 'primary' | 'secondary';
  unit_name: string;
}
