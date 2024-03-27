import { redirect } from 'next/navigation';

import { Friends } from '@/components/friends/friends';

import { isAuthorised } from '@/app/(auth)/api';
import { getMyFriends } from '@/app/(authorised)/friends/api';

import { PAGES } from '@/lib/constants';
import { capitalize } from '@/lib/utils';

interface Props {
  searchParams: {
    tab: 'all' | 'online';
  };
}

export function generateMetadata({ searchParams }: Props) {
  return {
    title: `Friend / ${capitalize(searchParams.tab)}`
  };
}

export default async function FriendsPage() {
  const { signedInUserUsername } = await isAuthorised();

  if (!signedInUserUsername) redirect(PAGES.SIGN_IN);

  const users = await getMyFriends();

  return <Friends users={users} />;
}
