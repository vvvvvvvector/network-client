import { FC, useState, useEffect } from 'react';

import { Avatar } from '@/components/avatar';

import { ChatFromListOfChats } from '@/lib/types';
import { formatDate, formatTime } from '@/lib/utils';
import { PAGES } from '@/lib/constants';

import { useFrequentlyUsedHooks } from '@/hooks/use-frequently-used-hooks';

import { TSocket } from '@/zustand/socket.store';

interface Props {
  chats: ChatFromListOfChats[];
  socket: TSocket;
}

export const ListOfChats: FC<Props> = ({ chats, socket }) => {
  const [onlineUsers, setOnlineUsers] = useState<{
    [username: string]: boolean;
  }>(
    chats.reduce(
      (accumulator, currentValue) =>
        Object.assign(accumulator, {
          [currentValue.friendUsername]: false
        }),
      {}
    )
  );

  const { router } = useFrequentlyUsedHooks();

  useEffect(() => {
    const onUserConnection = (username: string) => {
      if (username in onlineUsers) {
        setOnlineUsers((onlineUsers) => ({
          ...onlineUsers,
          [username]: true
        }));
      }
    };

    const onUserDisconnection = (username: string) => {
      if (username in onlineUsers) {
        setOnlineUsers((onlineUsers) => ({
          ...onlineUsers,
          [username]: false
        }));
      }
    };

    socket.emit(
      'which-friends-in-messenger-online',
      Object.keys(onlineUsers),
      (onlineUsers) => {
        setOnlineUsers(onlineUsers);
      }
    );

    socket.on('network-user-online', onUserConnection);
    socket.on('network-user-offline', onUserDisconnection);

    return () => {
      socket.off('network-user-online', onUserConnection);
      socket.off('network-user-offline', onUserConnection);
    };
  }, []);

  if (!chats.length) {
    return (
      <div className='rounded-lg bg-background px-5 pb-5'>
        <p className='mb-7 mt-7 text-center leading-9'>
          You have no chats yet 😭
        </p>
      </div>
    );
  }

  return (
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
          className='group flex cursor-pointer items-center gap-5 px-5 py-3 transition-[background-color] hover:bg-neutral-200 dark:hover:bg-neutral-700'
        >
          <div className='relative'>
            <Avatar
              size='medium'
              username={chat.friendUsername}
              avatar={chat.friendAvatar || undefined}
            />
            {onlineUsers[chat.friendUsername] && (
              <span className='absolute bottom-0 right-0 h-4 w-4 rounded-full border-[2px] border-background bg-emerald-400 transition-[background-color] group-hover:border-neutral-200 group-hover:dark:border-neutral-700' />
            )}
          </div>
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
  );
};
