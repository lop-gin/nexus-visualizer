import { z } from 'zod';

// Inventory item schema
export const inventoryItemSchema = z.object({
  id: z.string().uuid().optional(),
  name: z.string().min(1, "Item name is required"),
  sku: z.string().nullable().optional(),
  description: z.string().nullable().optional(),
  category: z.string().nullable().optional(),
  type: z.enum(['raw_material', 'finished_good', 'component']),
  unit_of_measure: z.string().nullable().optional(),
  cost_price: z.number().min(0, "Cost price cannot be negative").nullable().optional(),
  selling_price: z.number().min(0, "Selling price cannot be negative").nullable().optional(),
  reorder_point: z.number().min(0, "Reorder point cannot be negative").nullable().optional(),
  current_stock: z.number().default(0).nullable().optional(),
  created_at: z.string().nullable().optional(),
  updated_at: z.string().nullable().optional(),
});

export type InventoryItem = z.infer<typeof inventoryItemSchema>;

// Bill of materials schema
export const billOfMaterialsSchema = z.object({
  id: z.string().uuid().optional(),
  product_id: z.string().uuid(),
  name: z.string().min(1, "BOM name is required"),
  description: z.string().nullable().optional(),
  version: z.string().nullable().optional(),
  is_active: z.boolean().default(true).nullable().optional(),
  created_at: z.string().nullable().optional(),
  updated_at: z.string().nullable().optional(),
  items: z.array(z.object({
    id: z.string().uuid().optional(),
    bom_id: z.string().uuid().optional(),
    component_id: z.string().uuid(),
    quantity: z.number().min(0.01, "Quantity must be greater than 0"),
    unit_of_measure: z.string().nullable().optional(),
    notes: z.string().nullable().optional(),
    component: inventoryItemSchema.optional(),
  })).default([]),
});

export type BillOfMaterials = z.infer<typeof billOfMaterialsSchema>;

// Production order schema
export const productionOrderSchema = z.object({
  id: z.string().uuid().optional(),
  order_number: z.string(),
  product_id: z.string().uuid(),
  bom_id: z.string().uuid(),
  quantity: z.number().min(0.01, "Quantity must be greater than 0"),
  start_date: z.string().nullable().optional(),
  due_date: z.string().nullable().optional(),
  status: z.enum(['planned', 'in_progress', 'completed', 'cancelled']).default('planned'),
  notes: z.string().nullable().optional(),
  created_at: z.string().nullable().optional(),
  updated_at: z.string().nullable().optional(),
  product: inventoryItemSchema.optional(),
  bom: billOfMaterialsSchema.optional(),
});

export type ProductionOrder = z.infer<typeof productionOrderSchema>;

// Inventory item types
export const INVENTORY_ITEM_TYPES = [
  'raw_material',
  'finished_good',
  'component'
] as const;

export type InventoryItemType = typeof INVENTORY_ITEM_TYPES[number];

// Production order status types
export const PRODUCTION_ORDER_STATUSES = [
  'planned',
  'in_progress',
  'completed',
  'cancelled'
] as const;

export type ProductionOrderStatus = typeof PRODUCTION_ORDER_STATUSES[number];

// Common units of measure
export const UNITS_OF_MEASURE = [
  'each',
  'kg',
  'g',
  'lb',
  'oz',
  'l',
  'ml',
  'm',
  'cm',
  'mm',
  'in',
  'ft',
  'yd',
  'box',
  'case',
  'pallet',
  'pack',
  'pair',
  'set',
  'unit'
] as const;

export type UnitOfMeasure = typeof UNITS_OF_MEASURE[number];
