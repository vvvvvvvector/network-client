import { type Metadata } from 'next';
import { redirect } from 'next/navigation';

import { isAuthorized } from '@/app/(auth)/auth';

import { SignInForm } from '@/components/forms/signin-form';

import { PAGES } from '@/lib/constants';

export const metadata: Metadata = {
  title: 'Auth / Sign In'
};

export default async function SignInPage() {
  const authorized = await isAuthorized();

  if (authorized) redirect(PAGES.MY_PROFILE);

  return <SignInForm />;
}
