
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

export interface TransactionItem {
  transaction_id: string;
  product_id: string | null;
  description: string | null;
  quantity: number;
  unit_of_measure: string;
  unit_type: "primary" | "secondary";
  unit_price: number;
  tax_percent: number;
  amount: number;
}

export interface Transaction {
  id?: string;
  transaction_number: string;
  transaction_type: string;
  customer_id: string;
  sales_rep_id: string | null;
  transaction_date: string;
  due_date: string | null;
  terms: string | null;
  message: string | null;
  net_total: number;
  tax_total: number;
  other_fees: number;
  gross_total: number;
  status: string;
}
