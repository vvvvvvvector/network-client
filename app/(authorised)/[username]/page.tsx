import { type Metadata } from 'next';
import { redirect } from 'next/navigation';

import { isAuthorised } from '@/app/(auth)/api';

import { PAGES } from '@/lib/constants';

interface Props {
  params: {
    username: string;
  };
}

export const metadata: Metadata = {
  title: 'Authorised / Network User'
};

export default async function NetworkUserPage({ params }: Props) {
  const { signedInUserUsername } = await isAuthorised();

  if (!signedInUserUsername) redirect(PAGES.SIGN_IN);

  if (signedInUserUsername === params.username) redirect(PAGES.MY_PROFILE);

  return <div>hello owrold</div>;
}
