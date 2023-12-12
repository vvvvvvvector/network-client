import { FC, useState, useRef, useEffect, useCallback } from 'react';
import {
  ChevronLeft,
  MoreVertical,
  Paperclip,
  SendHorizontal
} from 'lucide-react';
import debounce from 'lodash.debounce';
import Link from 'next/link';

import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { Avatar } from '@/components/avatar';

import { Chat as TChat, Message } from '@/lib/types';
import { ICON_INSIDE_BUTTON_SIZE, PAGES } from '@/lib/constants';
import { cn, formatDate, formatTime } from '@/lib/utils';

import { useFrequentlyUsedHooks } from '@/hooks/use-frequently-used-hooks';
import { useFocus } from '@/hooks/use-focus';

import { TSocket } from '@/zustand/socket.store';

interface Props {
  chat: TChat;
  socket: TSocket;
}

export const Chat: FC<Props> = ({ chat, socket }) => {
  const [messageInputValue, setMessageInputValue] = useState('');

  const [messages, setMessages] = useState<Message[]>([]);

  const [friendTyping, setFriendTyping] = useState(false);
  const [friendOnlineStatus, setFriendOnlineStatus] = useState<
    'online' | 'offline'
  >('offline');

  const messagesListRef = useRef<HTMLUListElement>(null);
  const messagesListMountedFlag = useRef(false);

  const messageInputRef = useFocus<HTMLTextAreaElement>();

  const { router } = useFrequentlyUsedHooks();

  const wait = useCallback(
    debounce(() => {
      stopTyping();
    }, 7000),
    []
  );

  useEffect(() => {
    const onMessageReceive = (message: Message) => {
      setMessages((prev) => [...prev, message]);
    };

    const onUserConnection = (username: string) => {
      chat.friendUsername === username && setFriendOnlineStatus('online');
    };

    const onUserDisconnection = (username: string) => {
      chat.friendUsername === username && setFriendOnlineStatus('offline');
    };

    const onFriendTyping = () => setFriendTyping(true);

    const onFriendStopTyping = () => setFriendTyping(false);

    socket.emit(
      'is-friend-in-chat-online',
      chat.friendUsername,
      (online: boolean) => {
        setFriendOnlineStatus(online ? 'online' : 'offline');
      }
    );
    socket.on('receive-private-message', onMessageReceive);

    socket.on('network-user-online', onUserConnection);
    socket.on('network-user-offline', onUserDisconnection);

    socket.on('typing', onFriendTyping);
    socket.on('typing-stop', onFriendStopTyping);

    return () => {
      socket.off('receive-private-message', onMessageReceive);

      socket.off('network-user-offline', onUserConnection);
      socket.off('network-user-offline', onUserDisconnection);

      socket.off('typing', onFriendTyping);
      socket.off('typing-stop', onFriendStopTyping);
    };
  }, []);

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

  function stopTyping() {
    socket.emit('typing-stop', {
      to: chat.friendUsername
    });
  }

  const onSendMessage = () => {
    socket.emit(
      'send-private-message',
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

    stopTyping();
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
            <b>{`${chat.friendUsername}`}</b>
          </Link>
          <div>
            {friendOnlineStatus === 'online' ? (
              <div className='flex items-baseline justify-center gap-2'>
                {friendTyping ? (
                  <span className='flex items-baseline gap-[5px]'>
                    <span>typing</span>
                    <span className='animate-friend-typing h-[3px] w-[3px] rounded-full bg-foreground' />
                    <span className='animate-friend-typing h-[3px] w-[3px] rounded-full bg-foreground delay-300' />
                    <span className='animate-friend-typing h-[3px] w-[3px] rounded-full bg-foreground delay-500' />
                  </span>
                ) : (
                  <span className='animate-slide flex items-baseline gap-2'>
                    <span className='inline-flex h-2 w-2 items-center justify-center rounded-full bg-emerald-400' />
                    <span>online</span>
                  </span>
                )}
              </div>
            ) : (
              <span>
                {`last seen ${formatDate(chat.friendLastSeen)} at ${formatTime(
                  chat.friendLastSeen
                )}`}
              </span>
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
                className={cn(
                  'group inline-flex items-center justify-end gap-2',
                  {
                    'flex-row-reverse':
                      message.sender.username === chat.friendUsername
                  }
                )}
              >
                <Button
                  className='hidden group-hover:inline-flex group-focus:inline-flex'
                  size='icon'
                  variant='ghost'
                >
                  <MoreVertical size={ICON_INSIDE_BUTTON_SIZE} />
                </Button>
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
        <Button className='w-full max-w-[40px]' variant='ghost' size='icon'>
          <Paperclip size={ICON_INSIDE_BUTTON_SIZE} />
        </Button>
        <Textarea
          className='min-h-full resize-none'
          rows={1}
          placeholder='Write a message...'
          ref={messageInputRef}
          value={messageInputValue}
          onChange={(e) => {
            setMessageInputValue(e.target.value);

            socket.emit('typing', {
              to: chat.friendUsername
            });

            wait();
          }}
          onKeyDown={(e) => {
            const commandPlusEnter = e.metaKey && e.key === 'Enter';

            if (commandPlusEnter && messageInputValue) onSendMessage();
          }}
        />
        <Button
          className='w-full max-w-[40px]'
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
