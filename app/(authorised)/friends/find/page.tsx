import { type Metadata } from 'next';
import { redirect } from 'next/navigation';

import { NetworkUsersList } from '@/components/friends/network-users-list';

import { isAuthorised } from '@/app/(auth)/api';
import { getNetworkUsersUsernames } from '@/app/(authorised)/friends/api';

import { PAGES } from '@/lib/constants';

interface Props {
  searchParams: {
    page: string;
    username?: string;
  };
}

export const metadata: Metadata = {
  title: 'Friends / Find'
};

export default async function FindPage({
  searchParams: { page, username }
}: Props) {
  const { signedInUserUsername } = await isAuthorised();

  if (!signedInUserUsername) redirect(PAGES.SIGN_IN);

  const data = await getNetworkUsersUsernames(page, username);

  return <NetworkUsersList data={data} />;
}
