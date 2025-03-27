
import React from 'react';
import RoleDetailsClient from './page.client';
import { withCompanyContext } from '@/lib/auth/with-company-context';

export default async function RoleDetailsPage({ params }: { params: { id: string } }) {
  return withCompanyContext(props => <RoleDetailsClient {...props} params={params} />);
}
