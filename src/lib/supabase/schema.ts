import { createClient } from '@supabase/supabase-js';
import { Database } from '../types/supabase';

export type Tables<T extends keyof Database['public']['Tables']> = Database['public']['Tables'][T]['Row'];
export type Enums<T extends keyof Database['public']['Enums']> = Database['public']['Enums'][T];

// Define database schema types
export type DbRole = Tables<'roles'>;
export type DbPermission = Tables<'permissions'>;
export type DbEmployee = Tables<'employees'>;
export type DbModule = Tables<'modules'>;

// SQL for creating roles table
export const createRolesTable = `
CREATE TABLE IF NOT EXISTS public.roles (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name TEXT NOT NULL,
    description TEXT,
    is_predefined BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Add unique constraint on role name
ALTER TABLE public.roles ADD CONSTRAINT roles_name_unique UNIQUE (name);

-- Enable RLS
ALTER TABLE public.roles ENABLE ROW LEVEL SECURITY;

-- Create policies
CREATE POLICY "Allow full access to authenticated users" ON public.roles
    USING (auth.role() = 'authenticated')
    WITH CHECK (auth.role() = 'authenticated');
`;

// SQL for creating modules table
export const createModulesTable = `
CREATE TABLE IF NOT EXISTS public.modules (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name TEXT NOT NULL,
    description TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Add unique constraint on module name
ALTER TABLE public.modules ADD CONSTRAINT modules_name_unique UNIQUE (name);

-- Enable RLS
ALTER TABLE public.modules ENABLE ROW LEVEL SECURITY;

-- Create policies
CREATE POLICY "Allow full access to authenticated users" ON public.modules
    USING (auth.role() = 'authenticated')
    WITH CHECK (auth.role() = 'authenticated');

-- Insert default modules
INSERT INTO public.modules (name, description) VALUES
    ('dashboard', 'Dashboard access'),
    ('customers', 'Customer management'),
    ('sales', 'Sales management'),
    ('invoices', 'Invoice management'),
    ('estimates', 'Estimate management'),
    ('inventory', 'Inventory management'),
    ('production', 'Production management'),
    ('procurement', 'Procurement management'),
    ('employees', 'Employee management'),
    ('roles', 'Role management'),
    ('settings', 'System settings')
ON CONFLICT (name) DO NOTHING;
`;

// SQL for creating permissions table
export const createPermissionsTable = `
CREATE TABLE IF NOT EXISTS public.permissions (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    role_id UUID NOT NULL REFERENCES public.roles(id) ON DELETE CASCADE,
    module_id UUID NOT NULL REFERENCES public.modules(id) ON DELETE CASCADE,
    can_view BOOLEAN DEFAULT FALSE,
    can_create BOOLEAN DEFAULT FALSE,
    can_edit BOOLEAN DEFAULT FALSE,
    can_delete BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    UNIQUE(role_id, module_id)
);

-- Enable RLS
ALTER TABLE public.permissions ENABLE ROW LEVEL SECURITY;

-- Create policies
CREATE POLICY "Allow full access to authenticated users" ON public.permissions
    USING (auth.role() = 'authenticated')
    WITH CHECK (auth.role() = 'authenticated');
`;

// SQL for creating employees table
export const createEmployeesTable = `
CREATE TABLE IF NOT EXISTS public.employees (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
    full_name TEXT NOT NULL,
    email TEXT NOT NULL,
    phone TEXT,
    address TEXT,
    company_id UUID NOT NULL,
    role_id UUID REFERENCES public.roles(id) ON DELETE SET NULL,
    is_admin BOOLEAN DEFAULT FALSE,
    status TEXT DEFAULT 'invited' CHECK (status IN ('active', 'inactive', 'invited')),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Add unique constraint on email within a company
ALTER TABLE public.employees ADD CONSTRAINT employees_email_company_unique UNIQUE (email, company_id);

-- Enable RLS
ALTER TABLE public.employees ENABLE ROW LEVEL SECURITY;

-- Create policies
CREATE POLICY "Allow users to view their own company's employees" ON public.employees
    USING (company_id IN (
        SELECT company_id FROM public.employees WHERE user_id = auth.uid()
    ));

CREATE POLICY "Allow admins to manage their own company's employees" ON public.employees
    USING (company_id IN (
        SELECT company_id FROM public.employees WHERE user_id = auth.uid() AND is_admin = TRUE
    ))
    WITH CHECK (company_id IN (
        SELECT company_id FROM public.employees WHERE user_id = auth.uid() AND is_admin = TRUE
    ));
`;

