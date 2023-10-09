import { useSWRConfig } from 'swr';
import { ChangeEvent, useState } from 'react';
import axios from 'axios';
import { GetServerSideProps, GetServerSidePropsContext } from 'next';
import { Pencil, Trash2, Upload, Image } from 'lucide-react';

import { NextPageWithLayout } from './_app';

import { Main } from '@/layouts/Main';
import { Authorized } from '@/layouts/Authorised';

import { Separator } from '@/components/ui/separator';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';

import { isAuthorized } from '@/lib/auth';
import { avatarSource, getFirstLetterInUpperCase } from '@/lib/utils';
import { useDefault } from '@/lib/hooks';

import { getMyData } from '@/api/users';
import { deleteAvatar, updateAvatar, uploadAvatar } from '@/api/profiles';

interface Props {
  me: {
    id: number;
    username: string;
    profile: {
      uuid: string;
      isActivated: boolean;
      createdAt: string;
      avatar?: string;
    };
    contacts: {
      id: number;
      email: {
        id: number;
        contact: string;
        isPublic: boolean;
      };
    };
  };
}

const Profile: NextPageWithLayout<Props> = ({ me }) => {
  const [open, setOpen] = useState(false);

  const { toast, router } = useDefault();

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
    <div className='bg-white p-5 rounded-lg'>
      {me ? (
        <>
          <div className='flex gap-5 items-center'>
            <DropdownMenu open={open} defaultOpen={open} onOpenChange={setOpen}>
              <DropdownMenuTrigger>
                <Avatar className='w-36 h-36'>
                  <AvatarImage src={avatarSource(me.profile?.avatar)} />
                  <AvatarFallback>
                    {getFirstLetterInUpperCase(me.username)}
                  </AvatarFallback>
                </Avatar>
              </DropdownMenuTrigger>
              <DropdownMenuContent>
                {me.profile?.avatar && (
                  <DropdownMenuItem
                    className='cursor-pointer'
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
                    className='cursor-pointer flex items-center'
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
                  <DropdownMenuItem
                    className='cursor-pointer'
                    onClick={onAvatarDelete()}
                  >
                    <Trash2
                      color='hsl(0 84.2% 60.2%)'
                      className='mr-2 h-4 w-4'
                    />
                    <span>Delete photo</span>
                  </DropdownMenuItem>
                )}
              </DropdownMenuContent>
            </DropdownMenu>
            <span className='text-2xl font-semibold'>{`${me.username}`}</span>
          </div>
          <Separator className='mt-4 mb-4' />
          <ul className='flex flex-col gap-5'>
            <li>{`is profile activated: ${me.profile.isActivated}`}</li>
            <li>{`profile created at: ${new Date(me.profile.createdAt)}`}</li>
            <li>{`email: ${me.contacts.email.contact}`}</li>
            <li>{`is email public: ${
              me.contacts.email.isPublic ? 'True' : 'False'
            }`}</li>
          </ul>
        </>
      ) : (
        <span>Error while loading Your data.</span>
      )}
    </div>
  );
};

Profile.getLayout = (page) => (
  <Main title='Authorised / My Profile'>
    <Authorized>{page}</Authorized>
  </Main>
);

export const getServerSideProps: GetServerSideProps = async (
  ctx: GetServerSidePropsContext
) => {
  try {
    const res = await isAuthorized(ctx);

    if (res && 'redirect' in res) return res;

    const me = await getMyData();

    return {
      props: {
        me,
      },
    };
  } catch (error) {
    return {
      props: {
        me: null,
      },
    };
  }
};

export default Profile;
