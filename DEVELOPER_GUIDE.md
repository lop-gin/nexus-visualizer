# Janus Project - Developer Guide

## Introduction

This developer guide provides technical details for developers who will be working on the Janus project, a QuickBooks-like system designed specifically for manufacturers and distributors.

## Development Environment Setup

### Local Development

1. **Clone the repository**:
   ```bash
   git clone https://github.com/your-username/janus_project.git
   cd janus_project/next-frontend-refactored
   ```

2. **Install dependencies**:
   ```bash
   npm install
   ```

3. **Set up environment variables**:
   Create a `.env.local` file with:
   ```
   NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
   NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
   ```

4. **Start the development server**:
   ```bash
   npm run dev
   ```

### Switching Between Hosted and Self-Hosted Supabase

The system is designed to work with both hosted Supabase and self-hosted instances:

#### For Hosted Supabase:
Set environment variables to your Supabase project:
```
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
```

#### For Self-Hosted Supabase:
1. Set up Docker and Supabase locally following the [Supabase self-hosting guide](https://supabase.com/docs/guides/self-hosting)
2. Set environment variables to your local instance:
```
NEXT_PUBLIC_SUPABASE_URL=http://localhost:8000
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-local-anon-key
```

## Code Architecture

### Directory Structure

The project follows a modular architecture with clear separation of concerns:

- **app/**: Next.js App Router pages and API routes
- **components/**: Reusable UI components
- **lib/**: Utility functions, services, and business logic
- **providers/**: React context providers
- **types/**: TypeScript type definitions

### Key Design Patterns

1. **Service Layer Pattern**:
   - Services in `lib/` handle data fetching and business logic
   - Components consume services through hooks

2. **Context Provider Pattern**:
   - Global state managed through React Context
   - Providers in `providers/` wrap the application

3. **Higher-Order Component (HOC) Pattern**:
   - HOCs for authentication and permission checks
   - Reusable wrappers for common functionality

4. **Repository Pattern**:
   - Data access abstracted through repository-like services
   - Consistent interface for database operations

## Authentication Flow

1. **Registration**:
   - User signs up as a company
   - System creates company record
   - User becomes SuperAdmin of the company

2. **Employee Invitation**:
   - Admin invites employee via email
   - System creates invitation record
   - Employee receives email with invitation link
   - Employee sets password and activates account

3. **Login**:
   - User enters credentials
   - System authenticates via Supabase Auth
   - Company context is established
   - Permissions are loaded

## Adding New Features

### Creating a New Page

1. Create a new page in the appropriate directory under `app/`
2. Create a client component for the page content
3. Wrap with appropriate layout and permission checks
4. Add to navigation if needed

Example:
```tsx
// app/dashboard/new-feature/page.tsx
import { withCompanyContext } from '@/lib/auth/with-company-context';
import NewFeatureClient from './page.client';

export default async function NewFeaturePage() {
  return withCompanyContext(NewFeatureClient);
}
```

### Adding a New API Endpoint

1. Create a new route handler in `app/api/`
2. Implement the necessary HTTP methods
3. Add authentication and permission checks
4. Connect to the database via Supabase client

Example:
```tsx
// app/api/new-feature/route.ts
import { createRouteHandlerClient } from '@supabase/auth-helpers-nextjs';
import { cookies } from 'next/headers';
import { NextResponse } from 'next/server';

export async function GET() {
  const supabase = createRouteHandlerClient({ cookies });
  
  // Check authentication
  const { data: { session } } = await supabase.auth.getSession();
  if (!session) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }
  
  // Fetch data
  const { data, error } = await supabase.from('your_table').select('*');
  
  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
  
  return NextResponse.json({ data });
}
```

### Creating a New Component

1. Create component in appropriate directory under `components/`
2. Use TypeScript for props definition
3. Implement responsive design with Tailwind CSS
4. Add proper error handling and loading states

Example:
```tsx
// components/ui/new-component.tsx
import React from 'react';

interface NewComponentProps {
  title: string;
  onAction: () => void;
  isLoading?: boolean;
}

export const NewComponent: React.FC<NewComponentProps> = ({
  title,
  onAction,
  isLoading = false,
}) => {
  return (
    <div className="p-4 border rounded-md">
      <h3 className="text-lg font-medium">{title}</h3>
      <button
        onClick={onAction}
        disabled={isLoading}
        className="mt-2 px-4 py-2 bg-blue-500 text-white rounded-md disabled:bg-gray-300"
      >
        {isLoading ? 'Loading...' : 'Action'}
      </button>
    </div>
  );
};
```

## Database Schema Management

### Adding a New Table

1. Create a migration SQL file in `lib/supabase/migrations/`
2. Add the table definition with proper constraints
3. Add RLS policies for company isolation
4. Update the TypeScript types in `types/supabase.ts`

Example:
```sql
-- Create new table
CREATE TABLE new_feature (
    id SERIAL PRIMARY KEY,
    company_id INTEGER NOT NULL REFERENCES companies(id),
    name VARCHAR(100) NOT NULL,
    description TEXT,
    created_by INTEGER NOT NULL REFERENCES users(id),
    updated_by INTEGER NOT NULL REFERENCES users(id),
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Create index
CREATE INDEX idx_new_feature_company ON new_feature(company_id);

-- Enable RLS
ALTER TABLE new_feature ENABLE ROW LEVEL SECURITY;

-- Create RLS policy
CREATE POLICY new_feature_isolation ON new_feature
    USING (company_id = current_setting('app.current_company_id')::integer);
```

### Modifying Existing Tables

1. Create a migration SQL file for the changes
2. Use ALTER TABLE statements to modify the structure
3. Update any affected RLS policies
4. Update TypeScript types to reflect changes

## Testing

### Unit Testing

Use Jest and React Testing Library for unit tests:

```bash
npm test
```

### E2E Testing

Use Cypress for end-to-end testing:

```bash
npm run cypress:open
```

## Deployment

### Production Build

```bash
npm run build
```

### Vercel Deployment

1. Connect your GitHub repository to Vercel
2. Set environment variables in Vercel dashboard
3. Deploy from main branch

### Docker Deployment

A Dockerfile is provided for containerized deployment:

```bash
docker build -t janus-frontend .
docker run -p 3000:3000 janus-frontend
```

## Performance Optimization

1. **Server-Side Rendering**:
   - Use Next.js SSR for initial page load
   - Fetch critical data server-side

2. **Code Splitting**:
   - Leverage Next.js automatic code splitting
   - Use dynamic imports for large components

3. **Caching**:
   - Implement SWR for client-side data fetching
   - Use Next.js cache mechanisms

4. **Image Optimization**:
   - Use Next.js Image component
   - Optimize and compress images

## Security Best Practices

1. **Authentication**:
   - Always verify user session before data access
   - Use Supabase Auth for secure authentication

2. **Data Isolation**:
   - Always use RLS policies for database tables
   - Set company context for all database operations

3. **Input Validation**:
   - Use Zod for form validation
   - Sanitize all user inputs

4. **API Security**:
   - Implement rate limiting
   - Validate request parameters
   - Use proper HTTP status codes

## Troubleshooting Common Issues

### Database Connection Issues

1. Check Supabase URL and anon key
2. Verify network connectivity
3. Check for RLS policy conflicts

### Authentication Problems

1. Clear browser cookies and local storage
2. Verify email templates in Supabase
3. Check for CORS issues

### Performance Issues

1. Use React DevTools to identify unnecessary re-renders
2. Check for N+1 query problems
3. Implement pagination for large data sets

## Contributing Guidelines

1. **Branch Naming**:
   - feature/feature-name
   - bugfix/issue-description
   - hotfix/urgent-fix

2. **Commit Messages**:
   - Use conventional commits format
   - Reference issue numbers

3. **Pull Requests**:
   - Provide detailed description
   - Include screenshots for UI changes
   - Ensure tests pass

4. **Code Style**:
   - Follow ESLint configuration
   - Use Prettier for formatting
   - Maintain consistent naming conventions
