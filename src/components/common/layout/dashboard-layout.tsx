'use client';

import React from 'react';
import Link from 'next/link';
import { useAuth } from '@/lib/auth/AuthContext';
import { cn } from '@/lib/utils/helpers';

interface DashboardLayoutProps {
  children: React.ReactNode;
}

export function DashboardLayout({ children }: DashboardLayoutProps) {
  const { user, signOut } = useAuth();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = React.useState(false);

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  const handleSignOut = async () => {
    try {
      await signOut();
    } catch (error) {
      console.error('Error signing out:', error);
    }
  };

  const navigationItems = [
    { name: 'Dashboard', href: '/dashboard', icon: 'HomeIcon' },
    { 
      name: 'Sales', 
      href: '#', 
      icon: 'CurrencyDollarIcon',
      children: [
        { name: 'Invoices', href: '/dashboard/sales/invoice' },
        { name: 'Sales Receipts', href: '/dashboard/sales/sales-receipt' },
        { name: 'Estimates', href: '/dashboard/sales/estimate' },
        { name: 'Credit Notes', href: '/dashboard/sales/credit-note' },
        { name: 'Receive Payment', href: '/dashboard/sales/receive-payment' },
      ]
    },
    { 
      name: 'Employees', 
      href: '/dashboard/employees', 
      icon: 'UsersIcon',
    },
    { 
      name: 'Roles', 
      href: '/dashboard/roles', 
      icon: 'ShieldCheckIcon',
    },
    { 
      name: 'Settings', 
      href: '/dashboard/settings', 
      icon: 'CogIcon',
    },
  ];

  return (
    <div className="min-h-screen bg-gray-100">
      {/* Mobile menu */}
      <div className="lg:hidden">
        <div className="fixed inset-0 flex z-40">
          {/* Overlay */}
          {isMobileMenuOpen && (
            <div 
              className="fixed inset-0 bg-gray-600 bg-opacity-75"
              onClick={toggleMobileMenu}
            ></div>
          )}
          
          {/* Mobile menu panel */}
          <div className={cn(
            "fixed inset-y-0 left-0 flex flex-col w-64 bg-white shadow-xl transform transition-transform ease-in-out duration-300",
            isMobileMenuOpen ? "translate-x-0" : "-translate-x-full"
          )}>
            <div className="flex items-center justify-between h-16 px-4 border-b border-gray-200">
              <div className="text-xl font-bold text-blue-900">InventoryPro</div>
              <button 
                onClick={toggleMobileMenu}
                className="text-gray-500 hover:text-gray-700"
              >
                <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
            <div className="flex-1 overflow-y-auto">
              <nav className="px-2 py-4 space-y-1">
                {navigationItems.map((item) => (
                  <div key={item.name}>
                    <Link
                      href={item.href}
                      className="group flex items-center px-2 py-2 text-base font-medium rounded-md text-gray-700 hover:bg-gray-100 hover:text-gray-900"
                    >
                      <span>{item.name}</span>
                    </Link>
                    {item.children && (
                      <div className="ml-4 mt-1 space-y-1">
                        {item.children.map((subItem) => (
                          <Link
                            key={subItem.name}
                            href={subItem.href}
                            className="group flex items-center px-2 py-2 text-sm font-medium rounded-md text-gray-600 hover:bg-gray-50 hover:text-gray-900"
                          >
                            {subItem.name}
                          </Link>
                        ))}
                      </div>
                    )}
                  </div>
                ))}
              </nav>
            </div>
            <div className="p-4 border-t border-gray-200">
              <button
                onClick={handleSignOut}
                className="w-full flex items-center px-2 py-2 text-base font-medium rounded-md text-red-600 hover:bg-red-50"
              >
                <span>Sign out</span>
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Desktop layout */}
      <div className="flex h-screen overflow-hidden">
        {/* Sidebar */}
        <div className="hidden lg:flex lg:flex-shrink-0">
          <div className="flex flex-col w-64 border-r border-gray-200 bg-white">
            <div className="flex items-center h-16 px-4 border-b border-gray-200">
              <div className="text-xl font-bold text-blue-900">InventoryPro</div>
            </div>
            <div className="flex-1 flex flex-col overflow-y-auto">
              <nav className="flex-1 px-2 py-4 space-y-1">
                {navigationItems.map((item) => (
                  <div key={item.name}>
                    <Link
                      href={item.href}
                      className="group flex items-center px-2 py-2 text-sm font-medium rounded-md text-gray-700 hover:bg-gray-100 hover:text-gray-900"
                    >
                      <span>{item.name}</span>
                    </Link>
                    {item.children && (
                      <div className="ml-4 mt-1 space-y-1">
                        {item.children.map((subItem) => (
                          <Link
                            key={subItem.name}
                            href={subItem.href}
                            className="group flex items-center px-2 py-2 text-sm font-medium rounded-md text-gray-600 hover:bg-gray-50 hover:text-gray-900"
                          >
                            {subItem.name}
                          </Link>
                        ))}
                      </div>
                    )}
                  </div>
                ))}
              </nav>
            </div>
            <div className="p-4 border-t border-gray-200">
              <button
                onClick={handleSignOut}
                className="w-full flex items-center px-2 py-2 text-sm font-medium rounded-md text-red-600 hover:bg-red-50"
              >
                <span>Sign out</span>
              </button>
            </div>
          </div>
        </div>

        {/* Main content */}
        <div className="flex flex-col w-0 flex-1 overflow-hidden">
          {/* Top header */}
          <div className="relative z-10 flex-shrink-0 flex h-16 bg-white border-b border-gray-200 lg:hidden">
            <button
              onClick={toggleMobileMenu}
              className="px-4 text-gray-500 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-blue-500 lg:hidden"
            >
              <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            </button>
            <div className="flex-1 flex justify-center px-4 lg:px-0">
              <div className="flex-1 flex items-center justify-center">
                <div className="text-xl font-bold text-blue-900 lg:hidden">InventoryPro</div>
              </div>
            </div>
          </div>

          {/* Page content */}
          <main className="flex-1 relative overflow-y-auto focus:outline-none p-4">
            {children}
          </main>
        </div>
      </div>
    </div>
  );
}
