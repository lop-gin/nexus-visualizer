
import { Metadata } from 'next';
import EmployeeEditPage from './page.client';

export const metadata: Metadata = {
  title: 'Edit Employee',
  description: 'Edit employee information',
};

export default function Page({ params }: { params: { id: string } }) {
  return <EmployeeEditPage id={params.id} />;
}
