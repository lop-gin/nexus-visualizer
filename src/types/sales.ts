
export interface Customer {
  id?: string
  name: string
  email?: string | null
  phone?: string | null
  address?: string | null
  company?: string | null
  billing_address?: string | null
  created_at?: string | null
  updated_at?: string | null
}

export interface SalesRep {
  id: string
  name: string
  email: string
}
