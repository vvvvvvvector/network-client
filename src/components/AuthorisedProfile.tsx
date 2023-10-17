import { FC } from 'react';
import { useSWRConfig } from 'swr';
import { ChangeEvent, useState } from 'react';
import axios from 'axios';
import { Pencil, Trash2, Upload, Image } from 'lucide-react';

import { Separator } from '@/components/ui/separator';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Avatar } from '@/components/Avatar';

import { useCombain } from '@/hooks/useCombain';

import { deleteAvatar, updateAvatar, uploadAvatar } from '@/api/profiles';

import { AuthorisedUser } from '@/lib/types';

export const AuthorisedProfile: FC<AuthorisedUser> = (me) => {
  const [open, setOpen] = useState(false);

  const { toast, router } = useCombain();

  const { mutate } = useSWRConfig();

  const onAvatarUpdate = () => {
    return async (e: ChangeEvent<HTMLInputElement>) => {
      try {
        if (e.target.files instanceof FileList) {
          await updateAvatar(e.target.files[0]);
        }

        mutate('/users/me/username-avatar');

        toast({
          description: 'An avatar was successfully updated.',
        });

        e.target.value = '';

        router.replace(router.asPath, undefined, { scroll: false });

        setOpen(false);
      } catch (error) {
        if (axios.isAxiosError(error)) {
          toast({
            variant: 'destructive',
            description: `${error.response?.data.message}`,
          });
        }
      }
    };
  };

  const onAvatarUpload = () => {
    return async (e: ChangeEvent<HTMLInputElement>) => {
      try {
        if (e.target.files instanceof FileList) {
          await uploadAvatar(e.target.files[0]);
        }

        mutate('/users/me/username-avatar');

        toast({
          description: 'An avatar was successfully uploaded.',
        });

        e.target.value = '';

        router.replace(router.asPath, undefined, { scroll: false });

        setOpen(false);
      } catch (error) {
        if (axios.isAxiosError(error)) {
          toast({
            variant: 'destructive',
            description: `${error.response?.data.message}`,
          });
        }
      }
    };
  };

  const onAvatarDelete = () => {
    return async () => {
      try {
        await deleteAvatar();

        mutate('/users/me/username-avatar');

        toast({
          description: 'An avatar was successfully deleted.',
        });

        router.replace(router.asPath, undefined, { scroll: false });
      } catch (error) {
        if (axios.isAxiosError(error)) {
          toast({
            variant: 'destructive',
            description: `${error.response?.data.message}`,
          });
        }
      }
    };
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
              <DropdownMenuItem
                onClick={() =>
                  (location.href = `${process.env.NEXT_PUBLIC_API_URL}/uploads/avatars/${me?.profile?.avatar}`)
                }
              >
                <Image className='mr-2 h-4 w-4' />
                <span>Open photo</span>
              </DropdownMenuItem>
            )}
            <DropdownMenuItem onSelect={(e) => e.preventDefault()}>
              <input
                onChange={
                  me.profile?.avatar ? onAvatarUpdate() : onAvatarUpload()
                }
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
                    <Pencil className='mr-2 h-4 w-4' />
                    <span>Update photo</span>
                  </>
                ) : (
                  <>
                    <Upload className='mr-2 h-4 w-4' />
                    <span>Upload photo</span>
                  </>
                )}
              </label>
            </DropdownMenuItem>
            {me.profile?.avatar && (
              <DropdownMenuItem onClick={onAvatarDelete()}>
                <Trash2 color='hsl(0 84.2% 60.2%)' className='mr-2 h-4 w-4' />
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
