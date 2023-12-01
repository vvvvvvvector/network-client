import useSWR from 'swr';
import { ChevronLeft, Loader2, SendHorizontal } from 'lucide-react';
import Link from 'next/link';

import { NextPageWithLayout } from '@/pages/_app';

import { Separator } from '@/components/ui/separator';
import { Button } from '@/components/ui/button';
import { Avatar } from '@/components/avatar';
import { Textarea } from '@/components/ui/textarea';

import { Main } from '@/layouts/main';
import { Authorized } from '@/layouts/authorised';

import { useFrequentlyUsedHooks } from '@/hooks/use-frequently-used-hooks';

import { CHATS_ROUTE, getChatData } from '@/api/chats';

import { ICON_INSIDE_BUTTON_SIZE, PAGES } from '@/lib/constants';
import { cn } from '@/lib/utils';

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
    <div className='flex flex-col gap-5 rounded-lg bg-background p-5'>
      <div className='w-full'>
        <div className='flex items-center justify-between'>
          <Button
            onClick={() => router.push(PAGES.MESSENGER)}
            variant='outline'
            size='icon'
          >
            <ChevronLeft className='h-4 w-4' />
          </Button>
          <Link href={`/${chat.friendUsername}`} target='_blank'>
            <span>{`${chat.friendUsername}`}</span>
          </Link>
          <Link href={`/${chat.friendUsername}`} target='_blank'>
            <Avatar
              size='small'
              username={`${chat.friendUsername}`}
              avatar={chat.friendAvatar || undefined}
            />
          </Link>
        </div>
        <Separator className='mt-5' />
      </div>
      <div className='rounded-lg bg-neutral-100'>
        {chat.messages.length > 0 ? (
          <ul className='flex flex-col gap-10 p-4'>
            {chat.messages.map((message) => (
              <li
                className={cn({
                  'text-right':
                    message.sender.username === chat.authorizedUserUsername
                })}
                key={message.id}
              >
                <div>
                  <span>
                    {`${
                      message.sender.username === chat.authorizedUserUsername
                        ? `You: ${message.content}`
                        : `${chat.friendUsername}: ${message.content}`
                    } [${message.createdAt}]`}
                  </span>
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
      <div className='flex gap-3'>
        <Textarea
          className='min-h-[40px] resize-none'
          placeholder='Write a message...'
          rows={1}
        />
        <Button size='icon'>
          <SendHorizontal size={ICON_INSIDE_BUTTON_SIZE} />
        </Button>
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
