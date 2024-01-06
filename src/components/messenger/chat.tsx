import { useState, useRef, useEffect, useCallback, useReducer } from 'react';
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
import { LastSeen } from '@/components/messenger/last-seen';

import type { Chat as TChat, Message } from '@/lib/types';
import { ICON_INSIDE_BUTTON_SIZE, PAGES } from '@/lib/constants';
import { cn, formatDate, formatTime } from '@/lib/utils';

import { useFrequentlyUsedHooks } from '@/hooks/use-frequently-used-hooks';
import { useFocus } from '@/hooks/use-focus';

import { useSocketStore } from '@/zustand/socket.store';

type State = {
  messages: Message[];
  lastSeen: string;
  friendTyping: boolean;
  friendOnlineStatus: 'online' | 'offline';
};

type Action =
  | { type: 'SYNC_MESSAGES'; payload: Message[] }
  | { type: 'ADD_NEW_MESSAGE'; payload: Message }
  | { type: 'UPDATE_LAST_SEEN_DATE' }
  | { type: 'FRIEND_IS_ONLINE' }
  | { type: 'FRIEND_IS_OFFLINE' }
  | { type: 'FRIEND_IS_TYPING' }
  | { type: 'FRIEND_FINISHED_TYPING' };

const chatReducer = (state: State, action: Action) => {
  switch (action.type) {
    case 'SYNC_MESSAGES':
      return {
        ...state,
        messages: action.payload
      };
    case 'ADD_NEW_MESSAGE':
      return {
        ...state,
        messages: [...state.messages, action.payload]
      };
    case 'UPDATE_LAST_SEEN_DATE':
      return {
        ...state,
        lastSeen: new Date().toString()
      };
    case 'FRIEND_IS_ONLINE':
      return {
        ...state,
        friendOnlineStatus: 'online' as const
      };
    case 'FRIEND_IS_OFFLINE':
      return {
        ...state,
        friendOnlineStatus: 'offline' as const
      };
    case 'FRIEND_IS_TYPING':
      return {
        ...state,
        friendTyping: true
      };
    case 'FRIEND_FINISHED_TYPING':
      return {
        ...state,
        friendTyping: false
      };
    default:
      const _: never = action;
      throw 'Not all cases are covered';
  }
};

interface Props {
  chat: TChat;
}

export const Chat = ({ chat }: Props) => {
  const [messageInputValue, setMessageInputValue] = useState('');

  const [state, dispatch] = useReducer(chatReducer, {
    messages: [],
    lastSeen: chat.friendLastSeen, // not sure about setting props to a state, but it works well 🤔🤔🤔
    friendTyping: false,
    friendOnlineStatus: 'offline'
  });

  const wait = useCallback(
    debounce(() => {
      stopTyping();
    }, 7000),
    []
  );

  const messagesListRef = useRef<HTMLUListElement>(null);
  const messagesListMountedFlag = useRef(false);

  const messageInputRef = useFocus<HTMLTextAreaElement>();

  const { router } = useFrequentlyUsedHooks();

  const { socket } = useSocketStore();

  useEffect(() => {
    const onMessageReceive = (message: Message) => {
      dispatch({ type: 'ADD_NEW_MESSAGE', payload: message });
    };

    const onUserConnection = (username: string) => {
      if (chat.friendUsername === username) {
        dispatch({ type: 'FRIEND_IS_ONLINE' });
      }
    };

    const onUserDisconnection = (username: string) => {
      if (chat.friendUsername === username) {
        dispatch({ type: 'FRIEND_IS_OFFLINE' });

        dispatch({ type: 'UPDATE_LAST_SEEN_DATE' });
      }
    };

    const onFriendTyping = () => dispatch({ type: 'FRIEND_IS_TYPING' });

    const onFriendFinishedTyping = () =>
      dispatch({ type: 'FRIEND_FINISHED_TYPING' });

    socket.emit('is-friend-online', chat.friendUsername, (online: boolean) => {
      if (online) {
        dispatch({ type: 'FRIEND_IS_ONLINE' });
      } else {
        dispatch({ type: 'FRIEND_IS_OFFLINE' });
      }
    });

    socket.on('receive-private-message', onMessageReceive);

    socket.on('network-user-online', onUserConnection);
    socket.on('network-user-offline', onUserDisconnection);

    socket.on('typing', onFriendTyping);
    socket.on('typing-stop', onFriendFinishedTyping);

    return () => {
      socket.off('receive-private-message', onMessageReceive);

      socket.off('network-user-offline', onUserConnection);
      socket.off('network-user-offline', onUserDisconnection);

      socket.off('typing', onFriendTyping);
      socket.off('typing-stop', onFriendFinishedTyping);
    };
  }, []);

  useEffect(() => {
    dispatch({ type: 'SYNC_MESSAGES', payload: chat.messages }); // todo: without it there isn't ?sync between messages in db and state? and bugs appear. im not sure why i did it recently, im going to figure it out later

    messagesListMountedFlag.current = true;
  }, [chat]);

  // scroll ul to very bottom when a user opens a chat
  useEffect(() => {
    if (messagesListRef.current && messagesListMountedFlag.current) {
      messagesListRef.current.scrollTop = messagesListRef.current.scrollHeight;
    }
  }, [messagesListMountedFlag.current]);

  // scroll ul to very bottom when authorized user sends a message
  useEffect(() => {
    if (state.messages.length > 0 && messagesListRef.current) {
      const lastMessage = state.messages[state.messages.length - 1];

      if (lastMessage.sender.username === chat.authorizedUserUsername) {
        messagesListRef.current.scrollTop =
          messagesListRef.current.scrollHeight;
      }
    }
  }, [state.messages]);

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
      (message: Message) =>
        dispatch({ type: 'ADD_NEW_MESSAGE', payload: message })
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
            {state.friendOnlineStatus === 'online' ? (
              <div className='flex items-baseline justify-center gap-2'>
                {state.friendTyping ? (
                  <span className='flex items-baseline gap-[5px]'>
                    <span className='size-[3px] animate-friend-typing rounded-full bg-foreground' />
                    <span className='size-[3px] animate-friend-typing rounded-full bg-foreground delay-300' />
                    <span className='size-[3px] animate-friend-typing rounded-full bg-foreground delay-500' />
                    <span className='ml-1'>typing</span>
                  </span>
                ) : (
                  <span className='flex animate-slide items-baseline gap-2'>
                    <span className='inline-flex size-2 items-center justify-center rounded-full bg-emerald-400' />
                    <span>online</span>
                  </span>
                )}
              </div>
            ) : (
              <LastSeen lastSeen={state.lastSeen} />
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
      {state.messages.length > 0 ? (
        <div className='flex h-full flex-col justify-end overflow-y-hidden'>
          <ul
            ref={messagesListRef}
            className='custom-scrollbar flex flex-col gap-3 overflow-y-scroll pr-1'
          >
            {state.messages.map((message) => (
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
                  <time
                    className={cn('text-xs', {
                      'text-start':
                        message.sender.username === chat.friendUsername,
                      'text-end':
                        message.sender.username === chat.authorizedUserUsername
                    })}
                  >
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
          <p className='my-7 text-center leading-9'>
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
            const commandOrCtrlPlusEnter =
              (e.metaKey || e.ctrlKey) && e.key === 'Enter';

            if (commandOrCtrlPlusEnter && messageInputValue) {
              e.preventDefault();

              onSendMessage();
            }
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
