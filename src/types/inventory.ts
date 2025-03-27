
export interface Product {
  id: number
  name: string
  description: string | null
  primary_unit_of_measure: string
  secondary_unit_of_measure: string | null
  conversion_factor: number | null
  created_at?: string
  updated_at?: string
  created_by?: string
  updated_by?: string
}

export interface Category {
  id: number
  name: string
  description: string | null
  created_at?: string
  updated_at?: string
  created_by?: string
  updated_by?: string
}

export interface ProductUnit {
  unit_type: string
  unit_name: string
}
