
import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import { ThemeProvider } from 'next-themes';
import { AuthProvider } from '@/providers/auth-provider';
import { CompanyProvider } from '@/providers/company-provider';

const HomePage = React.lazy(() => import('./app/page'));
const LoginPage = React.lazy(() => import('./app/auth/login/page.client'));
const RegisterPage = React.lazy(() => import('./app/auth/register/page.client'));
const ForgotPasswordPage = React.lazy(() => import('./app/auth/forgot-password/page.client'));
const ResetPasswordPage = React.lazy(() => import('./app/auth/reset-password/page.client'));
const DashboardPage = React.lazy(() => import('./app/dashboard/page.client'));
const EmployeesPage = React.lazy(() => import('./app/dashboard/employees/page.client'));
const EmployeeDetailsPage = React.lazy(() => import('./app/dashboard/employees/[id]/page.client'));
const AddEmployeePage = React.lazy(() => import('./app/dashboard/employees/add/page.client'));
const RolesPage = React.lazy(() => import('./app/dashboard/roles/page.client'));
const RoleDetailsPage = React.lazy(() => import('./app/dashboard/roles/[id]/page.client'));
const NewRolePage = React.lazy(() => import('./app/dashboard/roles/new/page.client'));
const ProductsPage = React.lazy(() => import('./app/dashboard/products/page.client'));
const DatabaseSettingsPage = React.lazy(() => import('./app/dashboard/settings/database/page.client'));

function App() {
  return (
    <ThemeProvider attribute="class" defaultTheme="light">
      <AuthProvider>
        <CompanyProvider>
          <React.Suspense fallback={<div className="flex items-center justify-center min-h-screen">Loading...</div>}>
            <Routes>
              <Route path="/" element={<HomePage />} />
              <Route path="/auth/login" element={<LoginPage />} />
              <Route path="/auth/register" element={<RegisterPage />} />
              <Route path="/auth/forgot-password" element={<ForgotPasswordPage />} />
              <Route path="/auth/reset-password" element={<ResetPasswordPage />} />
              
              <Route path="/dashboard" element={<DashboardPage />} />
              <Route path="/dashboard/employees" element={<EmployeesPage />} />
              <Route path="/dashboard/employees/:id" element={
                <EmployeeDetailsPage params={{ id: ':id' }} />
              } />
              <Route path="/dashboard/employees/add" element={<AddEmployeePage />} />
              <Route path="/dashboard/roles" element={<RolesPage />} />
              <Route path="/dashboard/roles/:id" element={
                <RoleDetailsPage params={{ id: ':id' }} />
              } />
              <Route path="/dashboard/roles/new" element={<NewRolePage />} />
              <Route path="/dashboard/products" element={<ProductsPage />} />
              <Route path="/dashboard/settings/database" element={<DatabaseSettingsPage />} />
              
              <Route path="*" element={<Navigate to="/" replace />} />
            </Routes>
          </React.Suspense>
          <Toaster position="top-right" />
        </CompanyProvider>
      </AuthProvider>
    </ThemeProvider>
  );
}

export default App;
