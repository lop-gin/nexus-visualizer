(globalThis.TURBOPACK = globalThis.TURBOPACK || []).push(["static/chunks/src_918f7014._.js", {

"[project]/src/providers/theme-provider.tsx [app-client] (ecmascript)": ((__turbopack_context__) => {
"use strict";

var { g: global, __dirname, k: __turbopack_refresh__, m: module } = __turbopack_context__;
{
__turbopack_context__.s({
    "ThemeProvider": (()=>ThemeProvider)
});
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/jsx-dev-runtime.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2d$themes$2f$dist$2f$index$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next-themes/dist/index.mjs [app-client] (ecmascript)");
'use client';
;
;
function ThemeProvider({ children, ...props }) {
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2d$themes$2f$dist$2f$index$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["ThemeProvider"], {
        attribute: "class",
        defaultTheme: "system",
        enableSystem: true,
        ...props,
        children: children
    }, void 0, false, {
        fileName: "[project]/src/providers/theme-provider.tsx",
        lineNumber: 9,
        columnNumber: 5
    }, this);
}
_c = ThemeProvider;
var _c;
__turbopack_context__.k.register(_c, "ThemeProvider");
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(module, globalThis.$RefreshHelpers$);
}
}}),
"[project]/src/lib/supabase/client.ts [app-client] (ecmascript)": ((__turbopack_context__) => {
"use strict";

var { g: global, __dirname, k: __turbopack_refresh__, m: module } = __turbopack_context__;
{
__turbopack_context__.s({
    "checkSupabaseConnection": (()=>checkSupabaseConnection),
    "getSupabaseConfig": (()=>getSupabaseConfig),
    "supabase": (()=>supabase)
});
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$build$2f$polyfills$2f$process$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/build/polyfills/process.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$supabase$2f$supabase$2d$js$2f$dist$2f$module$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$locals$3e$__ = __turbopack_context__.i("[project]/node_modules/@supabase/supabase-js/dist/module/index.js [app-client] (ecmascript) <locals>");
;
// Environment variables for Supabase connection
// These can be overridden by environment variables in production
const supabaseUrl = ("TURBOPACK compile-time value", "https://aoyaamulrgpdidzpotty.supabase.co") || 'https://aoyaamulrgpdidzpotty.supabase.co';
const supabaseAnonKey = ("TURBOPACK compile-time value", "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImFveWFhbXVscmdwZGlkenBvdHR5Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDI5OTU1MjYsImV4cCI6MjA1ODU3MTUyNn0.9DhaZQEjOZ5gPXfq14Kz2QdPoVwh-BBd6-Ho-I7TmLM") || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImFveWFhbXVscmdwZGlkenBvdHR5Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDI5OTU1MjYsImV4cCI6MjA1ODU3MTUyNn0.9DhaZQEjOZ5gPXfq14Kz2QdPoVwh-BBd6-Ho-I7TmLM';
const supabase = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$supabase$2f$supabase$2d$js$2f$dist$2f$module$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$locals$3e$__["createClient"])(supabaseUrl, supabaseAnonKey);
async function checkSupabaseConnection() {
    try {
        const { data, error } = await supabase.from('roles').select('count').single();
        if (error) throw error;
        return {
            success: true,
            message: 'Connected to Supabase successfully'
        };
    } catch (error) {
        console.error('Supabase connection error:', error);
        return {
            success: false,
            message: error.message || 'Failed to connect to Supabase'
        };
    }
}
function getSupabaseConfig() {
    return {
        url: supabaseUrl,
        key: supabaseAnonKey
    };
}
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(module, globalThis.$RefreshHelpers$);
}
}}),
"[project]/src/lib/supabase/migrations.ts [app-client] (ecmascript)": ((__turbopack_context__) => {
"use strict";

var { g: global, __dirname, k: __turbopack_refresh__, m: module } = __turbopack_context__;
{
__turbopack_context__.s({
    "createCompanyAndAdmin": (()=>createCompanyAndAdmin),
    "executeMigrations": (()=>executeMigrations),
    "initializeDatabase": (()=>initializeDatabase),
    "isDatabaseInitialized": (()=>isDatabaseInitialized)
});
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$supabase$2f$client$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/lib/supabase/client.ts [app-client] (ecmascript)");
;
async function executeMigrations() {
    try {
        // Read the SQL file content
        const sqlContent = `
-- Create extension for UUID generation
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Create companies table
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

-- Create roles table
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

-- Create modules table
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

-- Create permissions table
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

-- Create employees table
CREATE TABLE IF NOT EXISTS public.employees (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
    full_name TEXT NOT NULL,
    email TEXT NOT NULL,
    phone TEXT,
    address TEXT,
    company_id UUID NOT NULL REFERENCES public.companies(id) ON DELETE CASCADE,
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

-- Create invitations table
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

-- Function to insert predefined roles
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
        // Execute the SQL
        const { error } = await __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$supabase$2f$client$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["supabase"].rpc('exec_sql', {
            sql: sqlContent
        });
        if (error) {
            console.error('Error executing migrations:', error);
            return {
                success: false,
                error: error.message
            };
        }
        return {
            success: true
        };
    } catch (error) {
        console.error('Error in executeMigrations:', error);
        return {
            success: false,
            error: error.message
        };
    }
}
async function createCompanyAndAdmin(userId, companyName, companyType, fullName, email, phone, address) {
    try {
        // Create company
        const { data: company, error: companyError } = await __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$supabase$2f$client$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["supabase"].from('companies').insert({
            name: companyName,
            type: companyType,
            phone,
            email,
            address
        }).select().single();
        if (companyError) {
            console.error('Error creating company:', companyError);
            throw new Error('Failed to create company');
        }
        // Get Admin role
        const { data: adminRole, error: roleError } = await __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$supabase$2f$client$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["supabase"].from('roles').select('id').eq('name', 'Admin').single();
        if (roleError) {
            console.error('Error fetching admin role:', roleError);
            throw new Error('Failed to fetch admin role');
        }
        // Create employee record for admin
        const { data: employee, error: employeeError } = await __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$supabase$2f$client$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["supabase"].from('employees').insert({
            user_id: userId,
            full_name: fullName,
            email,
            phone,
            address,
            company_id: company.id,
            role_id: adminRole.id,
            is_admin: true,
            status: 'active'
        }).select().single();
        if (employeeError) {
            console.error('Error creating employee:', employeeError);
            throw new Error('Failed to create employee record');
        }
        return {
            company,
            employee
        };
    } catch (error) {
        console.error('Error in createCompanyAndAdmin:', error);
        throw error;
    }
}
async function isDatabaseInitialized() {
    try {
        // Check if companies table exists
        const { count, error } = await __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$supabase$2f$client$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["supabase"].from('companies').select('*', {
            count: 'exact',
            head: true
        });
        if (error && error.code === '42P01') {
            return false;
        } else if (error) {
            console.error('Error checking database:', error);
            throw error;
        }
        return true;
    } catch (error) {
        console.error('Error in isDatabaseInitialized:', error);
        return false;
    }
}
async function initializeDatabase() {
    try {
        const isInitialized = await isDatabaseInitialized();
        if (!isInitialized) {
            const result = await executeMigrations();
            return result;
        }
        return {
            success: true,
            message: 'Database already initialized'
        };
    } catch (error) {
        console.error('Error initializing database:', error);
        return {
            success: false,
            error: error.message
        };
    }
}
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(module, globalThis.$RefreshHelpers$);
}
}}),
"[project]/src/providers/auth-provider.tsx [app-client] (ecmascript)": ((__turbopack_context__) => {
"use strict";

var { g: global, __dirname, k: __turbopack_refresh__, m: module } = __turbopack_context__;
{
__turbopack_context__.s({
    "AuthProvider": (()=>AuthProvider),
    "useAuth": (()=>useAuth)
});
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/jsx-dev-runtime.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/index.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$supabase$2f$auth$2d$helpers$2d$nextjs$2f$dist$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/@supabase/auth-helpers-nextjs/dist/index.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$navigation$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/navigation.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$supabase$2f$migrations$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/lib/supabase/migrations.ts [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2d$hot$2d$toast$2f$dist$2f$index$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/react-hot-toast/dist/index.mjs [app-client] (ecmascript)");
;
var _s = __turbopack_context__.k.signature(), _s1 = __turbopack_context__.k.signature();
'use client';
;
;
;
;
;
const AuthContext = /*#__PURE__*/ __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"].createContext(undefined);
function AuthProvider({ children }) {
    _s();
    const supabase = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$supabase$2f$auth$2d$helpers$2d$nextjs$2f$dist$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["createClientComponentClient"])();
    const router = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$navigation$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useRouter"])();
    const [user, setUser] = __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"].useState(null);
    const [isLoading, setIsLoading] = __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"].useState(true);
    // Check for session on mount
    __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"].useEffect({
        "AuthProvider.useEffect": ()=>{
            const getSession = {
                "AuthProvider.useEffect.getSession": async ()=>{
                    const { data: { session } } = await supabase.auth.getSession();
                    setUser(session?.user || null);
                    setIsLoading(false);
                    // Set up auth state listener
                    const { data: { subscription } } = await supabase.auth.onAuthStateChange({
                        "AuthProvider.useEffect.getSession": (_event, session)=>{
                            setUser(session?.user || null);
                        }
                    }["AuthProvider.useEffect.getSession"]);
                    return ({
                        "AuthProvider.useEffect.getSession": ()=>{
                            subscription.unsubscribe();
                        }
                    })["AuthProvider.useEffect.getSession"];
                }
            }["AuthProvider.useEffect.getSession"];
            getSession();
        }
    }["AuthProvider.useEffect"], [
        supabase.auth
    ]);
    // Sign up with email and password
    const signUp = async (email, password, companyName, companyType, fullName)=>{
        try {
            setIsLoading(true);
            // Create user in Supabase Auth
            const { data, error } = await supabase.auth.signUp({
                email,
                password
            });
            if (error) {
                throw error;
            }
            if (data.user) {
                // Create company and admin record
                await (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$supabase$2f$migrations$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["createCompanyAndAdmin"])(data.user.id, companyName, companyType, fullName, email);
                __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2d$hot$2d$toast$2f$dist$2f$index$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"].success('Account created successfully! Please check your email for verification.');
                router.push('/auth/login');
            }
        } catch (error) {
            console.error('Error signing up:', error);
            __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2d$hot$2d$toast$2f$dist$2f$index$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"].error(error.message || 'Failed to sign up');
        } finally{
            setIsLoading(false);
        }
    };
    // Sign in with email and password
    const signIn = async (email, password)=>{
        try {
            setIsLoading(true);
            const { data, error } = await supabase.auth.signInWithPassword({
                email,
                password
            });
            if (error) {
                throw error;
            }
            if (data.user) {
                __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2d$hot$2d$toast$2f$dist$2f$index$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"].success('Signed in successfully!');
                router.push('/dashboard');
            }
        } catch (error) {
            console.error('Error signing in:', error);
            __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2d$hot$2d$toast$2f$dist$2f$index$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"].error(error.message || 'Failed to sign in');
        } finally{
            setIsLoading(false);
        }
    };
    // Sign out
    const signOut = async ()=>{
        try {
            setIsLoading(true);
            const { error } = await supabase.auth.signOut();
            if (error) {
                throw error;
            }
            __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2d$hot$2d$toast$2f$dist$2f$index$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"].success('Signed out successfully');
            router.push('/');
        } catch (error) {
            console.error('Error signing out:', error);
            __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2d$hot$2d$toast$2f$dist$2f$index$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"].error(error.message || 'Failed to sign out');
        } finally{
            setIsLoading(false);
        }
    };
    // Forgot password
    const forgotPassword = async (email)=>{
        try {
            setIsLoading(true);
            const { error } = await supabase.auth.resetPasswordForEmail(email, {
                redirectTo: `${window.location.origin}/auth/reset-password`
            });
            if (error) {
                throw error;
            }
            __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2d$hot$2d$toast$2f$dist$2f$index$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"].success('Password reset email sent. Please check your inbox.');
        } catch (error) {
            console.error('Error resetting password:', error);
            __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2d$hot$2d$toast$2f$dist$2f$index$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"].error(error.message || 'Failed to send password reset email');
        } finally{
            setIsLoading(false);
        }
    };
    // Reset password
    const resetPassword = async (password)=>{
        try {
            setIsLoading(true);
            const { error } = await supabase.auth.updateUser({
                password
            });
            if (error) {
                throw error;
            }
            __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2d$hot$2d$toast$2f$dist$2f$index$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"].success('Password updated successfully');
            router.push('/auth/login');
        } catch (error) {
            console.error('Error updating password:', error);
            __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2d$hot$2d$toast$2f$dist$2f$index$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"].error(error.message || 'Failed to update password');
        } finally{
            setIsLoading(false);
        }
    };
    const value = {
        user,
        isLoading,
        signUp,
        signIn,
        signOut,
        forgotPassword,
        resetPassword
    };
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(AuthContext.Provider, {
        value: value,
        children: children
    }, void 0, false, {
        fileName: "[project]/src/providers/auth-provider.tsx",
        lineNumber: 194,
        columnNumber: 10
    }, this);
}
_s(AuthProvider, "tZTulkvxNCIy72YUhaDqXHUCOtk=", false, function() {
    return [
        __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$navigation$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useRouter"]
    ];
});
_c = AuthProvider;
function useAuth() {
    _s1();
    const context = __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"].useContext(AuthContext);
    if (context === undefined) {
        throw new Error('useAuth must be used within an AuthProvider');
    }
    return context;
}
_s1(useAuth, "b9L3QQ+jgeyIrH0NfHrJ8nn7VMU=");
var _c;
__turbopack_context__.k.register(_c, "AuthProvider");
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(module, globalThis.$RefreshHelpers$);
}
}}),
"[project]/src/app/layout.tsx [app-client] (ecmascript)": ((__turbopack_context__) => {
"use strict";

var { g: global, __dirname, k: __turbopack_refresh__, m: module } = __turbopack_context__;
{
__turbopack_context__.s({
    "default": (()=>RootLayout)
});
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/jsx-dev-runtime.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$providers$2f$theme$2d$provider$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/providers/theme-provider.tsx [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2d$hot$2d$toast$2f$dist$2f$index$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/react-hot-toast/dist/index.mjs [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$providers$2f$auth$2d$provider$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/providers/auth-provider.tsx [app-client] (ecmascript)");
'use client';
;
;
;
;
function RootLayout({ children }) {
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("html", {
        lang: "en",
        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("body", {
            children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$providers$2f$theme$2d$provider$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["ThemeProvider"], {
                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$providers$2f$auth$2d$provider$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["AuthProvider"], {
                    children: [
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("main", {
                            children: children
                        }, void 0, false, {
                            fileName: "[project]/src/app/layout.tsx",
                            lineNumber: 17,
                            columnNumber: 13
                        }, this),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2d$hot$2d$toast$2f$dist$2f$index$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Toaster"], {
                            position: "top-right"
                        }, void 0, false, {
                            fileName: "[project]/src/app/layout.tsx",
                            lineNumber: 18,
                            columnNumber: 13
                        }, this)
                    ]
                }, void 0, true, {
                    fileName: "[project]/src/app/layout.tsx",
                    lineNumber: 16,
                    columnNumber: 11
                }, this)
            }, void 0, false, {
                fileName: "[project]/src/app/layout.tsx",
                lineNumber: 15,
                columnNumber: 9
            }, this)
        }, void 0, false, {
            fileName: "[project]/src/app/layout.tsx",
            lineNumber: 14,
            columnNumber: 7
        }, this)
    }, void 0, false, {
        fileName: "[project]/src/app/layout.tsx",
        lineNumber: 13,
        columnNumber: 5
    }, this);
}
_c = RootLayout;
var _c;
__turbopack_context__.k.register(_c, "RootLayout");
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(module, globalThis.$RefreshHelpers$);
}
}}),
}]);

//# sourceMappingURL=src_918f7014._.js.map