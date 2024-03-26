import { type Metadata } from 'next';
import { redirect } from 'next/navigation';

import { AuthorisedProfile } from '@/components/profiles/authorised-profile';

import { getAuthorisedUserData } from '@/app/(authorised)/profile/api';
import { isAuthorized } from '@/app/(auth)/api';

import { PAGES } from '@/lib/constants';

export const metadata: Metadata = {
  title: 'Authorised / My Profile'
};

export default async function ProfilePage() {
  const authorized = await isAuthorized();

  if (!authorized) redirect(PAGES.SIGN_IN);

  const user = await getAuthorisedUserData();

  return <AuthorisedProfile {...user} />;
}
