import { type PropsWithChildren } from 'react';
import { useSearchParams } from 'next/navigation';

import { type NextPageWithLayout } from '@/pages/_app';

import { Main } from '@/layouts/main';
import { Authorized } from '@/layouts/authorised';

import { Chat } from '@/components/messenger/chat';
import { useChat } from '@/hooks/use-chat';

import { Icons } from '@/components/icons';

const container_styles =
  'flex h-[calc(100vh-3.5rem-0.8rem-0.8rem)] flex-col gap-2 rounded-lg bg-background p-4';

const Index: NextPageWithLayout = () => {
  const searchParams = useSearchParams();

  const params = new URLSearchParams(searchParams?.toString());

  const { data, isLoading } = useChat(params.get('id'));

  if (isLoading) {
    return (
      <OnLoadingAndOnErrorLayout>
        <Icons.spinner size={50} className='animate-spin' />
      </OnLoadingAndOnErrorLayout>
    );
  }

  if (!data) {
    return (
      <OnLoadingAndOnErrorLayout>
        <p className='my-7 text-center leading-9'>
          Error while loading the chat data
          <br /> Please try again later
          <br /> <span className='text-4xl'>😭</span>
        </p>
      </OnLoadingAndOnErrorLayout>
    );
  }

  return (
    <div className={container_styles}>
      <Chat chat={data} />
    </div>
  );
};

Index.getLayout = (page) => (
  <Main title='Messenger / Chat'>
    <Authorized>{page}</Authorized>
  </Main>
);

const OnLoadingAndOnErrorLayout = ({ children }: PropsWithChildren) => {
  return (
    <div className={container_styles}>
      <div className='grid size-full place-items-center'>{children}</div>
    </div>
  );
};

export default Index;
