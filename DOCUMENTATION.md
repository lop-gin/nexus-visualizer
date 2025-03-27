# Janus Project Documentation

## Overview

Janus is a QuickBooks-like system designed specifically for manufacturers and distributors. It provides comprehensive functionality for managing customers, products, sales, employees, and roles with a focus on manufacturing-specific needs.

## Table of Contents

1. [Project Structure](#project-structure)
2. [Technology Stack](#technology-stack)
3. [Getting Started](#getting-started)
4. [Authentication](#authentication)
5. [Role-Based Access Control](#role-based-access-control)
6. [Employee Management](#employee-management)
7. [Customer Management](#customer-management)
8. [Product Management](#product-management)
9. [Sales Management](#sales-management)
10. [Database Schema](#database-schema)
11. [Supabase Integration](#supabase-integration)
12. [Company Data Isolation](#company-data-isolation)
13. [Deployment](#deployment)
14. [Troubleshooting](#troubleshooting)

## Project Structure

The project follows a well-organized structure with clear separation of concerns:

```
next-frontend-refactored/
├── public/                  # Static assets
├── src/
│   ├── app/                 # Next.js app router pages
│   │   ├── api/             # API routes
│   │   ├── auth/            # Authentication pages
│   │   ├── dashboard/       # Dashboard pages
│   │   ├── sales/           # Sales-related pages
│   │   └── ...
│   ├── components/          # Reusable UI components
│   │   ├── common/          # Layout and shared components
│   │   ├── forms/           # Form components
│   │   └── ui/              # Basic UI elements
│   ├── lib/                 # Utility functions and services
│   │   ├── auth/            # Authentication utilities
│   │   ├── data/            # Data access services
│   │   ├── inventory/       # Inventory management
│   │   ├── roles/           # Role management
│   │   ├── sales/           # Sales utilities
│   │   ├── supabase/        # Supabase client and services
│   │   ├── utils/           # General utilities
│   │   └── validation/      # Form validation schemas
│   ├── providers/           # React context providers
│   ├── types/               # TypeScript type definitions
│   └── middleware.ts        # Next.js middleware for auth and company isolation
```

## Technology Stack

- **Frontend**: Next.js 14 with App Router
- **UI**: Tailwind CSS with custom components
- **State Management**: React Context API
- **Form Handling**: React Hook Form with Zod validation
- **Database**: Supabase (PostgreSQL)
- **Authentication**: Supabase Auth
- **API**: Next.js API Routes + Supabase Client
- **Deployment**: Vercel (recommended)

## Getting Started

### Prerequisites

- Node.js 18+ and npm
- Supabase account (or self-hosted Supabase instance)

### Installation

1. Clone the repository:
   ```bash
   git clone https://github.com/your-username/janus_project.git
   cd janus_project/next-frontend-refactored
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Set up environment variables:
   Create a `.env.local` file with the following variables:
   ```
   NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
   NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
   ```

4. Run the development server:
   ```bash
   npm run dev
   ```

5. Initialize the database:
   Navigate to `/dashboard/settings/database` after logging in as an admin to run the database migrations.

## Authentication

The system uses Supabase Authentication with email/password login. The authentication flow includes:

- Registration (Sign up as a company)
- Login
- Password reset
- Email verification

### Authentication Context

The `AuthProvider` in `src/providers/auth-provider.tsx` manages authentication state and provides methods for login, logout, and registration.

## Role-Based Access Control

The system implements a comprehensive role-based access control (RBAC) system:

### Predefined Roles

- **SuperAdmin**: Full access to all system features
- **Admin**: Administrative access with some restrictions
- **Sales Supervisor**: Manages sales team and operations
- **Sales Rep**: Handles sales and customer interactions
- And many other roles specific to manufacturing operations

### Custom Roles

Administrators can create custom roles with specific permissions for different modules.

### Permissions

Permissions are granted at the module level with four action types:
- **View**: Ability to see data
- **Create**: Ability to add new records
- **Edit**: Ability to modify existing records
- **Delete**: Ability to remove records

### Implementation

- `RolesContext` in `src/lib/roles/RolesContext.tsx` provides role and permission data
- `withPermissionCheck` HOC in `src/lib/auth/permission-check.tsx` protects routes based on permissions
- Database tables: `roles`, `modules`, and `permissions` store the RBAC configuration

## Employee Management

The employee management system allows companies to:

1. View all employees and their details
2. Add new employees
3. Edit employee information
4. Assign roles to employees
5. Invite employees via email

### Invitation System

When an employee is invited:
1. An invitation record is created in the database
2. An email is sent with a unique invitation link
3. The employee can create a password and activate their account

### Implementation

- Employee management pages in `src/app/dashboard/employees/`
- Employee service in `src/lib/supabase/employees-service.ts`
- API routes in `src/app/api/employees/`

## Customer Management

The customer management system includes:

1. Customer listing with search and filtering
2. Customer details view
3. Add/Edit customer forms
4. "Add New" feature in dropdowns

### "Add New" Feature

When selecting a customer in forms:
- The first option is "Add New Customer" in blue text
- Clicking this opens a modal to add a new customer
- After adding, the customer is selected and fields auto-populate

### Auto-Population

When a customer is selected, the following fields automatically populate:
- Email
- Company name
- Billing address

### Implementation

- Customer components in `src/components/forms/customer/`
- Customer service in `src/lib/sales/customer-service.ts`

## Product Management

The product management system includes:

1. Product listing with categories
2. Product details view
3. Add/Edit product forms
4. Unit conversion functionality

### Unit Conversion

Products can have:
- **Primary Unit of Measure** (smallest unit, e.g., piece, gram)
- **Secondary Unit of Measure** (larger unit, e.g., dozen, kilogram)
- **Conversion Factor** (how many primary units make one secondary unit)

In transaction forms, users can select either unit, and prices adjust automatically.

### Implementation

- Product components in `src/components/forms/product/`
- Product service in `src/lib/inventory/product-service.ts`
- Unit conversion utilities in `src/lib/inventory/product-units.ts`

## Sales Management

The sales management system includes:

1. Invoices
2. Sales receipts
3. Estimates
4. Credit notes
5. Refund receipts

### Line Items

Transaction line items include:
- Product selection (with "Add New" option)
- Description
- Quantity
- Unit of measure (dropdown showing primary and secondary units)
- Unit price (adjusts based on selected unit)
- Tax percentage
- Amount (calculated)

### Implementation

- Sales forms in `src/app/sales/`
- Transaction components in `src/components/forms/transaction/`

## Database Schema

The database schema includes the following main tables:

1. **companies**: Stores company information
2. **users**: User authentication records
3. **employees**: Links users to companies with roles
4. **roles**: Defines user roles
5. **permissions**: Maps roles to module permissions
6. **modules**: System modules for permission assignment
7. **customers**: Customer records
8. **products**: Product catalog
9. **categories**: Product categories
10. **transactions**: Header table for invoices, sales receipts, etc.
11. **transaction_items**: Line items for transactions
12. **payments**: Payment records
13. **payment_allocations**: Links payments to invoices

See the complete schema in `src/lib/supabase/migrations/updated-schema.sql`.

## Supabase Integration

The system integrates with Supabase for:

1. **Authentication**: User signup, login, and password reset
2. **Database**: PostgreSQL database for all application data
3. **Row-Level Security**: Ensures data isolation between companies

### Configuration

Supabase is configured in `src/lib/supabase/client.ts` and can be switched between hosted and self-hosted instances by changing the environment variables.

### Database Initialization

The system includes migration scripts to initialize the database schema and create necessary tables. These can be run from the admin dashboard.

## Company Data Isolation

The system implements multi-tenant data isolation to ensure companies can only access their own data:

### Row-Level Security (RLS)

PostgreSQL RLS policies restrict data access based on company_id.

### Application-Level Security

1. **Middleware**: Sets company context for all requests
2. **Server Components**: Verify company access
3. **Client Components**: Check permissions and company access
4. **Data Services**: Enforce company isolation for all operations

### Implementation

- Middleware in `src/middleware.ts`
- Company context in `src/providers/company-provider.tsx`
- Data isolation service in `src/lib/data/data-isolation-service.ts`

## Deployment

### Hosted Supabase

1. Create a Supabase project
2. Set environment variables for Supabase URL and anon key
3. Deploy to Vercel or similar platform

### Self-Hosted Supabase

1. Set up Docker and Supabase locally
2. Configure environment variables to point to local instance
3. Deploy the frontend to your preferred hosting platform

## Troubleshooting

### Common Issues

1. **Authentication Problems**:
   - Check Supabase configuration
   - Verify email templates are set up correctly

2. **Permission Errors**:
   - Ensure roles and permissions are properly configured
   - Check that company context is being set correctly

3. **Data Not Showing**:
   - Verify RLS policies are correctly implemented
   - Check that the user has the necessary permissions

### Support

For additional support, please contact the development team or refer to the Supabase documentation.
