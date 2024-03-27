import { notFound, redirect } from 'next/navigation';

import { NetworkUserProfile } from '@/components/profiles/network-user-profile';

import { isAuthorised } from '@/app/(auth)/api';
import { getNetworkUserPubliclyAvailableData } from '@/app/(authorised)/[username]/api';

import { PAGES } from '@/lib/constants';
import { cache } from 'react';

const getNetworkUserData = cache(getNetworkUserPubliclyAvailableData);

interface Props {
  params: {
    username: string;
  };
}

export async function generateMetadata({ params }: Props) {
  const user = await getNetworkUserData(params.username);

  return {
    title: !('error' in user) ? user.username : 'Profile not found :('
  };
}

export default async function NetworkUserPage({ params }: Props) {
  const { signedInUserUsername } = await isAuthorised();

  if (!signedInUserUsername) redirect(PAGES.SIGN_IN);

  if (signedInUserUsername === params.username) redirect(PAGES.MY_PROFILE);

  const user = await getNetworkUserData(params.username);

  if ('error' in user) notFound();

  return <NetworkUserProfile user={user} />;
}
