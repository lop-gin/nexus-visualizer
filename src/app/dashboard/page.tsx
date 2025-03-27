
import React from 'react';
import DashboardClient from './page.client';
import { withCompanyContext } from '@/lib/auth/with-company-context';

export default async function DashboardPage() {
  return withCompanyContext(DashboardClient);
}
