-- Updated database schema based on user feedback

-- ENUM Types for consistent status values
CREATE TYPE payment_status AS ENUM ('due', 'overdue', 'paid', 'not_due');
CREATE TYPE transaction_type AS ENUM ('invoice', 'sale_receipt', 'credit_note', 'refund_receipt', 'estimate');

-- Companies Table
CREATE TABLE companies (
    id SERIAL PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    address TEXT,
    phone VARCHAR(50),
    email VARCHAR(100),
    tax_id VARCHAR(50),
    type VARCHAR(20) NOT NULL CHECK (type IN ('manufacturer', 'distributor', 'both')),
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Users Table (Updated with created_by and updated_by)
CREATE TABLE users (
    id SERIAL PRIMARY KEY,
    company_id INTEGER NOT NULL REFERENCES companies(id),
    name VARCHAR(100) NOT NULL,
    email VARCHAR(100) NOT NULL UNIQUE,
    password_hash TEXT NOT NULL,
    role VARCHAR(50) NOT NULL,
    is_active BOOLEAN DEFAULT TRUE,
    created_by INTEGER REFERENCES users(id),
    updated_by INTEGER REFERENCES users(id),
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);
CREATE INDEX idx_users_company ON users(company_id);

-- Customers Table (Updated with initial_balance)
CREATE TABLE customers (
    id SERIAL PRIMARY KEY,
    company_id INTEGER NOT NULL REFERENCES companies(id),
    name VARCHAR(100) NOT NULL,
    company VARCHAR(100),
    email VARCHAR(100),
    billing_address TEXT,
    initial_balance DECIMAL(12,2) DEFAULT 0,
    created_by INTEGER NOT NULL REFERENCES users(id),
    updated_by INTEGER NOT NULL REFERENCES users(id),
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);
CREATE INDEX idx_customers_company ON customers(company_id);
CREATE INDEX idx_customers_email ON customers(email);

-- Sales Representatives Table
CREATE TABLE sales_reps (
    id SERIAL PRIMARY KEY,
    company_id INTEGER NOT NULL REFERENCES companies(id),
    name VARCHAR(100) NOT NULL,
    email VARCHAR(100),
    created_by INTEGER NOT NULL REFERENCES users(id),
    updated_by INTEGER NOT NULL REFERENCES users(id),
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);
CREATE INDEX idx_sales_reps_company ON sales_reps(company_id);

-- Product Categories Table
CREATE TABLE categories (
    id SERIAL PRIMARY KEY,
    company_id INTEGER NOT NULL REFERENCES companies(id),
    name VARCHAR(100) NOT NULL,
    description TEXT,
    created_by INTEGER NOT NULL REFERENCES users(id),
    updated_by INTEGER NOT NULL REFERENCES users(id),
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);
CREATE INDEX idx_categories_company ON categories(company_id);

-- Products Table (Updated with primary/secondary unit of measure and conversion factor)
CREATE TABLE products (
    id SERIAL PRIMARY KEY,
    company_id INTEGER NOT NULL REFERENCES companies(id),
    category_id INTEGER REFERENCES categories(id),
    name VARCHAR(100) NOT NULL,
    description TEXT,
    default_unit_price DECIMAL(12,2),
    primary_unit_of_measure VARCHAR(20) NOT NULL, -- Smallest unit (e.g., piece, gram)
    secondary_unit_of_measure VARCHAR(20), -- Larger unit (e.g., dozen, kilogram)
    conversion_factor DECIMAL(12,3), -- How many primary units make one secondary unit
    default_tax_percent DECIMAL(5,2),
    created_by INTEGER NOT NULL REFERENCES users(id),
    updated_by INTEGER NOT NULL REFERENCES users(id),
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);
CREATE INDEX idx_products_company ON products(company_id);
CREATE INDEX idx_products_category ON products(category_id);

-- Transactions Table (Header table for all financial documents)
CREATE TABLE transactions (
    id SERIAL PRIMARY KEY,
    company_id INTEGER NOT NULL REFERENCES companies(id),
    transaction_number VARCHAR(20) NOT NULL,
    transaction_type transaction_type NOT NULL,
    customer_id INTEGER NOT NULL REFERENCES customers(id),
    sales_rep_id INTEGER REFERENCES sales_reps(id),
    transaction_date DATE NOT NULL,
    due_date DATE,
    expiration_date DATE,
    terms VARCHAR(50),
    status payment_status DEFAULT 'due',
    message TEXT,
    net_total DECIMAL(12,2) NOT NULL DEFAULT 0,
    tax_total DECIMAL(12,2) NOT NULL DEFAULT 0,
    other_fees DECIMAL(12,2) NOT NULL DEFAULT 0,
    gross_total DECIMAL(12,2) NOT NULL DEFAULT 0,
    parent_transaction_id INTEGER REFERENCES transactions(id), -- For credit notes/refunds linked to invoices
    created_by INTEGER NOT NULL REFERENCES users(id),
    updated_by INTEGER NOT NULL REFERENCES users(id),
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);
CREATE INDEX idx_transactions_company ON transactions(company_id);
CREATE INDEX idx_transactions_customer ON transactions(customer_id);
CREATE INDEX idx_transactions_date ON transactions(transaction_date);
CREATE INDEX idx_transactions_type ON transactions(transaction_type);
CREATE INDEX idx_transactions_status ON transactions(status);
CREATE INDEX idx_transactions_parent ON transactions(parent_transaction_id);
CREATE UNIQUE INDEX idx_transaction_number_company ON transactions(company_id, transaction_number);

-- Transaction Line Items
CREATE TABLE transaction_items (
    id SERIAL PRIMARY KEY,
    transaction_id INTEGER NOT NULL REFERENCES transactions(id) ON DELETE CASCADE,
    product_id INTEGER REFERENCES products(id),
    description TEXT,
    quantity DECIMAL(12,3) NOT NULL,
    unit_of_measure VARCHAR(20) NOT NULL,
    unit_price DECIMAL(12,2) NOT NULL,
    tax_percent DECIMAL(5,2) NOT NULL,
    amount DECIMAL(12,2) NOT NULL, -- (quantity * unit_price)
    created_by INTEGER NOT NULL REFERENCES users(id),
    updated_by INTEGER NOT NULL REFERENCES users(id),
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);
CREATE INDEX idx_transaction_items_transaction ON transaction_items(transaction_id);
CREATE INDEX idx_transaction_items_product ON transaction_items(product_id);

-- Payments Table
CREATE TABLE payments (
    id SERIAL PRIMARY KEY,
    company_id INTEGER NOT NULL REFERENCES companies(id),
    payment_number VARCHAR(20) NOT NULL,
    customer_id INTEGER NOT NULL REFERENCES customers(id),
    payment_date DATE NOT NULL,
    amount_received DECIMAL(12,2) NOT NULL,
    amount_to_credit DECIMAL(12,2) DEFAULT 0,
    message TEXT,
    created_by INTEGER NOT NULL REFERENCES users(id),
    updated_by INTEGER NOT NULL REFERENCES users(id),
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);
CREATE INDEX idx_payments_company ON payments(company_id);
CREATE INDEX idx_payments_customer ON payments(customer_id);
CREATE INDEX idx_payments_date ON payments(payment_date);
CREATE UNIQUE INDEX idx_payment_number_company ON payments(company_id, payment_number);

-- Payment Allocations (links payments to specific invoices)
CREATE TABLE payment_allocations (
    id SERIAL PRIMARY KEY,
    payment_id INTEGER NOT NULL REFERENCES payments(id) ON DELETE CASCADE,
    transaction_id INTEGER NOT NULL REFERENCES transactions(id),
    amount DECIMAL(12,2) NOT NULL,
    created_by INTEGER NOT NULL REFERENCES users(id),
    updated_by INTEGER NOT NULL REFERENCES users(id),
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);
CREATE INDEX idx_payment_allocations_payment ON payment_allocations(payment_id);
CREATE INDEX idx_payment_allocations_transaction ON payment_allocations(transaction_id);

-- Activity Log Table for recent activities
CREATE TABLE activity_log (
    id SERIAL PRIMARY KEY,
    company_id INTEGER NOT NULL REFERENCES companies(id),
    user_id INTEGER NOT NULL REFERENCES users(id),
    activity_type VARCHAR(50) NOT NULL,
    entity_type VARCHAR(50) NOT NULL,
    entity_id INTEGER NOT NULL, 
    description TEXT NOT NULL,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);
CREATE INDEX idx_activity_log_company ON activity_log(company_id);
CREATE INDEX idx_activity_log_user ON activity_log(user_id);
CREATE INDEX idx_activity_log_type ON activity_log(activity_type);
CREATE INDEX idx_activity_log_entity ON activity_log(entity_type, entity_id);
CREATE INDEX idx_activity_log_created ON activity_log(created_at);

-- Roles Table
CREATE TABLE roles (
    id SERIAL PRIMARY KEY,
    company_id INTEGER NOT NULL REFERENCES companies(id),
    name VARCHAR(100) NOT NULL,
    description TEXT,
    is_predefined BOOLEAN NOT NULL DEFAULT FALSE,
    created_by INTEGER NOT NULL REFERENCES users(id),
    updated_by INTEGER NOT NULL REFERENCES users(id),
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    UNIQUE(company_id, name)
);
CREATE INDEX idx_roles_company ON roles(company_id);

-- Modules Table
CREATE TABLE modules (
    id SERIAL PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    description TEXT,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    UNIQUE(name)
);

-- Permissions Table
CREATE TABLE permissions (
    id SERIAL PRIMARY KEY,
    role_id INTEGER NOT NULL REFERENCES roles(id) ON DELETE CASCADE,
    module_id INTEGER NOT NULL REFERENCES modules(id),
    can_view BOOLEAN NOT NULL DEFAULT FALSE,
    can_create BOOLEAN NOT NULL DEFAULT FALSE,
    can_edit BOOLEAN NOT NULL DEFAULT FALSE,
    can_delete BOOLEAN NOT NULL DEFAULT FALSE,
    created_by INTEGER NOT NULL REFERENCES users(id),
    updated_by INTEGER NOT NULL REFERENCES users(id),
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    UNIQUE(role_id, module_id)
);
CREATE INDEX idx_permissions_role ON permissions(role_id);
CREATE INDEX idx_permissions_module ON permissions(module_id);

-- Employees Table
CREATE TABLE employees (
    id SERIAL PRIMARY KEY,
    company_id INTEGER NOT NULL REFERENCES companies(id),
    user_id INTEGER UNIQUE REFERENCES users(id),
    role_id INTEGER NOT NULL REFERENCES roles(id),
    full_name VARCHAR(100) NOT NULL,
    email VARCHAR(100) NOT NULL,
    phone VARCHAR(50),
    is_admin BOOLEAN NOT NULL DEFAULT FALSE,
    invitation_sent BOOLEAN NOT NULL DEFAULT FALSE,
    invitation_token TEXT,
    invitation_expires_at TIMESTAMPTZ,
    created_by INTEGER NOT NULL REFERENCES users(id),
    updated_by INTEGER NOT NULL REFERENCES users(id),
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    UNIQUE(company_id, email)
);
CREATE INDEX idx_employees_company ON employees(company_id);
CREATE INDEX idx_employees_role ON employees(role_id);
CREATE INDEX idx_employees_user ON employees(user_id);

-- Session Variables Setup Function
CREATE OR REPLACE FUNCTION set_app_variables(p_user_id INTEGER, p_company_id INTEGER)
RETURNS VOID AS $$
BEGIN
    PERFORM set_config('app.current_user_id', p_user_id::text, false);
    PERFORM set_config('app.current_company_id', p_company_id::text, false);
END;
$$ LANGUAGE plpgsql;

-- Triggers for updated_at and updated_by timestamps
CREATE OR REPLACE FUNCTION update_modified_column()
RETURNS TRIGGER AS $$
BEGIN
   NEW.updated_at = NOW();
   NEW.updated_by = current_setting('app.current_user_id')::integer;
   RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Apply the trigger to all tables with updated_at and updated_by
CREATE TRIGGER update_companies_modtime
    BEFORE UPDATE ON companies
    FOR EACH ROW EXECUTE FUNCTION update_modified_column();

CREATE TRIGGER update_users_modtime
    BEFORE UPDATE ON users
    FOR EACH ROW EXECUTE FUNCTION update_modified_column();

CREATE TRIGGER update_customers_modtime
    BEFORE UPDATE ON customers
    FOR EACH ROW EXECUTE FUNCTION update_modified_column();

CREATE TRIGGER update_sales_reps_modtime
    BEFORE UPDATE ON sales_reps
    FOR EACH ROW EXECUTE FUNCTION update_modified_column();

CREATE TRIGGER update_categories_modtime
    BEFORE UPDATE ON categories
    FOR EACH ROW EXECUTE FUNCTION update_modified_column();

CREATE TRIGGER update_products_modtime
    BEFORE UPDATE ON products
    FOR EACH ROW EXECUTE FUNCTION update_modified_column();

CREATE TRIGGER update_transactions_modtime
    BEFORE UPDATE ON transactions
    FOR EACH ROW EXECUTE FUNCTION update_modified_column();

CREATE TRIGGER update_transaction_items_modtime
    BEFORE UPDATE ON transaction_items
    FOR EACH ROW EXECUTE FUNCTION update_modified_column();

CREATE TRIGGER update_payments_modtime
    BEFORE UPDATE ON payments
    FOR EACH ROW EXECUTE FUNCTION update_modified_column();

CREATE TRIGGER update_payment_allocations_modtime
    BEFORE UPDATE ON payment_allocations
    FOR EACH ROW EXECUTE FUNCTION update_modified_column();

CREATE TRIGGER update_roles_modtime
    BEFORE UPDATE ON roles
    FOR EACH ROW EXECUTE FUNCTION update_modified_column();

CREATE TRIGGER update_permissions_modtime
    BEFORE UPDATE ON permissions
    FOR EACH ROW EXECUTE FUNCTION update_modified_column();

CREATE TRIGGER update_employees_modtime
    BEFORE UPDATE ON employees
    FOR EACH ROW EXECUTE FUNCTION update_modified_column();

-- Row Level Security (RLS) policies for multi-tenant data isolation
ALTER TABLE companies ENABLE ROW LEVEL SECURITY;
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE customers ENABLE ROW LEVEL SECURITY;
ALTER TABLE sales_reps ENABLE ROW LEVEL SECURITY;
ALTER TABLE categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE products ENABLE ROW LEVEL SECURITY;
ALTER TABLE transactions ENABLE ROW LEVEL SECURITY;
ALTER TABLE transaction_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE payments ENABLE ROW LEVEL SECURITY;
ALTER TABLE payment_allocations ENABLE ROW LEVEL SECURITY;
ALTER TABLE activity_log ENABLE ROW LEVEL SECURITY;
ALTER TABLE roles ENABLE ROW LEVEL SECURITY;
ALTER TABLE permissions ENABLE ROW LEVEL SECURITY;
ALTER TABLE employees ENABLE ROW LEVEL SECURITY;

-- Create policies for each table to ensure users can only access their company's data
CREATE POLICY company_isolation ON companies
    USING (id = current_setting('app.current_company_id')::integer);

CREATE POLICY user_isolation ON users
    USING (company_id = current_setting('app.current_company_id')::integer);

CREATE POLICY customer_isolation ON customers
    USING (company_id = current_setting('app.current_company_id')::integer);

CREATE POLICY sales_rep_isolation ON sales_reps
    USING (company_id = current_setting('app.current_company_id')::integer);

CREATE POLICY category_isolation ON categories
    USING (company_id = current_setting('app.current_company_id')::integer);

CREATE POLICY product_isolation ON products
    USING (company_id = current_setting('app.current_company_id')::integer);

CREATE POLICY transaction_isolation ON transactions
    USING (company_id = current_setting('app.current_company_id')::integer);

CREATE POLICY transaction_item_isolation ON transaction_items
    USING (transaction_id IN (
        SELECT id FROM transactions 
        WHERE company_id = current_setting('app.current_company_id')::integer
    ));

CREATE POLICY payment_isolation ON payments
    USING (company_id = current_setting('app.current_company_id')::integer);

CREATE POLICY payment_allocation_isolation ON payment_allocations
    USING (payment_id IN (
        SELECT id FROM payments 
        WHERE company_id = current_setting('app.current_company_id')::integer
    ));

CREATE POLICY activity_log_isolation ON activity_log
    USING (company_id = current_setting('app.current_company_id')::integer);

CREATE POLICY role_isolation ON roles
    USING (company_id = current_setting('app.current_company_id')::integer);

CREATE POLICY permission_isolation ON permissions
    USING (role_id IN (
        SELECT id FROM roles 
        WHERE company_id = current_setting('app.current_company_id')::integer
    ));

CREATE POLICY employee_isolation ON employees
    USING (company_id = current_setting('app.current_company_id')::integer);

-- Insert predefined modules
INSERT INTO modules (name, description) VALUES
('dashboard', 'Dashboard and overview'),
('customers', 'Customer management'),
('products', 'Product catalog management'),
('sales', 'Sales transactions and invoices'),
('purchases', 'Purchase orders and vendor bills'),
('inventory', 'Inventory management'),
('manufacturing', 'Manufacturing processes'),
('reports', 'Financial and operational reports'),
('settings', 'System settings'),
('users', 'User management'),
('roles', 'Role and permission management');

-- Function to create predefined roles with permissions
CREATE OR REPLACE FUNCTION create_predefined_roles(company_id INTEGER, admin_user_id INTEGER)
RETURNS VOID AS $$
DECLARE
    role_id INTEGER;
    module_id INTEGER;
    module_record RECORD;
BEGIN
    -- Create SuperAdmin role
    INSERT INTO roles (company_id, name, description, is_predefined, created_by, updated_by)
    VALUES (company_id, 'SuperAdmin', 'Full access to all system features', TRUE, admin_user_id, admin_user_id)
    RETURNING id INTO role_id;
    
    -- Grant all permissions to SuperAdmin for all modules
    FOR module_record IN SELECT id FROM modules LOOP
        INSERT INTO permissions (role_id, module_id, can_view, can_create, can_edit, can_delete, created_by, updated_by)
        VALUES (role_id, module_record.id, TRUE, TRUE, TRUE, TRUE, admin_user_id, admin_user_id);
    END LOOP;
    
    -- Create Admin role
    INSERT INTO roles (company_id, name, description, is_predefined, created_by, updated_by)
    VALUES (company_id, 'Admin', 'Administrative access with some restrictions', TRUE, admin_user_id, admin_user_id)
    RETURNING id INTO role_id;
    
    -- Grant permissions to Admin for all modules except settings
    FOR module_record IN SELECT id, name FROM modules LOOP
        IF module_record.name = 'settings' THEN
            INSERT INTO permissions (role_id, module_id, can_view, can_create, can_edit, can_delete, created_by, updated_by)
            VALUES (role_id, module_record.id, TRUE, FALSE, FALSE, FALSE, admin_user_id, admin_user_id);
        ELSE
            INSERT INTO permissions (role_id, module_id, can_view, can_create, can_edit, can_delete, created_by, updated_by)
            VALUES (role_id, module_record.id, TRUE, TRUE, TRUE, TRUE, admin_user_id, admin_user_id);
        END IF;
    END LOOP;
    
    -- Create Sales Supervisor role
    INSERT INTO roles (company_id, name, description, is_predefined, created_by, updated_by)
    VALUES (company_id, 'Sales Supervisor', 'Manages sales team and operations', TRUE, admin_user_id, admin_user_id)
    RETURNING id INTO role_id;
    
    -- Grant permissions to Sales Supervisor
    FOR module_record IN SELECT id, name FROM modules LOOP
        IF module_record.name IN ('dashboard', 'customers', 'products', 'sales', 'reports') THEN
            INSERT INTO permissions (role_id, module_id, can_view, can_create, can_edit, can_delete, created_by, updated_by)
            VALUES (role_id, module_record.id, TRUE, TRUE, TRUE, TRUE, admin_user_id, admin_user_id);
        ELSE
            INSERT INTO permissions (role_id, module_id, can_view, can_create, can_edit, can_delete, created_by, updated_by)
            VALUES (role_id, module_record.id, FALSE, FALSE, FALSE, FALSE, admin_user_id, admin_user_id);
        END IF;
    END LOOP;
    
    -- Create Sales Rep role
    INSERT INTO roles (company_id, name, description, is_predefined, created_by, updated_by)
    VALUES (company_id, 'Sales Rep', 'Handles sales and customer interactions', TRUE, admin_user_id, admin_user_id)
    RETURNING id INTO role_id;
    
    -- Grant permissions to Sales Rep
    FOR module_record IN SELECT id, name FROM modules LOOP
        IF module_record.name IN ('dashboard', 'customers', 'products', 'sales') THEN
            INSERT INTO permissions (role_id, module_id, can_view, can_create, can_edit, can_delete, created_by, updated_by)
            VALUES (role_id, module_record.id, TRUE, TRUE, TRUE, FALSE, admin_user_id, admin_user_id);
        ELSE
            INSERT INTO permissions (role_id, module_id, can_view, can_create, can_edit, can_delete, created_by, updated_by)
            VALUES (role_id, module_record.id, FALSE, FALSE, FALSE, FALSE, admin_user_id, admin_user_id);
        END IF;
    END LOOP;
    
    -- Create other predefined roles with appropriate permissions
    -- Procurement Supervisor
    INSERT INTO roles (company_id, name, description, is_predefined, created_by, updated_by)
    VALUES (company_id, 'Procurement Supervisor', 'Manages procurement operations', TRUE, admin_user_id, admin_user_id)
    RETURNING id INTO role_id;
    
    -- Procurement Rep
    INSERT INTO roles (company_id, name, description, is_predefined, created_by, updated_by)
    VALUES (company_id, 'Procurement Rep', 'Handles purchasing and vendor interactions', TRUE, admin_user_id, admin_user_id)
    RETURNING id INTO role_id;
    
    -- Production Supervisor
    INSERT INTO roles (company_id, name, description, is_predefined, created_by, updated_by)
    VALUES (company_id, 'Production Supervisor', 'Manages production operations', TRUE, admin_user_id, admin_user_id)
    RETURNING id INTO role_id;
    
    -- Machine Operator
    INSERT INTO roles (company_id, name, description, is_predefined, created_by, updated_by)
    VALUES (company_id, 'Machine Operator', 'Operates production machinery', TRUE, admin_user_id, admin_user_id)
    RETURNING id INTO role_id;
    
    -- Packaging Supervisor
    INSERT INTO roles (company_id, name, description, is_predefined, created_by, updated_by)
    VALUES (company_id, 'Packaging Supervisor', 'Manages packaging operations', TRUE, admin_user_id, admin_user_id)
    RETURNING id INTO role_id;
    
    -- Packaging Person
    INSERT INTO roles (company_id, name, description, is_predefined, created_by, updated_by)
    VALUES (company_id, 'Packaging Person', 'Handles product packaging', TRUE, admin_user_id, admin_user_id)
    RETURNING id INTO role_id;
    
    -- Transport Supervisor
    INSERT INTO roles (company_id, name, description, is_predefined, created_by, updated_by)
    VALUES (company_id, 'Transport Supervisor', 'Manages transportation operations', TRUE, admin_user_id, admin_user_id)
    RETURNING id INTO role_id;
    
    -- Transport Person
    INSERT INTO roles (company_id, name, description, is_predefined, created_by, updated_by)
    VALUES (company_id, 'Transport Person', 'Handles product transportation', TRUE, admin_user_id, admin_user_id)
    RETURNING id INTO role_id;
    
    -- Store Supervisor
    INSERT INTO roles (company_id, name, description, is_predefined, created_by, updated_by)
    VALUES (company_id, 'Store Supervisor', 'Manages store operations', TRUE, admin_user_id, admin_user_id)
    RETURNING id INTO role_id;
    
    -- Store Person
    INSERT INTO roles (company_id, name, description, is_predefined, created_by, updated_by)
    VALUES (company_id, 'Store Person', 'Handles store operations', TRUE, admin_user_id, admin_user_id)
    RETURNING id INTO role_id;
    
    -- HR Supervisor
    INSERT INTO roles (company_id, name, description, is_predefined, created_by, updated_by)
    VALUES (company_id, 'HR Supervisor', 'Manages human resources', TRUE, admin_user_id, admin_user_id)
    RETURNING id INTO role_id;
END;
$$ LANGUAGE plpgsql;
