import { z } from 'zod';

// Define predefined roles
export const PREDEFINED_ROLES = [
  'Admin',
  'Sales Supervisor',
  'Sales Rep',
  'Procurement Supervisor',
  'Procurement Rep',
  'Production Supervisor',
  'Machine Operator',
  'Packaging Supervisor',
  'Packaging Person',
  'Transport Supervisor',
  'Transport Person',
  'Store Supervisor',
  'Store Person',
  'HR Supervisor'
] as const;

export type PredefinedRole = typeof PREDEFINED_ROLES[number];

// Helper function to check if a role name is predefined
export function isPredefinedRole(roleName: string): boolean {
  return PREDEFINED_ROLES.includes(roleName as PredefinedRole);
}

// Permission schema
export const permissionSchema = z.object({
  id: z.string().uuid().optional(),
  role_id: z.string().uuid(),
  module: z.string(),
  can_view: z.boolean().default(false),
  can_create: z.boolean().default(false),
  can_edit: z.boolean().default(false),
  can_delete: z.boolean().default(false),
  created_at: z.string().nullable().optional(),
  updated_at: z.string().nullable().optional(),
});

export type Permission = z.infer<typeof permissionSchema>;

// Role schema
export const roleSchema = z.object({
  id: z.string().uuid().optional(),
  name: z.string().min(1, "Role name is required"),
  description: z.string().nullable().optional(),
  created_at: z.string().nullable().optional(),
  updated_at: z.string().nullable().optional(),
  permissions: z.array(permissionSchema).optional(),
});

export type Role = z.infer<typeof roleSchema>;

// Employee schema
export const employeeSchema = z.object({
  id: z.string().uuid().optional(),
  full_name: z.string().min(1, "Full name is required"),
  email: z.string().email("Valid email is required"),
  phone: z.string().nullable().optional(),
  address: z.string().nullable().optional(),
  company_name: z.string().nullable().optional(),
  company_type: z.string().nullable().optional(),
  role_id: z.string().uuid().nullable().optional(),
  role: roleSchema.nullable().optional(),
  is_admin: z.boolean().default(false),
  status: z.enum(['active', 'inactive', 'invited']).default('active'),
  created_at: z.string().nullable().optional(),
  updated_at: z.string().nullable().optional(),
});

export type Employee = z.infer<typeof employeeSchema>;

// Employee invite schema
export const employeeInviteSchema = z.object({
  full_name: z.string().min(1, "Full name is required"),
  email: z.string().email("Valid email is required"),
  phone: z.string().optional(),
  role_id: z.string().min(1, "Role is required"),
  custom_role: z.string().optional(),
}).refine(data => {
  // If role_id is 'custom', custom_role is required
  if (data.role_id === 'custom') {
    return !!data.custom_role;
  }
  return true;
}, {
  message: "Custom role name is required",
  path: ["custom_role"],
});

export type EmployeeInvite = z.infer<typeof employeeInviteSchema>;

// User schema
export const userSchema = z.object({
  id: z.string().uuid(),
  email: z.string().email(),
  created_at: z.string(),
  updated_at: z.string().nullable().optional(),
  user_metadata: z.object({
    full_name: z.string().optional(),
    company_name: z.string().optional(),
    company_type: z.string().optional(),
    phone: z.string().optional(),
    address: z.string().optional(),
    is_admin: z.boolean().optional(),
    role_id: z.string().optional(),
  }).optional(),
});

export type User = z.infer<typeof userSchema>;

// Session schema
export const sessionSchema = z.object({
  access_token: z.string(),
  refresh_token: z.string().optional(),
  expires_in: z.number().optional(),
  expires_at: z.number().optional(),
  token_type: z.string(),
  user: userSchema,
});

export type Session = z.infer<typeof sessionSchema>;

// Auth context schema
export const authContextSchema = z.object({
  user: userSchema.nullable(),
  session: sessionSchema.nullable(),
  isLoading: z.boolean(),
  signIn: z.function()
    .args(z.string(), z.string())
    .returns(z.promise(z.any())),
  signUp: z.function()
    .args(z.string(), z.string(), z.record(z.any()).optional())
    .returns(z.promise(z.any())),
  signOut: z.function()
    .args()
    .returns(z.promise(z.any())),
});

export type AuthContext = z.infer<typeof authContextSchema>;
