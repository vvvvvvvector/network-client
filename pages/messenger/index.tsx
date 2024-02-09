import { useState } from 'react';
import { type PropsWithChildren } from 'react';
import useSWR from 'swr';

import { type NextPageWithLayout } from '@/pages/_app';

import { CHATS_ROUTE, getAutorizedUserChats } from '@/api-calls/chats';

import { Separator } from '@/components/ui/separator';
import { Input } from '@/components/ui/input';

import { ListOfChats } from '@/components/messenger/list-of-chats';
import { Icons } from '@/components/icons';

import { Main } from '@/layouts/main';
import { Authorized } from '@/layouts/authorised';

import { useFocus } from '@/hooks/use-focus';

import type { ChatFromListOfChats } from '@/lib/types';

const Messenger: NextPageWithLayout = () => {
  const [search, setSearch] = useState('');

  const { data, isLoading } = useSWR(CHATS_ROUTE, getAutorizedUserChats);

  const inputRef = useFocus<HTMLInputElement>();

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
        <span className='flex items-center justify-start gap-5'>
          <Icons.search size={18} />
          <Input
            ref={inputRef}
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder='Search for a chat...'
            className='w-full max-w-md'
          />
        </span>
        <Separator className='mt-5' />
      </div>
      <ListOfChats
        chats={data}
        filterChats={(chats: ChatFromListOfChats[]) =>
          chats.filter((chat) =>
            chat.friendUsername
              .toLocaleLowerCase()
              .includes(search.trim().toLocaleLowerCase())
          )
        }
      />
    </div>
  );
};

Messenger.getLayout = (page) => (
  <Main title='Authorised / Messenger'>
    <Authorized>{page}</Authorized>
  </Main>
);

const OnLoadingAndOnErrorLayout = ({ children }: PropsWithChildren) => {
  return (
    <div className='rounded-lg bg-background'>
      <div className='grid place-items-center rounded-lg bg-background p-20'>
        {children}
      </div>
    </div>
  );
};

export default Messenger;
