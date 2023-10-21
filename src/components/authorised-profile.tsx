import { FC } from 'react';
import { useState } from 'react';
import { Pencil, Trash2, Upload, Image } from 'lucide-react';

import { Separator } from '@/components/ui/separator';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger
} from '@/components/ui/dropdown-menu';
import { Avatar } from '@/components/avatar';

import { useAvatarActions } from '@/hooks/use-avatar-actions';

import { AuthorisedUser } from '@/lib/types';
import { DROPDOWN_MENU_ICON_STYLES } from '@/lib/constants';

export const AuthorisedProfile: FC<AuthorisedUser> = (me) => {
  const [open, setOpen] = useState(false);

  const { updateAvatar, uploadAvatar, deleteAvatar } =
    useAvatarActions(setOpen);

  const onClickOpenPhoto = () => {
    location.href = `${process.env.NEXT_PUBLIC_API_URL}/uploads/avatars/${me?.profile?.avatar}`;
  };

  return (
    <div className='rounded-lg bg-background p-5'>
      <div className='flex items-center gap-5'>
        <DropdownMenu open={open} defaultOpen={open} onOpenChange={setOpen}>
          <DropdownMenuTrigger>
            <Avatar
              size='large'
              username={me.username}
              avatar={me.profile?.avatar}
            />
          </DropdownMenuTrigger>
          <DropdownMenuContent>
            {me.profile?.avatar && (
              <DropdownMenuItem onClick={onClickOpenPhoto}>
                <Image className={DROPDOWN_MENU_ICON_STYLES} />
                <span>Open photo</span>
              </DropdownMenuItem>
            )}
            <DropdownMenuItem onSelect={(e) => e.preventDefault()}>
              <input
                onChange={me.profile?.avatar ? updateAvatar() : uploadAvatar()}
                id='avatar'
                type='file'
                accept='image/jpeg, image/png, image/jpg'
                hidden
              />

              <label
                htmlFor='avatar'
                className='flex cursor-pointer items-center'
              >
                {me.profile?.avatar ? (
                  <>
                    <Pencil className={DROPDOWN_MENU_ICON_STYLES} />
                    <span>Update photo</span>
                  </>
                ) : (
                  <>
                    <Upload className={DROPDOWN_MENU_ICON_STYLES} />
                    <span>Upload photo</span>
                  </>
                )}
              </label>
            </DropdownMenuItem>
            {me.profile?.avatar && (
              <DropdownMenuItem onClick={deleteAvatar()}>
                <Trash2
                  color='hsl(0 84.2% 60.2%)'
                  className={DROPDOWN_MENU_ICON_STYLES}
                />
                <span>Delete photo</span>
              </DropdownMenuItem>
            )}
          </DropdownMenuContent>
        </DropdownMenu>
        <span className='text-2xl font-semibold'>{`${me.username}`}</span>
      </div>
      <Separator className='mb-4 mt-4' />
      <ul className='flex flex-col gap-5'>
        <li>{`is profile activated: ${me.profile.isActivated}`}</li>
        <li>{`profile created at: ${new Date(me.profile.createdAt)}`}</li>
        <li>{`email: ${me.contacts.email.contact}`}</li>
        <li>{`is email public: ${
          me.contacts.email.isPublic ? 'True' : 'False'
        }`}</li>
        <li>{`for instance only for authorised user profile info here...`}</li>
      </ul>
    </div>
  );
};
