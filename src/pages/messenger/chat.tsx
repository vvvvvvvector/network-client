import useSWR from 'swr';
import { ChevronLeft, Loader2 } from 'lucide-react';
import Link from 'next/link';

import { NextPageWithLayout } from '@/pages/_app';

import { Separator } from '@/components/ui/separator';
import { Button } from '@/components/ui/button';
import { Avatar } from '@/components/avatar';

import { Main } from '@/layouts/main';
import { Authorized } from '@/layouts/authorised';

import { useFrequentlyUsedHooks } from '@/hooks/use-frequently-used-hooks';

import { CHATS_ROUTE, getChatData } from '@/api/chats';

import { PAGES } from '@/lib/constants';

const Chat: NextPageWithLayout = () => {
  const { router } = useFrequentlyUsedHooks();

  const id = router.query.id as string;

  const { data: chat, isLoading } = useSWR([CHATS_ROUTE, id], ([url, id]) =>
    getChatData(url, id)
  );

  if (isLoading) {
    return (
      <div className='grid place-items-center rounded-lg bg-background p-20'>
        <Loader2 size={50} className='animate-spin' />
      </div>
    );
  }

  if (!chat) {
    return (
      <div className='rounded-lg bg-background p-5'>
        <p className='mb-7 mt-7 text-center leading-9'>
          Error while loading the chat data
          <br /> Please try again later
          <br /> <span className='text-4xl'>😭</span>
        </p>
      </div>
    );
  }

  return (
    <div className='rounded-lg bg-background p-5'>
      <div className='w-full'>
        <div className='flex items-center justify-between'>
          <Button
            onClick={() => router.push(PAGES.MESSENGER)}
            variant='outline'
            size='icon'
          >
            <ChevronLeft className='h-4 w-4' />
          </Button>
          <Link href={`/friendUsername`} target='_blank'>
            <span>{'friendUsername'}</span>
          </Link>
          <Link href={`/friendUsername`} target='_blank'>
            <Avatar size='small' username={'friendUsername'} avatar='' />
          </Link>
        </div>
        <Separator className='mb-5 mt-5' />
      </div>
      <div className='rounded-lg bg-neutral-100'>
        {chat.messages.length > 0 ? (
          <ul>
            {chat.messages.map((message) => (
              <li key={message.id}>
                <div className='flex justify-between'>
                  <span>
                    {message.sender.username === chat.authorizedUserUsername
                      ? `You: ${message.content}`
                      : `Friend: ${message.content}`}
                  </span>
                  <span>{message.createdAt}</span>
                </div>
              </li>
            ))}
          </ul>
        ) : (
          <div className='p-5'>
            <p className='mb-7 mt-7 text-center leading-9'>
              No messages here yet... 😗
              <br /> Send a message to your friend first!
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

Chat.getLayout = (page) => (
  <Main title='Messenger / Chat'>
    <Authorized>{page}</Authorized>
  </Main>
);

export default Chat;
