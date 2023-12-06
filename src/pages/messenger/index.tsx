import useSWR from 'swr';
import { Loader2 } from 'lucide-react';

import { NextPageWithLayout } from '@/pages/_app';

import { CHATS_ROUTE, getAutorizedUserChats } from '@/api/chats';

import { Main } from '@/layouts/main';
import { Authorized } from '@/layouts/authorised';

import { Separator } from '@/components/ui/separator';
import { Avatar } from '@/components/avatar';

import { PAGES } from '@/lib/constants';
import { formatDate, formatTime } from '@/lib/utils';

import { useFrequentlyUsedHooks } from '@/hooks/use-frequently-used-hooks';

const Messenger: NextPageWithLayout = () => {
  const { router } = useFrequentlyUsedHooks();

  const { data: chats, isLoading } = useSWR(CHATS_ROUTE, getAutorizedUserChats);

  if (isLoading) {
    return (
      <div className='grid place-items-center rounded-lg bg-background p-20'>
        <Loader2 size={50} className='animate-spin' />
      </div>
    );
  }

  if (!chats) {
    return (
      <div className='rounded-lg bg-background p-5'>
        <p className='mb-7 mt-7 text-center leading-9'>
          Error while loading your chats data
          <br /> Please try again later
          <br /> <span className='text-4xl'>😭</span>
        </p>
      </div>
    );
  }

  return (
    <div className='rounded-lg bg-background'>
      <div className='p-5'>
        <span>Messenger</span>
        <Separator className='mt-5' />
      </div>
      {chats.length > 0 ? (
        <ul className='flex flex-col pb-5'>
          {chats.map((chat) => (
            <li
              key={chat.id}
              onClick={() =>
                router.push({
                  pathname: PAGES.MESSENGER_CHAT,
                  query: {
                    id: chat.id
                  }
                })
              }
              className='flex cursor-pointer items-center gap-5 px-5 py-3 transition-[background-color] hover:bg-neutral-200 dark:hover:bg-neutral-700'
            >
              <Avatar
                size='medium'
                username={chat.friendUsername}
                avatar={chat.friendAvatar || undefined}
              />
              <div className='flex w-full flex-col gap-5 overflow-hidden'>
                <div className='flex justify-between'>
                  <span className='font-bold'>{chat.friendUsername}</span>
                  <time>
                    {(chat.lastMessageSentAt &&
                      `${formatDate(chat.lastMessageSentAt)} / ${formatTime(
                        chat.lastMessageSentAt
                      )}`) ||
                      ''}
                  </time>
                </div>
                <span className='overflow-hidden text-ellipsis whitespace-nowrap'>
                  {chat.lastMessageContent ??
                    'There are no messages in this chat yet 😗'}
                </span>
              </div>
            </li>
          ))}
        </ul>
      ) : (
        <div className='rounded-lg bg-background px-5 pb-5'>
          <p className='mb-7 mt-7 text-center leading-9'>
            You have no chats yet 😭
          </p>
        </div>
      )}
    </div>
  );
};

Messenger.getLayout = (page) => (
  <Main title='Authorised / Messenger'>
    <Authorized>{page}</Authorized>
  </Main>
);

export default Messenger;
