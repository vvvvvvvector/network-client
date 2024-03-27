"use client"

import { useEffect, useState } from 'react';

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger
} from '@/components/ui/dropdown-menu';
import { Separator } from '@/components/ui/separator';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';

import { Tooltip } from '@/components/tooltip';
import { Icons } from '@/components/icons';
import { Avatar } from '@/components/avatar';

import {
  DROPDOWN_MENU_ICON_STYLES,
  ICON_INSIDE_BUTTON_SIZE
} from '@/lib/constants';
import { formatDate, formatTime } from '@/lib/utils';
import type { NetworkUser } from '@/lib/types';

import { useRequestsActions } from '@/hooks/use-requests-actions';
import { useCommonActions } from '@/hooks/use-common-actions';

import { useSocketStore } from '@/zustand/socket.store';

export const FriendProfile = (
  user: Omit<NetworkUser, 'extendedFriendRequestStatus'>
) => {
  const [onlineStatus, setOnlineStatus] = useState<'online' | 'offline'>(
    'offline'
  );

  const { writeMessage, openPhoto } = useCommonActions();

  const { unfriend } = useRequestsActions();

  const { socket } = useSocketStore();

  useEffect(() => {
    socket.emit('is-friend-online', user.username, (online: boolean) => {
      setOnlineStatus(online ? 'online' : 'offline');
    });
  }, []);

  return (
    <div className='rounded-lg bg-background p-5'>
      <div className='relative flex items-center justify-between'>
        <div className='flex items-center gap-5'>
          <DropdownMenu>
            <DropdownMenuTrigger>
              <div className='relative'>
                <Avatar
                  size='large'
                  username={user.username}
                  avatar={user.profile.avatar?.name}
                />
                {onlineStatus === 'online' && (
                  <span className='absolute bottom-2 right-2 size-6 rounded-full border-[3px] border-background bg-emerald-400' />
                )}
              </div>
            </DropdownMenuTrigger>
            {user.profile.avatar && (
              <DropdownMenuContent>
                <DropdownMenuItem onClick={openPhoto(user.profile.avatar.name)}>
                  <Icons.photos className={DROPDOWN_MENU_ICON_STYLES} />
                  <span>Open photo</span>
                </DropdownMenuItem>
                <DropdownMenuItem>
                  <Icons.heart className={DROPDOWN_MENU_ICON_STYLES} />
                  <span>{`Like photo`}</span>
                </DropdownMenuItem>
              </DropdownMenuContent>
            )}
          </DropdownMenu>
          <div className='relative top-3 flex flex-col'>
            <span className='mb-4 text-2xl font-semibold'>{`${user.username}`}</span>
            <span>{`bio: ${user.profile.bio ?? 'no bio yet 😔'}`}</span>
          </div>
        </div>
        <div className='absolute -right-0 -top-0 flex gap-2'>
          {onlineStatus === 'online' && (
            <Badge className='bg-emerald-400'>{`Online 👋`}</Badge>
          )}
          <Badge>{`Friend 🎉`}</Badge>
        </div>
        <div className='flex items-center gap-4'>
          <Button onClick={writeMessage(user.username)}>Message</Button>
          <Tooltip side='bottom' text='Unfriend'>
            <Button
              onClick={unfriend(user.username)}
              variant='outline'
              size='icon'
            >
              <Icons.acceptUser className={ICON_INSIDE_BUTTON_SIZE} />
            </Button>
          </Tooltip>
        </div>
      </div>
      <Separator className='my-4' />
      <ul className='flex flex-col gap-5'>
        {onlineStatus === 'offline' && (
          <li>
            <time suppressHydrationWarning>
              {`last seen: ${formatDate(user.lastSeen)} at ${formatTime(
                user.lastSeen
              )}`}
            </time>
          </li>
        )}
        <li>{`avatar likes: ${
          user.profile.avatar?.likes ?? 'no photo yet'
        } ❤️`}</li>
        <li>{`is profile activated: ${user.profile.isActivated}`}</li>
        <li>
          joined on:
          <time suppressHydrationWarning>
            {` ${formatDate(user.profile.createdAt)}`}
          </time>
        </li>
        <li>{`email: ${
          user.contacts.email.isPublic ? user.contacts.email.contact : 'private'
        }`}</li>
        <li>{'for instance, only for friends content here...'}</li>
      </ul>
    </div>
  );
};
