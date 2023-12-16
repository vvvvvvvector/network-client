import { FC, PropsWithChildren } from 'react';
import useSWR from 'swr';
import { Loader2 } from 'lucide-react';

import { NextPageWithLayout } from '@/pages/_app';

import { CHATS_ROUTE, getAutorizedUserChats } from '@/api/chats';

import { ListOfChats } from '@/components/messenger/list-of-chats';
import { Separator } from '@/components/ui/separator';

import { Main } from '@/layouts/main';
import { Authorized } from '@/layouts/authorised';

const Messenger: NextPageWithLayout = () => {
  const { data, isLoading } = useSWR(CHATS_ROUTE, getAutorizedUserChats);

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
        <p className='text-center leading-9'>
          Error while loading your chats data
          <br /> Please try again later
          <br /> <span className='text-4xl'>😭</span>
        </p>
      </OnLoadingAndOnErrorLayout>
    );
  }

  return (
    <div className='rounded-lg bg-background'>
      <div className='p-5'>
        <span>Messenger</span>
        <Separator className='mt-5' />
      </div>
      <ListOfChats chats={data} />
    </div>
  );
};

Messenger.getLayout = (page) => (
  <Main title='Authorised / Messenger'>
    <Authorized>{page}</Authorized>
  </Main>
);

const OnLoadingAndOnErrorLayout: FC<PropsWithChildren> = ({ children }) => {
  return (
    <div className='rounded-lg bg-background'>
      <div className='grid place-items-center rounded-lg bg-background p-20'>
        {children}
      </div>
    </div>
  );
};

export default Messenger;
