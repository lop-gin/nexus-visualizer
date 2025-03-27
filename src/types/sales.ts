
/**
 * Customer model
 */
export interface Customer {
  id?: string;
  name: string;
  email?: string | null;
  phone?: string | null;
  address?: string | null;
  company?: string | null;
  billing_address?: string | null;
  initial_balance?: number;
  created_at?: string | null;
  updated_at?: string | null;
  created_by?: string | null;
  updated_by?: string | null;
}

/**
 * Sales representative model
 */
export interface SalesRep {
  id: string;
  name: string;
  email: string;
  phone?: string | null;
  role?: string;
  created_at?: string | null;
  updated_at?: string | null;
}

/**
 * Invoice/transaction model
 */
export interface Transaction {
  id: string;
  transaction_number: string;
  transaction_type: 'invoice' | 'estimate' | 'purchase' | 'payment';
  customer_id: string;
  sales_rep_id?: string | null;
  transaction_date: string;
  due_date?: string | null;
  terms?: string | null;
  message?: string | null;
  net_total: number;
  tax_total: number;
  other_fees: number;
  gross_total: number;
  status: 'draft' | 'pending' | 'due' | 'paid' | 'overdue' | 'cancelled';
  items?: TransactionItem[];
  customer?: Customer;
  sales_rep?: SalesRep;
  created_at?: string;
  updated_at?: string;
  created_by?: string;
  updated_by?: string;
}

/**
 * Line item for invoices and other transactions
 */
export interface TransactionItem {
  id?: number;
  transaction_id: string;
  product_id?: string | null;
  description?: string | null;
  quantity: number;
  unit_of_measure: string;
  unit_type: 'primary' | 'secondary';
  unit_price: number;
  tax_percent: number;
  amount: number;
  primary_quantity?: number | null;
  product?: any;
}
