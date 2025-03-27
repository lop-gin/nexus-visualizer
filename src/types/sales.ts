import { z } from 'zod';

// Customer schema
export const customerSchema = z.object({
  id: z.string().uuid().optional(),
  name: z.string().min(1, "Customer name is required"),
  email: z.string().email("Valid email is required").nullable().optional(),
  phone: z.string().nullable().optional(),
  address: z.string().nullable().optional(),
  created_at: z.string().nullable().optional(),
  updated_at: z.string().nullable().optional(),
});

export type Customer = z.infer<typeof customerSchema>;

// Document item schema
export const documentItemSchema = z.object({
  id: z.string().uuid().optional(),
  document_id: z.string().uuid().optional(),
  product_name: z.string().min(1, "Product name is required"),
  description: z.string().nullable().optional(),
  quantity: z.number().min(0.01, "Quantity must be greater than 0"),
  unit_price: z.number().min(0, "Unit price cannot be negative"),
  tax_percent: z.number().min(0, "Tax percent cannot be negative").nullable().optional(),
  amount: z.number(),
  created_at: z.string().nullable().optional(),
  updated_at: z.string().nullable().optional(),
});

export type DocumentItem = z.infer<typeof documentItemSchema>;

// Other fees schema
export const otherFeesSchema = z.object({
  id: z.string().uuid().optional(),
  document_id: z.string().uuid().optional(),
  description: z.string().nullable().optional(),
  amount: z.number().optional(),
  created_at: z.string().nullable().optional(),
  updated_at: z.string().nullable().optional(),
});

export type OtherFees = z.infer<typeof otherFeesSchema>;

// Base document schema
export const baseDocumentSchema = z.object({
  id: z.string().uuid().optional(),
  document_number: z.string().optional(),
  document_type: z.string(),
  customer_id: z.string().uuid().nullable().optional(),
  customer_name: z.string().nullable().optional(),
  customer_email: z.string().nullable().optional(),
  customer_address: z.string().nullable().optional(),
  date: z.string(),
  due_date: z.string().nullable().optional(),
  terms: z.string().nullable().optional(),
  sales_rep: z.string().nullable().optional(),
  message: z.string().nullable().optional(),
  subtotal: z.number().default(0),
  tax_total: z.number().nullable().optional().default(0),
  total: z.number().default(0),
  balance_due: z.number().default(0),
  status: z.string().default('draft'),
  created_at: z.string().nullable().optional(),
  updated_at: z.string().nullable().optional(),
  items: z.array(documentItemSchema).default([]),
  otherFees: otherFeesSchema.nullable().optional(),
  customer: customerSchema.nullable().optional(),
});

// Invoice schema
export const invoiceSchema = baseDocumentSchema.extend({
  document_type: z.literal('invoice'),
  invoiceDate: z.string(),
  dueDate: z.string().nullable().optional(),
  messageOnInvoice: z.string().nullable().optional(),
});

export type Invoice = z.infer<typeof invoiceSchema>;

// Sales receipt schema
export const salesReceiptSchema = baseDocumentSchema.extend({
  document_type: z.literal('sales_receipt'),
  payment_method: z.string().nullable().optional(),
  payment_account: z.string().nullable().optional(),
  payment_date: z.string(),
  memo: z.string().nullable().optional(),
});

export type SalesReceipt = z.infer<typeof salesReceiptSchema>;

// Estimate schema
export const estimateSchema = baseDocumentSchema.extend({
  document_type: z.literal('estimate'),
  expiration_date: z.string().nullable().optional(),
});

export type Estimate = z.infer<typeof estimateSchema>;

// Document reference schema
export const documentReferenceSchema = z.object({
  id: z.string().uuid().optional(),
  source_document_id: z.string().uuid(),
  target_document_id: z.string().uuid(),
  reference_type: z.string(),
  amount: z.number().nullable().optional(),
  created_at: z.string().nullable().optional(),
  updated_at: z.string().nullable().optional(),
});

export type DocumentReference = z.infer<typeof documentReferenceSchema>;

// Document status types
export const DOCUMENT_STATUSES = [
  'draft',
  'pending',
  'sent',
  'paid',
  'overdue',
  'cancelled',
  'rejected',
  'accepted',
  'expired'
] as const;

export type DocumentStatus = typeof DOCUMENT_STATUSES[number];

// Document type constants
export const DOCUMENT_TYPES = {
  INVOICE: 'invoice',
  SALES_RECEIPT: 'sales_receipt',
  ESTIMATE: 'estimate',
  CREDIT_NOTE: 'credit_note',
  REFUND_RECEIPT: 'refund_receipt',
} as const;

export type DocumentType = typeof DOCUMENT_TYPES[keyof typeof DOCUMENT_TYPES];
