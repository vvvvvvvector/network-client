import useSWR from 'swr';
import { ChevronLeft, Loader2, SendHorizontal } from 'lucide-react';
import { useEffect, useRef, useState } from 'react';
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
import { cn, formatDate, formatTime } from '@/lib/utils';
import { Message } from '@/lib/types';

import { useSocketStore } from '@/zustand/socket.store';
import { useFocus } from '@/hooks/use-focus';

// IT ISN'T PRODUCTION CODE JUST TESTING

const Chat: NextPageWithLayout = () => {
  const { router } = useFrequentlyUsedHooks();

  const { socket } = useSocketStore();

  const textAreaRef = useFocus<HTMLTextAreaElement>();

  const ulRef = useRef<HTMLUListElement>(null);
  const isUlMounted = useRef(false);

  const id = router.query.id as string;

  const { data: chat, isLoading } = useSWR(
    id ? [CHATS_ROUTE, id] : null,
    ([url, id]) => getChatData(url, id)
  );

  const [input, setInput] = useState('');

  const [messages, setMessages] = useState<Message[]>([]);

  useEffect(() => {
    if (socket) {
      const onMessageReceive = (message: Message) => {
        setMessages((prev) => [...prev, message]);
      };

      socket?.on('receive-message', onMessageReceive);

      return () => {
        socket?.off('receive-message', onMessageReceive);
      };
    }
  }, [socket?.connected]);

  useEffect(() => {
    if (ulRef.current && isUlMounted.current) {
      ulRef.current.scrollTop = ulRef.current.scrollHeight;
    }
  }, [isUlMounted.current]);

  useEffect(() => {
    if (chat) {
      setMessages(chat.messages);

      isUlMounted.current = true;
    }
  }, [chat]);

  useEffect(() => {
    if (messages.length > 0) {
      const last = messages[messages.length - 1];

      if (last.sender.username === chat?.authorizedUserUsername) {
        ulRef.current!.scrollTop = ulRef.current!.scrollHeight;
      }
    }
  }, [messages]);

  if (!socket) {
    return (
      <div className='rounded-lg bg-background p-5'>
        <p className='mb-7 mt-7 text-center leading-9'>
          Something wrong with your connection
          <br /> Please try again later
          <br /> <span className='text-4xl'>😭</span>
        </p>
      </div>
    );
  }

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

  const onClickSendMessage = () => {
    socket.emit(
      'send-message',
      {
        chatId: chat.id,
        receiver: chat.friendUsername,
        content: input.trim()
      },
      (message: Message) => {
        setMessages((prev) => [...prev, message]);
      }
    );

    setInput('');
  };

  return (
    <div className='flex h-[calc(100vh-3.5rem-1.3rem-1.3rem)] flex-col gap-5 rounded-lg bg-background p-5'>
      <div>
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
      {messages.length > 0 ? (
        <div className='flex h-full flex-col justify-end overflow-y-hidden rounded-lg bg-neutral-100 dark:bg-[hsl(0,0%,9%)]'>
          <ul
            ref={ulRef}
            className='custom-scrollbar flex flex-col gap-3 overflow-y-scroll p-4'
          >
            {messages.map((message) => (
              <li
                key={message.id}
                className={cn({
                  'text-right':
                    message.sender.username === chat.authorizedUserUsername
                })}
              >
                <div className='inline-block w-full max-w-max rounded-md bg-neutral-200 p-3 dark:bg-[hsl(0,0%,7%)]'>
                  <div className='text-sm'>
                    <span className='font-bold'>
                      {`${
                        message.sender.username === chat.authorizedUserUsername
                          ? `You:`
                          : `${chat.friendUsername}:`
                      }`}
                    </span>
                    <br />
                    <br />
                    <p className='w-full whitespace-pre-wrap break-words'>
                      {message.content}
                    </p>
                    <br />
                    <time>
                      {`[${formatDate(message.createdAt)} / ${formatTime(
                        message.createdAt
                      )}]`}
                    </time>
                  </div>
                </div>
              </li>
            ))}
          </ul>
        </div>
      ) : (
        <div className='flex h-full flex-col items-center justify-center rounded-lg bg-neutral-100 dark:bg-neutral-900'>
          <p className='mb-7 mt-7 text-center leading-9'>
            No messages here yet... 😗
            <br /> Send a message to your friend first!
          </p>
        </div>
      )}
      <div className='flex gap-3'>
        <Textarea
          onKeyDown={(e) => {
            if ((e.metaKey || e.ctrlKey) && e.key === 'Enter' && input) {
              onClickSendMessage();
            }
          }}
          ref={textAreaRef}
          value={input}
          onChange={(e) => setInput(e.target.value)}
          className='min-h-[40px] resize-none'
          placeholder='Write a message...'
          rows={1}
        />
        <Button
          disabled={input === ''}
          onClick={onClickSendMessage}
          size='icon'
        >
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
