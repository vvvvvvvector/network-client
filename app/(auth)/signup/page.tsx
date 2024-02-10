import { type Metadata } from 'next';
import { redirect } from 'next/navigation';
import { cookies } from 'next/headers';

import { SignUpForm } from '@/components/forms/signup-form';

import { checkAuthSchema } from '@/app/(auth)/page';

import { PAGES, TOKEN_NAME } from '@/lib/constants';

export const metadata: Metadata = {
  title: 'Auth / Sign Up'
};

export default async function SignUpPage() {
  const token = cookies().get(TOKEN_NAME)?.value;

  const res = await fetch(
    `${process.env.NEXT_PUBLIC_API_URL}/users/me/username`,
    {
      headers: {
        Authorization: `Bearer ${token}`
      }
    }
  );

  const authorized = checkAuthSchema.parse(await res.json());

  if (authorized) redirect(PAGES.MY_PROFILE);

  return <SignUpForm />;
}
