'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { cn } from '@/lib/utils/helpers';

interface SidebarNavProps {
  items: {
    title: string;
    href: string;
    icon?: React.ReactNode;
    submenu?: {
      title: string;
      href: string;
    }[];
  }[];
  className?: string;
}

export function SidebarNav({ items, className }: SidebarNavProps) {
  const pathname = usePathname();
  const [openSubmenu, setOpenSubmenu] = React.useState<string | null>(null);

  const toggleSubmenu = (title: string) => {
    setOpenSubmenu(prev => prev === title ? null : title);
  };

  return (
    <nav className={cn("space-y-1", className)}>
      {items.map((item) => {
        const isActive = pathname === item.href;
        const hasSubmenu = item.submenu && item.submenu.length > 0;
        const isSubmenuOpen = openSubmenu === item.title;
        
        return (
          <div key={item.href} className="space-y-1">
            {hasSubmenu ? (
              <button
                onClick={() => toggleSubmenu(item.title)}
                className={cn(
                  "flex items-center w-full px-3 py-2 text-sm font-medium rounded-md",
                  isActive
                    ? "bg-blue-100 text-blue-700"
                    : "text-gray-700 hover:bg-gray-100 hover:text-gray-900"
                )}
              >
                {item.icon && <span className="mr-3">{item.icon}</span>}
                <span className="flex-1 text-left">{item.title}</span>
                <svg
                  className={cn(
                    "h-4 w-4 transition-transform",
                    isSubmenuOpen ? "transform rotate-180" : ""
                  )}
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 20 20"
                  fill="currentColor"
                >
                  <path
                    fillRule="evenodd"
                    d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z"
                    clipRule="evenodd"
                  />
                </svg>
              </button>
            ) : (
              <Link
                href={item.href}
                className={cn(
                  "flex items-center px-3 py-2 text-sm font-medium rounded-md",
                  isActive
                    ? "bg-blue-100 text-blue-700"
                    : "text-gray-700 hover:bg-gray-100 hover:text-gray-900"
                )}
              >
                {item.icon && <span className="mr-3">{item.icon}</span>}
                {item.title}
              </Link>
            )}
            
            {hasSubmenu && isSubmenuOpen && (
              <div className="ml-6 mt-1 space-y-1">
                {item.submenu?.map((subItem) => {
                  const isSubActive = pathname === subItem.href;
                  return (
                    <Link
                      key={subItem.href}
                      href={subItem.href}
                      className={cn(
                        "flex items-center px-3 py-2 text-sm font-medium rounded-md",
                        isSubActive
                          ? "bg-blue-50 text-blue-700"
                          : "text-gray-600 hover:bg-gray-50 hover:text-gray-900"
                      )}
                    >
                      {subItem.title}
                    </Link>
                  );
                })}
              </div>
            )}
          </div>
        );
      })}
    </nav>
  );
}
