import { FC, MouseEventHandler } from 'react';
import {
  Heart,
  Image,
  UserPlus,
  Check,
  X,
  Undo2,
  MoreHorizontal
} from 'lucide-react';

import { UserProfileProps } from '@/pages/[username]';

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger
} from '@/components/ui/dropdown-menu';
import { Separator } from '@/components/ui/separator';
import { Avatar } from '@/components/avatar';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tooltip } from '@/components/tooltip';

import { useFriendsActions } from '@/hooks/use-friends-actions';

import {
  DROPDOWN_MENU_ICON_STYLES,
  ICON_INSIDE_BUTTON_SIZE
} from '@/lib/constants';

import { FriendRequestStatus } from '@/lib/types';

const BUTTONS: Record<
  Exclude<FriendRequestStatus, 'friend'>,
  React.FC<{
    onClicks: Array<
      | ((e: React.MouseEvent<HTMLButtonElement, MouseEvent>) => Promise<void>)
      | ((e: React.MouseEvent<HTMLDivElement, MouseEvent>) => Promise<void>)
    >;
  }>
> = {
  none: ({ onClicks }) => (
    <>
      <Badge className='absolute -right-0 -top-0'>
        You haven't sent a friend request yet
      </Badge>
      <Tooltip side='bottom' text='Send a friend request'>
        <Button
          onClick={onClicks[0] as MouseEventHandler<HTMLButtonElement>}
          variant='outline'
        >
          <UserPlus size={ICON_INSIDE_BUTTON_SIZE} />
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
          <Undo2 size={ICON_INSIDE_BUTTON_SIZE} />
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
            <MoreHorizontal size={ICON_INSIDE_BUTTON_SIZE} />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent>
          <DropdownMenuItem
            onClick={onClicks[0] as MouseEventHandler<HTMLDivElement>}
          >
            <Check className={DROPDOWN_MENU_ICON_STYLES} />
            <span>Accept request</span>
          </DropdownMenuItem>
          <DropdownMenuItem
            onClick={onClicks[1] as MouseEventHandler<HTMLDivElement>}
          >
            <X className={DROPDOWN_MENU_ICON_STYLES} />
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
          <Check size={ICON_INSIDE_BUTTON_SIZE} />
        </Button>
      </Tooltip>
    </>
  )
};

export const DefaultProfile: FC<
  Omit<UserProfileProps['user'], 'friendRequestStatus'> & {
    friendRequestStatus: Exclude<FriendRequestStatus, 'friend'>;
  }
> = (user) => {
  const { send, cancel, accept, reject } = useFriendsActions();

  const ON_CLICKS = (type: Exclude<FriendRequestStatus, 'friend'>) => {
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
                avatar={user.profile?.avatar}
              />
            </DropdownMenuTrigger>
            {user.profile?.avatar && (
              <DropdownMenuContent>
                <DropdownMenuItem
                  onClick={() =>
                    (location.href = `${process.env.NEXT_PUBLIC_API_URL}/uploads/avatars/${user?.profile?.avatar}`)
                  }
                >
                  <Image className={DROPDOWN_MENU_ICON_STYLES} />
                  <span>Open photo</span>
                </DropdownMenuItem>
                <DropdownMenuItem>
                  <Heart className={DROPDOWN_MENU_ICON_STYLES} />
                  <span>Like photo</span>
                </DropdownMenuItem>
              </DropdownMenuContent>
            )}
          </DropdownMenu>
          <span className='text-2xl font-semibold'>{user.username}</span>
        </div>
        {BUTTONS[user.friendRequestStatus]({
          onClicks: ON_CLICKS(user.friendRequestStatus)(user.username)
        })}
      </div>
      <Separator className='mb-4 mt-4' />
      <ul className='flex flex-col gap-5'>
        <li>{`is profile activated: ${user.profile.isActivated}`}</li>
        <li>{`profile created at: ${new Date(user.profile.createdAt)}`}</li>
        <li>{`email: ${
          user.contacts.email.isPublic ? user.contacts.email.contact : 'private'
        }`}</li>
      </ul>
    </div>
  );
};
