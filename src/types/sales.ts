
export interface Customer {
  id?: string;
  name: string;
  email?: string | null;
  phone?: string | null;
  address?: string | null;
  company?: string | null;
  billing_address?: string | null;
  initial_balance?: number | null;
  created_at?: string | null;
  updated_at?: string | null;
  created_by?: string;
  updated_by?: string;
}

export interface SalesRep {
  id: string;
  name: string;
  email: string;
}

export interface Transaction {
  id?: string;
  transaction_number: string;
  transaction_type: string; // invoice, quote, etc.
  customer_id: string;
  sales_rep_id: string | null;
  transaction_date: string;
  due_date: string | null;
  terms: string | null;
  message: string | null;
  sub_total: number;
  tax_total: number;
  total: number;
  status: string;
}

export interface TransactionItem {
  id?: string;
  transaction_id: string;
  product_id: string | null;
  description: string | null;
  quantity: number;
  unit_of_measure: string;
  unit_type: 'primary' | 'secondary';
  unit_price: number;
  tax_percent: number;
  amount: number;
}

// Type guard for checking valid string IDs
export function isValidId(id: string | null | undefined): id is string {
  return id !== null && id !== undefined && id.trim() !== '';
}
