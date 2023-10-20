import { FC } from 'react';
import { Heart, Image } from 'lucide-react';

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger
} from '@/components/ui/dropdown-menu';
import { Separator } from '@/components/ui/separator';
import { Avatar } from '@/components/avatar';

import { NetworkUserProfileProps } from '@/pages/[username]';

import { DROPDOWN_MENU_ICON_STYLES } from '@/lib/constants';

export const DefaultProfile: FC<NetworkUserProfileProps> = (user) => {
  return (
    <div className='rounded-lg bg-background p-5'>
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
        <div>
          <span className='text-2xl font-semibold'>{user.username}</span>
        </div>
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
