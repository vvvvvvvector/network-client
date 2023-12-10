import { FC, PropsWithChildren } from 'react';
import { Loader2 } from 'lucide-react';

import { NextPageWithLayout } from '@/pages/_app';

import { Main } from '@/layouts/main';
import { Authorized } from '@/layouts/authorised';

import { Chat } from '@/components/messenger/chat';

import { useFrequentlyUsedHooks } from '@/hooks/use-frequently-used-hooks';
import { useChat } from '@/hooks/use-chat';

import { useSocketStore } from '@/zustand/socket.store';

const container_styles =
  'flex h-[calc(100vh-3.5rem-0.8rem-0.8rem)] flex-col gap-2 rounded-lg bg-background p-4';

const Index: NextPageWithLayout = () => {
  const { data, isLoading } = useChat(
    useFrequentlyUsedHooks()['router'].query.id as string | undefined
  );

  const { socket } = useSocketStore();

  if (isLoading) {
    return (
      <OnLoadingAndOnErrorLayout>
        <Loader2 size={50} className='animate-spin' />
      </OnLoadingAndOnErrorLayout>
    );
  }

  if (!data) {
    return (
      <OnLoadingAndOnErrorLayout>
        <p className='mb-7 mt-7 text-center leading-9'>
          Error while loading the chat data
          <br /> Please try again later
          <br /> <span className='text-4xl'>😭</span>
        </p>
      </OnLoadingAndOnErrorLayout>
    );
  }

  if (!socket) {
    return (
      <OnLoadingAndOnErrorLayout>
        <p className='mb-7 mt-7 text-center leading-9'>
          Something wrong with your connection
          <br /> Please try again later
          <br /> <span className='text-4xl'>😭</span>
        </p>
      </OnLoadingAndOnErrorLayout>
    );
  }

  return (
    <div className={container_styles}>
      <Chat chat={data} socket={socket} />
    </div>
  );
};

Index.getLayout = (page) => (
  <Main title='Messenger / Chat'>
    <Authorized>{page}</Authorized>
  </Main>
);

const OnLoadingAndOnErrorLayout: FC<PropsWithChildren> = ({ children }) => {
  return (
    <div className={container_styles}>
      <div className='grid h-full w-full place-items-center'>{children}</div>
    </div>
  );
};

export default Index;
