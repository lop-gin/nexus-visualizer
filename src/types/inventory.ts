
export interface Product {
  id: string;
  name: string;
  description: string | null;
  sku: string | null;
  barcode: string | null;
  price: number;
  cost: number | null;
  tax_rate: number | null;
  primary_unit_of_measure: string;
  secondary_unit_of_measure: string | null;
  conversion_factor: number | null;
  min_stock_level: number | null;
  max_stock_level: number | null;
  reorder_point: number | null;
  is_active: boolean;
  category_id: string | null;
  created_at: string;
  updated_at: string;
  created_by: string | null;
  updated_by: string | null;
  category?: Category | null;
}

export interface Category {
  id: string;
  name: string;
  description: string | null;
  created_at?: string;
  updated_at?: string;
}