// SQL for creating companies table
export const createCompaniesTable = `
CREATE TABLE IF NOT EXISTS public.companies (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name TEXT NOT NULL,
    type TEXT NOT NULL CHECK (type IN ('manufacturer', 'distributor', 'both')),
    address TEXT,
    phone TEXT,
    email TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable RLS
ALTER TABLE public.companies ENABLE ROW LEVEL SECURITY;

-- Create policies
CREATE POLICY "Allow users to view their own company" ON public.companies
    USING (id IN (
        SELECT company_id FROM public.employees WHERE user_id = auth.uid()
    ));

CREATE POLICY "Allow admins to manage their own company" ON public.companies
    USING (id IN (
        SELECT company_id FROM public.employees WHERE user_id = auth.uid() AND is_admin = TRUE
    ))
    WITH CHECK (id IN (
        SELECT company_id FROM public.employees WHERE user_id = auth.uid() AND is_admin = TRUE
    ));
`;

// SQL for creating invitations table
export const createInvitationsTable = `
CREATE TABLE IF NOT EXISTS public.invitations (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    email TEXT NOT NULL,
    company_id UUID NOT NULL REFERENCES public.companies(id) ON DELETE CASCADE,
    role_id UUID REFERENCES public.roles(id) ON DELETE SET NULL,
    invited_by UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    token TEXT NOT NULL,
    expires_at TIMESTAMP WITH TIME ZONE NOT NULL,
    status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'accepted', 'expired')),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Add unique constraint on token
ALTER TABLE public.invitations ADD CONSTRAINT invitations_token_unique UNIQUE (token);

-- Enable RLS
ALTER TABLE public.invitations ENABLE ROW LEVEL SECURITY;

-- Create policies
CREATE POLICY "Allow users to view invitations for their company" ON public.invitations
    USING (company_id IN (
        SELECT company_id FROM public.employees WHERE user_id = auth.uid()
    ));

CREATE POLICY "Allow admins to manage invitations for their company" ON public.invitations
    USING (company_id IN (
        SELECT company_id FROM public.employees WHERE user_id = auth.uid() AND is_admin = TRUE
    ))
    WITH CHECK (company_id IN (
        SELECT company_id FROM public.employees WHERE user_id = auth.uid() AND is_admin = TRUE
    ));
`;

