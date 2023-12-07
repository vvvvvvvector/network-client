import { ChevronLeft, Loader2, SendHorizontal } from 'lucide-react';
import { useEffect, useRef, useState } from 'react';
import Link from 'next/link';

import { NextPageWithLayout } from '@/pages/_app';

import { Button } from '@/components/ui/button';
import { Avatar } from '@/components/avatar';
import { Textarea } from '@/components/ui/textarea';

import { Main } from '@/layouts/main';
import { Authorized } from '@/layouts/authorised';

import { useFrequentlyUsedHooks } from '@/hooks/use-frequently-used-hooks';
import { useFocus } from '@/hooks/use-focus';
import { useChat } from '@/hooks/use-chat';

import { ICON_INSIDE_BUTTON_SIZE, PAGES } from '@/lib/constants';
import { cn, formatDate, formatTime } from '@/lib/utils';
import { Message } from '@/lib/types';

import { useSocketStore } from '@/zustand/socket.store';

const Chat: NextPageWithLayout = () => {
  const [messageInputValue, setMessageInputValue] = useState('');
  const [messages, setMessages] = useState<Message[]>([]);

  const { router } = useFrequentlyUsedHooks();

  const { socket } = useSocketStore();

  const messageInputRef = useFocus<HTMLTextAreaElement>();

  const { chat, loading, error } = useChat(
    router.query.id as string | undefined
  );

  const messagesListRef = useRef<HTMLUListElement>(null);
  const messagesListMountedFlag = useRef(false);

  useEffect(() => {
    if (socket) {
      const onMessageReceive = (message: Message) => {
        setMessages((prev) => [...prev, message]);
      };

      socket.on('receive-message', onMessageReceive);

      return () => {
        socket.off('receive-message', onMessageReceive);
      };
    }
  }, [socket?.connected]);

  // we need to wait for the data to load
  useEffect(() => {
    if (chat) {
      setMessages(chat.messages);

      messagesListMountedFlag.current = true;
    }
  }, [chat]);

  // scroll ul to very bottom
  useEffect(() => {
    if (messagesListRef.current && messagesListMountedFlag.current) {
      messagesListRef.current.scrollTop = messagesListRef.current.scrollHeight;
    }
  }, [messagesListMountedFlag.current]);

  // scroll ul to very bottom when auth user sends a message
  useEffect(() => {
    if (messages.length > 0) {
      const lastMessage = messages[messages.length - 1];

      if (lastMessage.sender.username === chat?.authorizedUserUsername) {
        messagesListRef.current!.scrollTop =
          messagesListRef.current!.scrollHeight;
      }
    }
  }, [messages]);

  const onSendMessage = () => {
    socket!.emit(
      'send-message',
      {
        chatId: chat!.id,
        receiver: chat!.friendUsername,
        content: messageInputValue.trim()
      },
      (message: Message) => {
        setMessages((prev) => [...prev, message]);
      }
    );

    setMessageInputValue('');
  };

  return (
    <div className='flex h-[calc(100vh-3.5rem-1.3rem-1.3rem)] flex-col gap-5 rounded-lg bg-background p-5'>
      {!socket && (
        <div className='grid h-full w-full place-items-center'>
          <p className='mb-7 mt-7 text-center leading-9'>
            Something wrong with your connection
            <br /> Please try again later
            <br /> <span className='text-4xl'>😭</span>
          </p>
        </div>
      )}
      {error && (
        <div className='grid h-full w-full place-items-center'>
          <p className='mb-7 mt-7 text-center leading-9'>
            Error while loading the chat data
            <br /> Please try again later
            <br /> <span className='text-4xl'>😭</span>
          </p>
        </div>
      )}
      {loading && (
        <div className='grid h-full w-full place-items-center'>
          <Loader2 size={50} className='animate-spin' />
        </div>
      )}
      {chat && !error && (
        <>
          <div className='flex items-center justify-between'>
            <Button
              size='icon'
              variant='outline'
              onClick={() => router.push(PAGES.MESSENGER)}
            >
              <ChevronLeft className='h-4 w-4' />
            </Button>
            <div className='flex flex-col gap-1 text-center text-sm'>
              <Link href={`/${chat.friendUsername}`} target='_blank'>
                <span className='font-bold'>{`${chat.friendUsername}`}</span>
              </Link>
              <span>{`last seen ${formatDate(
                chat.friendLastSeen
              )} at ${formatTime(chat.friendLastSeen)}`}</span>
            </div>
            <Link href={`/${chat.friendUsername}`} target='_blank'>
              <Avatar
                size='small'
                username={`${chat.friendUsername}`}
                avatar={chat.friendAvatar || undefined}
              />
            </Link>
          </div>
          {messages.length > 0 ? (
            <div className='flex h-full flex-col justify-end overflow-y-hidden'>
              <ul
                ref={messagesListRef}
                className='custom-scrollbar flex flex-col gap-3 overflow-y-scroll px-2'
              >
                {messages.map((message) => (
                  <li
                    key={message.id}
                    className={cn({
                      'text-end':
                        message.sender.username === chat.authorizedUserUsername
                    })}
                  >
                    <div className='inline-flex w-[84%] max-w-max flex-col gap-3 rounded-xl bg-neutral-100 p-3 text-sm dark:bg-[hsl(0,0%,13%)]'>
                      {message.sender.username !==
                        chat.authorizedUserUsername && (
                        <span className='font-semibold underline'>
                          {chat.friendUsername}
                        </span>
                      )}
                      <p className='whitespace-pre-wrap break-words text-start'>
                        {message.content}
                      </p>
                      <time className='text-xs'>
                        {`[${formatDate(message.createdAt)} / ${formatTime(
                          message.createdAt
                        )}]`}
                      </time>
                    </div>
                  </li>
                ))}
              </ul>
            </div>
          ) : (
            <div className='grid h-full w-full place-items-center'>
              <p className='mb-7 mt-7 text-center leading-9'>
                No messages here yet... 😗
                <br /> Send a message to your friend first!
              </p>
            </div>
          )}
          <div className='flex gap-3'>
            <Textarea
              className='min-h-[40px] resize-none'
              rows={1}
              placeholder='Write a message...'
              ref={messageInputRef}
              value={messageInputValue}
              onChange={(e) => {
                setMessageInputValue(e.target.value);
              }}
              onKeyDown={(e) => {
                const commandPlusEnter = e.metaKey && e.key === 'Enter';

                if (commandPlusEnter && messageInputValue) onSendMessage();
              }}
            />
            <Button
              size='icon'
              disabled={messageInputValue.length === 0}
              onClick={onSendMessage}
            >
              <SendHorizontal size={ICON_INSIDE_BUTTON_SIZE} />
            </Button>
          </div>
        </>
      )}
    </div>
  );
};

Chat.getLayout = (page) => (
  <Main title='Messenger / Chat'>
    <Authorized>{page}</Authorized>
  </Main>
);

export default Chat;
