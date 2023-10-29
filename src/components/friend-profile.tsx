import { FC } from 'react';
import { Heart, Image, UserCheck } from 'lucide-react';

import { UserProfileProps } from '@/pages/[username]';

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger
} from '@/components/ui/dropdown-menu';
import { Separator } from '@/components/ui/separator';
import { Badge } from '@/components/ui/badge';
import { Avatar } from '@/components/avatar';
import { Button } from '@/components/ui/button';
import { Tooltip } from '@/components/tooltip';

import {
  DROPDOWN_MENU_ICON_STYLES,
  ICON_INSIDE_BUTTON_SIZE
} from '@/lib/constants';
import { formatDate } from '@/lib/utils';

import { useRequestsActions } from '@/hooks/use-requests-actions';
import { useCommonActions } from '@/hooks/use-common-actions';

export const FriendProfile: FC<
  Omit<UserProfileProps['user'], 'extendedFriendRequestStatus'>
> = (user) => {
  const { writeMessage } = useCommonActions();
  const { unfriend } = useRequestsActions();

  const onClickOpenPhoto = () => {
    location.href = `${process.env.NEXT_PUBLIC_API_URL}/uploads/avatars/${user.profile.avatar}`;
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
                avatar={user.profile.avatar}
              />
            </DropdownMenuTrigger>
            {user.profile.avatar && (
              <DropdownMenuContent>
                <DropdownMenuItem onClick={onClickOpenPhoto}>
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
          <div className='relative top-3 flex flex-col'>
            <span className='mb-4 text-2xl font-semibold'>{`${user.username}`}</span>
            <span>{`bio: ${user.profile.bio ?? 'no bio yet'}`}</span>
          </div>
        </div>
        <Badge className='absolute -right-0 -top-0'>{`Friend 🎉`}</Badge>
        <div className='flex items-center gap-4'>
          <Button onClick={writeMessage(user.username)}>Message</Button>
          <Tooltip side='bottom' text='Unfriend'>
            <Button
              onClick={unfriend(user.username)}
              variant='outline'
              size='icon'
            >
              <UserCheck size={ICON_INSIDE_BUTTON_SIZE} />
            </Button>
          </Tooltip>
        </div>
      </div>
      <Separator className='mb-4 mt-4' />
      <ul className='flex flex-col gap-5'>
        <li>{`is profile activated: ${user.profile.isActivated}`}</li>
        <li>{`joined on: ${formatDate(user.profile.createdAt)}`}</li>
        <li>{`email: ${
          user.contacts.email.isPublic ? user.contacts.email.contact : 'private'
        }`}</li>
        <li>{'for instance, only for friends content here...'}</li>
      </ul>
    </div>
  );
};
