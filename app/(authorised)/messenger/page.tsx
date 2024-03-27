import { type Metadata } from 'next';
import { redirect } from 'next/navigation';

import { Separator } from '@/components/ui/separator';

import { ListOfChats } from '@/components/messenger/list-of-chats';

import { isAuthorised } from '@/app/(auth)/api';
import { getAutorisedUserChats } from '@/app/(authorised)/messenger/api';

import { PAGES } from '@/lib/constants';

export const metadata: Metadata = {
  title: 'Authorised / Messenger'
};

export default async function MessengerPage() {
  const { signedInUserUsername } = await isAuthorised();

  if (!signedInUserUsername) redirect(PAGES.SIGN_IN);

  const chats = await getAutorisedUserChats();

  return (
    <div className='rounded-lg bg-background'>
      <div className='p-5'>
        <span>{`Chats [${chats.length}]`}</span>
        <Separator className='mt-5' />
      </div>
      <ListOfChats chats={chats} />
    </div>
  );
}
