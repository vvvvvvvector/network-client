import { type Metadata } from 'next';
import { redirect } from 'next/navigation';

import { isAuthorized } from '@/app/(auth)/api';

import { PAGES } from '@/lib/constants';

export const metadata: Metadata = {
  title: 'Authorised / Network User'
};

export default async function NetworkUserPage() {
  const authorized = await isAuthorized();

  if (!authorized) redirect(PAGES.SIGN_IN);

  return <div>hello owrold</div>;
}
