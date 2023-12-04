import { FC, useState } from 'react';
import { Pencil, Trash2, Upload, Image } from 'lucide-react';

import { Switch } from '@/components/ui/switch';
import { Separator } from '@/components/ui/separator';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger
} from '@/components/ui/dropdown-menu';
import {
  Dialog,
  DialogContent,
  DialogClose,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger
} from '@/components/ui/dialog';
import { Avatar } from '@/components/avatar';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

import { useProfileActions } from '@/hooks/use-profile-actions';
import { useCommonActions } from '@/hooks/use-common-actions';
import { useFrequentlyUsedHooks } from '@/hooks/use-frequently-used-hooks';

import { AuthorisedUser } from '@/lib/types';
import { DROPDOWN_MENU_ICON_STYLES } from '@/lib/constants';
import { formatDate } from '@/lib/utils';

import { toogleAuthorizedUserEmailPrivacy } from '@/api/users';

export const AuthorisedProfile: FC<AuthorisedUser> = (user) => {
  const [open, setOpen] = useState(false);
  const [bio, setBio] = useState('');

  const { router } = useFrequentlyUsedHooks();

  const { openPhoto } = useCommonActions();

  const { updateBio, updateAvatar, uploadAvatar, deleteAvatar } =
    useProfileActions(setOpen);

  return (
    <div className='rounded-lg bg-background p-5'>
      <div className='flex items-center gap-5'>
        <DropdownMenu open={open} defaultOpen={open} onOpenChange={setOpen}>
          <DropdownMenuTrigger>
            <Avatar
              size='large'
              username={user.username}
              avatar={user.profile.avatar?.name}
            />
          </DropdownMenuTrigger>
          <DropdownMenuContent>
            {user.profile.avatar && (
              <DropdownMenuItem onClick={openPhoto(user.profile.avatar.name)}>
                <Image className={DROPDOWN_MENU_ICON_STYLES} />
                <span>{`Open photo`}</span>
              </DropdownMenuItem>
            )}
            <DropdownMenuItem onSelect={(e) => e.preventDefault()}>
              <input
                onChange={user.profile.avatar ? updateAvatar() : uploadAvatar()}
                id='avatar'
                type='file'
                accept='image/jpeg, image/png, image/jpg'
                hidden
              />

              <label
                htmlFor='avatar'
                className='flex cursor-pointer items-center'
              >
                {user.profile.avatar ? (
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
            {user.profile.avatar && (
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
        <div className='relative top-3 flex flex-col'>
          <span className='mb-4 text-2xl font-semibold'>{`${user.username}`}</span>
          <Dialog onOpenChange={() => setBio(user.profile.bio || '')}>
            <DialogTrigger>
              <span className='cursor-pointer'>{`bio: ${
                user.profile.bio ?? 'no bio yet 😔'
              }`}</span>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Edit bio</DialogTitle>
                <DialogDescription>
                  Make changes to your bio here. Click save when you're done.
                </DialogDescription>
              </DialogHeader>
              <div>
                <Input onChange={(e) => setBio(e.target.value)} value={bio} />
              </div>
              <DialogFooter>
                <DialogClose asChild>
                  <Button type='button' variant='secondary'>
                    Close
                  </Button>
                </DialogClose>
                <DialogClose asChild>
                  <Button onClick={updateBio(bio)}>
                    {bio ? 'Save' : 'Empty bio'}
                  </Button>
                </DialogClose>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>
      </div>
      <Separator className='mb-4 mt-4' />
      <ul className='flex flex-col gap-5'>
        <li>{`Your avatar likes: ${
          user.profile.avatar?.likes ?? 'no photo yet'
        } ❤️`}</li>
        <li>{`is profile activated: ${user.profile.isActivated}`}</li>
        <li>
          joined on:
          <time suppressHydrationWarning>
            {` ${formatDate(user.profile.createdAt)}`}
          </time>
        </li>
        <li>{`email: ${user.contacts.email.contact}`}</li>
        <li className='flex items-center gap-3'>
          <span>{`email privacy [${
            user.contacts.email.isPublic ? 'public' : 'private'
          }]`}</span>
          <div className='flex items-center gap-3'>
            <Switch
              checked={!user.contacts.email.isPublic}
              onCheckedChange={async () => {
                await toogleAuthorizedUserEmailPrivacy();

                router.replace(router.asPath);
              }}
            />
          </div>
        </li>
        <li>{`for instance only for authorised user profile info here...`}</li>
      </ul>
    </div>
  );
};
