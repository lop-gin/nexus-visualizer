# Janus Project - README

## Overview

Janus is a QuickBooks-like system designed specifically for manufacturers and distributors. It provides comprehensive functionality for managing customers, products, sales, employees, and roles with a focus on manufacturing-specific needs.

## Features

- **Role-Based Access Control**: Comprehensive permission system with predefined and custom roles
- **Employee Management**: Add, invite, and manage employees with different roles
- **Customer Management**: Track customers with "Add New" feature in dropdowns
- **Product Management**: Manage products with primary and secondary units of measure and conversion factors
- **Sales Management**: Create and manage invoices, sales receipts, and other transactions
- **Multi-Tenant Architecture**: Secure data isolation between different companies
- **Supabase Integration**: Works with both hosted and self-hosted Supabase instances

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

## Documentation

For detailed information about the project, please refer to:

- [User Documentation](./DOCUMENTATION.md) - Comprehensive guide for users and administrators
- [Developer Guide](./DEVELOPER_GUIDE.md) - Technical documentation for developers

## License

This project is licensed under the MIT License - see the LICENSE file for details.

## Acknowledgments

- Built with Next.js and Supabase
- Inspired by QuickBooks but tailored for manufacturing and distribution needs
