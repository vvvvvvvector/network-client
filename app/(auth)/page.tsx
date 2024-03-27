import { type Metadata } from 'next';
import { redirect } from 'next/navigation';

import { SignInForm } from '@/components/forms/signin-form';

import { isAuthorised } from '@/app/(auth)/api';

import { PAGES } from '@/lib/constants';

export const metadata: Metadata = {
  title: 'Auth / Sign In'
};

export default async function SignInPage() {
  const { signedInUserUsername } = await isAuthorised();

  if (signedInUserUsername) redirect(PAGES.MY_PROFILE);

  return <SignInForm />;
}
