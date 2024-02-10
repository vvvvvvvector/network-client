import { type Metadata } from 'next';
import { redirect } from 'next/navigation';
import { z } from 'zod';

import { SignInForm } from '@/components/forms/signin-form';

import { PAGES } from '@/lib/constants';

const schema = z.object({
  success: z.boolean()
});

export const metadata: Metadata = {
  title: 'Auth / Sign In'
};

export default async function SignInPage() {
  const res = await fetch(`${process.env.URL}/api/auth`, {
    method: 'GET'
  });

  const json = schema.parse(await res.json());

  console.log(json);

  if (json.success) {
    redirect(PAGES.MY_PROFILE);
  }

  return <SignInForm />;
}
