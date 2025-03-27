
'use client';

import { ThemeProvider } from 'next-themes';
import { Toaster } from 'react-hot-toast';
import { AuthProvider } from '@/providers/auth-provider';
import './globals.css';

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className="min-h-screen">
        <ThemeProvider attribute="class" defaultTheme="light">
          <AuthProvider>
            <main className="relative overflow-hidden min-h-screen">
              {/* Background texture elements */}
              <div className="fixed inset-0 pointer-events-none dark:bg-texture-dark bg-texture-light"></div>
              <div className="content-above-texture">
                {children}
              </div>
            </main>
            <Toaster position="top-right" />
          </AuthProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
