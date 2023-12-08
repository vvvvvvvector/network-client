import { Loader2 } from 'lucide-react';

import { NextPageWithLayout } from '@/pages/_app';

import { Main } from '@/layouts/main';
import { Authorized } from '@/layouts/authorised';

import { Chat } from '@/components/messenger/chat';

import { useFrequentlyUsedHooks } from '@/hooks/use-frequently-used-hooks';
import { useChat } from '@/hooks/use-chat';

import { useSocketStore } from '@/zustand/socket.store';

const Index: NextPageWithLayout = () => {
  const { router } = useFrequentlyUsedHooks();

  const { socket } = useSocketStore();

  const { data, isLoading } = useChat(router.query.id as string | undefined);

  if (isLoading) {
    return (
      <div className='flex h-[calc(100vh-3.5rem-0.8rem-0.8rem)] flex-col gap-2 rounded-lg bg-background p-4'>
        <div className='grid h-full w-full place-items-center'>
          <Loader2 size={50} className='animate-spin' />
        </div>
      </div>
    );
  }

  if (!data) {
    return (
      <div className='flex h-[calc(100vh-3.5rem-0.8rem-0.8rem)] flex-col gap-2 rounded-lg bg-background p-4'>
        <div className='grid h-full w-full place-items-center'>
          <p className='mb-7 mt-7 text-center leading-9'>
            Error while loading the chat data
            <br /> Please try again later
            <br /> <span className='text-4xl'>😭</span>
          </p>
        </div>
      </div>
    );
  }

  if (!socket) {
    return (
      <div className='flex h-[calc(100vh-3.5rem-0.8rem-0.8rem)] flex-col gap-2 rounded-lg bg-background p-4'>
        <div className='grid h-full w-full place-items-center'>
          <p className='mb-7 mt-7 text-center leading-9'>
            Something wrong with your connection
            <br /> Please try again later
            <br /> <span className='text-4xl'>😭</span>
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className='flex h-[calc(100vh-3.5rem-0.8rem-0.8rem)] flex-col gap-2 rounded-lg bg-background p-4'>
      <Chat chat={data} socket={socket} />
    </div>
  );
};

Index.getLayout = (page) => (
  <Main title='Messenger / Chat'>
    <Authorized>{page}</Authorized>
  </Main>
);

export default Index;
