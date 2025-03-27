
import React from 'react';
import EmployeeDetailsClient from './page.client';
import { withCompanyContext } from '@/lib/auth/with-company-context';

export default async function EmployeeDetailsPage({ params }: { params: { id: string } }) {
  return withCompanyContext(props => <EmployeeDetailsClient {...props} params={params} />);
}
