import { type Metadata } from 'next';
import { redirect } from 'next/navigation';

import { isAuthorized } from '@/app/(auth)/api';

import { SignUpForm } from '@/components/forms/signup-form';

import { PAGES } from '@/lib/constants';

export const metadata: Metadata = {
  title: 'Auth / Sign Up'
};

export default async function SignUpPage() {
  const authorized = await isAuthorized();

  if (authorized) redirect(PAGES.MY_PROFILE);

  return <SignUpForm />;
}
