import { FC } from 'react';
import { Heart, Image } from 'lucide-react';

import { NetworkUserProfileProps } from '@/pages/[username]';

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Separator } from '@/components/ui/separator';
import { Badge } from '@/components/ui/badge';
import { Avatar } from '@/components/Avatar';

export const FriendProfile: FC<NetworkUserProfileProps> = (user) => {
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
                <Image className='mr-2 h-4 w-4' />
                <span>Open photo</span>
              </DropdownMenuItem>
              <DropdownMenuItem>
                <Heart className='mr-2 h-4 w-4' />
                <span>Like photo</span>
              </DropdownMenuItem>
            </DropdownMenuContent>
          )}
        </DropdownMenu>
        <div>
          <span className='text-2xl font-semibold'>{user.username}</span>
        </div>
        <Badge>Friend</Badge>
      </div>
      <Separator className='mb-4 mt-4' />
      <ul className='flex flex-col gap-5'>
        <li>{`is profile activated: ${user.profile.isActivated}`}</li>
        <li>{`profile created at: ${new Date(user.profile.createdAt)}`}</li>
        <li>{`email: ${
          user.contacts.email.isPublic ? user.contacts.email.contact : 'private'
        }`}</li>
        <li>{'for instance, only for friends content here...'}</li>
      </ul>
    </div>
  );
};
