import type { FC } from 'react';
import { MessagesSquare, MoreHorizontal, UserMinus } from 'lucide-react';
import Link from 'next/link';

import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger
} from '@/components/ui/dropdown-menu';
import { Avatar } from '@/components/avatar';

import { useCommonActions } from '@/hooks/use-common-actions';
import { useRequestsActions } from '@/hooks/use-requests-actions';

import type { UserFromListOfUsers } from '@/lib/types';
import {
  DROPDOWN_MENU_ICON_STYLES,
  ICON_INSIDE_BUTTON_SIZE
} from '@/lib/constants';

interface Props {
  listType: 'all' | 'online';
  friends: UserFromListOfUsers[];
  connectionsInformation: {
    [username: string]: 'online' | 'offline';
  };
}

export const FriendsList: FC<Props> = ({
  friends,
  listType,
  connectionsInformation
}) => {
  const { unfriend } = useRequestsActions();

  const { writeMessage } = useCommonActions();

  const users =
    listType === 'all'
      ? friends
      : friends.filter(
          (user) => connectionsInformation[user.username] === 'online'
        );

  if (!users.length) {
    return (
      <span className='mb-7 mt-7 text-center'>
        {listType === 'all'
          ? "You don't have any friends yet."
          : 'None of your friends are online.'}
      </span>
    );
  }

  return (
    <ul className='flex flex-col gap-5'>
      {users.map((user) => (
        <li
          className='flex items-center justify-between py-2'
          key={user.username}
        >
          <div className='flex items-center gap-3'>
            <Link href={`/${user.username}`}>
              <div className='relative'>
                <Avatar
                  size='medium'
                  username={user.username}
                  avatar={user.profile.avatar?.name}
                />
                {connectionsInformation[user.username] === 'online' && (
                  <span className='absolute bottom-0 right-0 h-4 w-4 rounded-full border-[2px] border-background bg-emerald-400 transition-[background-color] group-hover:border-neutral-200 group-hover:dark:border-neutral-700' />
                )}
              </div>
            </Link>
            <Link href={`/${user.username}`}>
              <span className='cursor-pointer hover:underline'>
                {user.username}
              </span>
            </Link>
          </div>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant='ghost' size='icon'>
                <MoreHorizontal size={ICON_INSIDE_BUTTON_SIZE} />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent>
              <DropdownMenuItem onClick={writeMessage(user.username)}>
                <MessagesSquare className={DROPDOWN_MENU_ICON_STYLES} />
                <span>Write message</span>
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={unfriend(user.username)}>
                <UserMinus className={DROPDOWN_MENU_ICON_STYLES} />
                <span>Unfriend</span>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </li>
      ))}
    </ul>
  );
};
