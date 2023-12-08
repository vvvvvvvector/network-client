import useSWR from 'swr';
import { Loader2 } from 'lucide-react';

import { NextPageWithLayout } from '@/pages/_app';

import { CHATS_ROUTE, getAutorizedUserChats } from '@/api/chats';

import { ListOfChats } from '@/components/messenger/list-of-chats';
import { Separator } from '@/components/ui/separator';

import { Main } from '@/layouts/main';
import { Authorized } from '@/layouts/authorised';

import { useSocketStore } from '@/zustand/socket.store';

const Messenger: NextPageWithLayout = () => {
  const { socket } = useSocketStore();

  const { data, isLoading } = useSWR(CHATS_ROUTE, getAutorizedUserChats);

  if (isLoading) {
    return (
      <div className='rounded-lg bg-background'>
        <div className='grid place-items-center rounded-lg bg-background p-20'>
          <Loader2 size={50} className='animate-spin' />
        </div>
      </div>
    );
  }

  if (!data) {
    return (
      <div className='rounded-lg bg-background'>
        <div className='grid place-items-center rounded-lg bg-background p-20'>
          <p className='text-center leading-9'>
            Error while loading your chats data
            <br /> Please try again later
            <br /> <span className='text-4xl'>😭</span>
          </p>
        </div>
      </div>
    );
  }

  if (!socket) {
    return (
      <div className='rounded-lg bg-background'>
        <div className='grid place-items-center rounded-lg bg-background p-20'>
          <p className='text-center leading-9'>
            Something wrong with your connection
            <br /> Please try again later
            <br /> <span className='text-4xl'>😭</span>
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className='rounded-lg bg-background'>
      <div className='p-5'>
        <span>Messenger</span>
        <Separator className='mt-5' />
      </div>
      <ListOfChats chats={data} socket={socket} />
    </div>
  );
};

Messenger.getLayout = (page) => (
  <Main title='Authorised / Messenger'>
    <Authorized>{page}</Authorized>
  </Main>
);

export default Messenger;