// Function to insert predefined roles
export const insertPredefinedRoles = `
-- Function to insert predefined roles and their permissions
CREATE OR REPLACE FUNCTION insert_predefined_roles()
RETURNS VOID AS $$
DECLARE
    role_id UUID;
    module_id UUID;
    admin_role_id UUID;
BEGIN
    -- Insert Admin role
    INSERT INTO public.roles (name, description, is_predefined)
    VALUES ('Admin', 'Administrator with full access', TRUE)
    ON CONFLICT (name) DO UPDATE SET description = EXCLUDED.description, is_predefined = EXCLUDED.is_predefined
    RETURNING id INTO admin_role_id;
    
    -- Give Admin role full permissions on all modules
    FOR module_id IN SELECT id FROM public.modules LOOP
        INSERT INTO public.permissions (role_id, module_id, can_view, can_create, can_edit, can_delete)
        VALUES (admin_role_id, module_id, TRUE, TRUE, TRUE, TRUE)
        ON CONFLICT (role_id, module_id) DO UPDATE SET 
            can_view = EXCLUDED.can_view,
            can_create = EXCLUDED.can_create,
            can_edit = EXCLUDED.can_edit,
            can_delete = EXCLUDED.can_delete;
    END LOOP;
    
    -- Insert Sales Supervisor role
    INSERT INTO public.roles (name, description, is_predefined)
    VALUES ('Sales Supervisor', 'Manages sales team and has access to all sales functions', TRUE)
    ON CONFLICT (name) DO UPDATE SET description = EXCLUDED.description, is_predefined = EXCLUDED.is_predefined
    RETURNING id INTO role_id;
    
    -- Set Sales Supervisor permissions
    FOR module_id IN SELECT id FROM public.modules WHERE name IN ('dashboard', 'customers', 'sales', 'invoices', 'estimates') LOOP
        INSERT INTO public.permissions (role_id, module_id, can_view, can_create, can_edit, can_delete)
        VALUES (role_id, module_id, TRUE, TRUE, TRUE, TRUE)
        ON CONFLICT (role_id, module_id) DO UPDATE SET 
            can_view = EXCLUDED.can_view,
            can_create = EXCLUDED.can_create,
            can_edit = EXCLUDED.can_edit,
            can_delete = EXCLUDED.can_delete;
    END LOOP;
    
    -- Insert Sales Rep role
    INSERT INTO public.roles (name, description, is_predefined)
    VALUES ('Sales Rep', 'Can create and manage sales documents', TRUE)
    ON CONFLICT (name) DO UPDATE SET description = EXCLUDED.description, is_predefined = EXCLUDED.is_predefined
    RETURNING id INTO role_id;
    
    -- Set Sales Rep permissions
    FOR module_id IN SELECT id FROM public.modules WHERE name IN ('dashboard', 'customers', 'sales', 'invoices', 'estimates') LOOP
        INSERT INTO public.permissions (role_id, module_id, can_view, can_create, can_edit, can_delete)
        VALUES (role_id, module_id, TRUE, TRUE, TRUE, FALSE)
        ON CONFLICT (role_id, module_id) DO UPDATE SET 
            can_view = EXCLUDED.can_view,
            can_create = EXCLUDED.can_create,
            can_edit = EXCLUDED.can_edit,
            can_delete = EXCLUDED.can_delete;
    END LOOP;
    
    -- Insert other predefined roles with basic permissions
    DECLARE
        role_names TEXT[] := ARRAY['Procurement Supervisor', 'Procurement Rep', 'Production Supervisor', 
                                  'Machine Operator', 'Packaging Supervisor', 'Packaging Person', 
                                  'Transport Supervisor', 'Transport Person', 'Store Supervisor', 
                                  'Store Person', 'HR Supervisor'];
        role_desc TEXT[] := ARRAY['Manages procurement team and has access to all procurement functions',
                                 'Can create and manage procurement documents',
                                 'Manages production team and has access to all production functions',
                                 'Operates machines in the production process',
                                 'Manages packaging team and has access to all packaging functions',
                                 'Handles packaging operations',
                                 'Manages transport team and has access to all transport functions',
                                 'Handles transport operations',
                                 'Manages store team and has access to all store functions',
                                 'Handles store operations',
                                 'Manages HR team and has access to all HR functions'];
        i INTEGER;
    BEGIN
        FOR i IN 1..array_length(role_names, 1) LOOP
            -- Insert role
            INSERT INTO public.roles (name, description, is_predefined)
            VALUES (role_names[i], role_desc[i], TRUE)
            ON CONFLICT (name) DO UPDATE SET description = EXCLUDED.description, is_predefined = EXCLUDED.is_predefined
            RETURNING id INTO role_id;
            
            -- Set basic permissions (view dashboard)
            INSERT INTO public.permissions (role_id, module_id, can_view, can_create, can_edit, can_delete)
            SELECT role_id, id, TRUE, FALSE, FALSE, FALSE
            FROM public.modules 
            WHERE name = 'dashboard'
            ON CONFLICT (role_id, module_id) DO UPDATE SET 
                can_view = EXCLUDED.can_view,
                can_create = EXCLUDED.can_create,
                can_edit = EXCLUDED.can_edit,
                can_delete = EXCLUDED.can_delete;
        END LOOP;
    END;
END;
$$ LANGUAGE plpgsql;

-- Execute the function
SELECT insert_predefined_roles();
`;
