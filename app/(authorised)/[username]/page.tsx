import { type Metadata } from 'next';
import { notFound, redirect } from 'next/navigation';

import { NetworkUserProfile } from '@/components/profiles/network-user-profile';

import { isAuthorised } from '@/app/(auth)/api';
import { getNetworkUserPubliclyAvailableData } from '@/app/(authorised)/[username]/api';

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

  const user = await getNetworkUserPubliclyAvailableData(params.username);

  if ('error' in user) notFound();

  return <NetworkUserProfile user={user} />;
}
