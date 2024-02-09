import { type MouseEventHandler } from 'react';

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger
} from '@/components/ui/dropdown-menu';
import { Separator } from '@/components/ui/separator';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';

import { Tooltip } from '@/components/tooltip';
import { Icons } from '@/components/icons';
import { Avatar } from '@/components/avatar';

import { useRequestsActions } from '@/hooks/use-requests-actions';
import { useCommonActions } from '@/hooks/use-common-actions';

import {
  DROPDOWN_MENU_ICON_STYLES,
  ICON_INSIDE_BUTTON_SIZE
} from '@/lib/constants';
import type { ExtendedFriendRequestStatus, NetworkUser } from '@/lib/types';
import { formatDate, formatTime } from '@/lib/utils';

const BUTTONS: Record<
  Exclude<ExtendedFriendRequestStatus, 'friend'>,
  ({
    onClicks
  }: {
    onClicks: Array<
      | ((e: React.MouseEvent<HTMLButtonElement, MouseEvent>) => Promise<void>)
      | ((e: React.MouseEvent<HTMLDivElement, MouseEvent>) => Promise<void>)
    >;
  }) => React.JSX.Element
> = {
  none: ({ onClicks }) => (
    <>
      <Badge className='absolute -right-0 -top-0'>
        You haven&apos;t sent a friend request yet
      </Badge>
      <Tooltip side='bottom' text='Send a friend request'>
        <Button
          onClick={onClicks[0] as MouseEventHandler<HTMLButtonElement>}
          variant='outline'
        >
          <Icons.addUser className={ICON_INSIDE_BUTTON_SIZE} />
        </Button>
      </Tooltip>
    </>
  ),
  'pending:receiver': ({ onClicks }) => (
    <>
      <Badge className='absolute -right-0 -top-0'>
        You have already sent a friend request to this user
      </Badge>
      <Tooltip side='bottom' text='Cancel request'>
        <Button
          onClick={onClicks[0] as MouseEventHandler<HTMLButtonElement>}
          variant='outline'
        >
          <Icons.undo className={ICON_INSIDE_BUTTON_SIZE} />
        </Button>
      </Tooltip>
    </>
  ),
  'pending:sender': ({ onClicks }) => (
    <>
      <Badge className='absolute -right-0 -top-0'>
        User have sent you a friend request!
      </Badge>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant='outline' size='icon'>
            <Icons.moreHorizontal className={ICON_INSIDE_BUTTON_SIZE} />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent>
          <DropdownMenuItem
            onClick={onClicks[0] as MouseEventHandler<HTMLDivElement>}
          >
            <Icons.accept className={DROPDOWN_MENU_ICON_STYLES} />
            <span>Accept request</span>
          </DropdownMenuItem>
          <DropdownMenuItem
            onClick={onClicks[1] as MouseEventHandler<HTMLDivElement>}
          >
            <Icons.reject className={DROPDOWN_MENU_ICON_STYLES} />
            <span>Reject request</span>
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </>
  ),
  'rejected:sender': ({ onClicks }) => (
    <>
      <Badge variant='destructive' className='absolute -right-0 -top-0'>
        You have rejected a friend request from this user
      </Badge>
      <Tooltip side='bottom' text='Add to friends'>
        <Button
          onClick={onClicks[0] as MouseEventHandler<HTMLButtonElement>}
          variant='outline'
        >
          <Icons.accept className={ICON_INSIDE_BUTTON_SIZE} />
        </Button>
      </Tooltip>
    </>
  )
};

export const DefaultProfile = (
  user: Omit<NetworkUser, 'extendedFriendRequestStatus'> & {
    extendedFriendRequestStatus: Exclude<ExtendedFriendRequestStatus, 'friend'>;
  }
) => {
  const { openPhoto } = useCommonActions();

  const { send, cancel, accept, reject } = useRequestsActions();

  const ON_CLICKS = (type: Exclude<ExtendedFriendRequestStatus, 'friend'>) => {
    return (username: string) => {
      switch (type) {
        case 'none':
          return [send(username)];
        case 'pending:receiver':
          return [cancel(username)];
        case 'pending:sender':
          return [
            accept<HTMLDivElement>(username),
            reject<HTMLDivElement>(username)
          ];
        case 'rejected:sender':
          return [accept(username)];
        default:
          const _: never = type; // eslint-disable-line
          throw 'Not all cases are covered';
      }
    };
  };

  return (
    <div className='rounded-lg bg-background p-5'>
      <div className='relative flex items-center justify-between'>
        <div className='flex items-center gap-5'>
          <DropdownMenu>
            <DropdownMenuTrigger>
              <Avatar
                size='large'
                username={user.username}
                avatar={user.profile.avatar?.name}
              />
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
        {BUTTONS[user.extendedFriendRequestStatus]({
          onClicks: ON_CLICKS(user.extendedFriendRequestStatus)(user.username)
        })}
      </div>
      <Separator className='my-4' />
      <ul className='flex flex-col gap-5'>
        <li>
          <time suppressHydrationWarning>
            {`last seen: ${formatDate(user.lastSeen)} at ${formatTime(
              user.lastSeen
            )}`}
          </time>
        </li>
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
      </ul>
    </div>
  );
};
