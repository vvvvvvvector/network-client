import { FC, useState, useRef, useEffect } from 'react';
import { ChevronLeft, SendHorizontal } from 'lucide-react';
import Link from 'next/link';

import { Chat as TChat, Message } from '@/lib/types';

import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { Avatar } from '@/components/avatar';

import { ICON_INSIDE_BUTTON_SIZE, PAGES } from '@/lib/constants';
import { cn, formatDate, formatTime } from '@/lib/utils';

import { useFrequentlyUsedHooks } from '@/hooks/use-frequently-used-hooks';
import { useFocus } from '@/hooks/use-focus';

import { SocketType } from '@/zustand/socket.store';

interface Props {
  chat: TChat;
  socket: SocketType;
}

export const Chat: FC<Props> = ({ chat, socket }) => {
  const [messageInputValue, setMessageInputValue] = useState('');
  const [messages, setMessages] = useState<Message[]>([]);

  const [friendOnline, setFriendOnline] = useState(false);
  const [friendTyping, setFriendTyping] = useState(false);

  const messageInputRef = useFocus<HTMLTextAreaElement>();

  const messagesListRef = useRef<HTMLUListElement>(null);
  const messagesListMountedFlag = useRef(false);

  const { router } = useFrequentlyUsedHooks();

  useEffect(() => {
    const onMessageReceive = (message: Message) => {
      setMessages((prev) => [...prev, message]);
    };

    const onUserConnection = (username: string) => {
      if (chat.friendUsername === username) setFriendOnline(true);
    };

    const onUserDisconnection = (username: string) => {
      if (chat.friendUsername === username) setFriendOnline(false);
    };

    socket.emit('is-friend-online', chat.friendUsername, (online: boolean) => {
      setFriendOnline(online);
    });

    socket.on('receive-message', onMessageReceive);

    socket.on('user-connected', onUserConnection);

    socket.on('user-disconnected', onUserDisconnection);

    return () => {
      socket.off('receive-message', onMessageReceive);

      socket.off('user-connected', onUserConnection);

      socket.off('user-disconnected', onUserDisconnection);
    };
  }, [socket.connected]);

  useEffect(() => {
    setMessages(chat.messages);

    messagesListMountedFlag.current = true;
  }, [chat]);

  // scroll ul to very bottom
  useEffect(() => {
    if (messagesListRef.current && messagesListMountedFlag.current) {
      messagesListRef.current.scrollTop = messagesListRef.current.scrollHeight;
    }
  }, [messagesListMountedFlag.current]);

  // scroll ul to very bottom when authorized user sends a message
  useEffect(() => {
    if (messages.length > 0 && messagesListRef.current) {
      const lastMessage = messages[messages.length - 1];

      if (lastMessage.sender.username === chat.authorizedUserUsername) {
        messagesListRef.current.scrollTop =
          messagesListRef.current.scrollHeight;
      }
    }
  }, [messages]);

  const onSendMessage = () => {
    socket.emit(
      'send-message',
      {
        chatId: chat.id,
        receiver: chat.friendUsername,
        content: messageInputValue.trim()
      },
      (message: Message) => {
        setMessages((prev) => [...prev, message]);
      }
    );

    setMessageInputValue('');
  };

  return (
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
          <div>
            {friendOnline ? (
              <div className='flex items-baseline justify-center gap-2'>
                <span className='inline-flex h-2 w-2 items-center justify-center rounded-full bg-emerald-400' />
                <span>{friendTyping ? 'typing...' : 'online'}</span>
              </div>
            ) : (
              <span>{`last seen ${formatDate(
                chat.friendLastSeen
              )} at ${formatTime(chat.friendLastSeen)}`}</span>
            )}
          </div>
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
            className='custom-scrollbar flex flex-col gap-3 overflow-y-scroll pr-1'
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
                  {message.sender.username !== chat.authorizedUserUsername && (
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
          className='min-h-full resize-none'
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
  );
};
