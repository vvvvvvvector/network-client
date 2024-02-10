import { type Metadata } from 'next';
import { redirect } from 'next/navigation';
import { z } from 'zod';
import { cookies } from 'next/headers';

import { SignInForm } from '@/components/forms/signin-form';

import { PAGES, TOKEN_NAME } from '@/lib/constants';

export const metadata: Metadata = {
  title: 'Auth / Sign In'
};

export const checkAuthSchema = z
  .object({
    username: z.string().nullish()
  })
  .transform(({ username }) => (username ? true : false));

export default async function SignInPage() {
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

  return <SignInForm />;
}
