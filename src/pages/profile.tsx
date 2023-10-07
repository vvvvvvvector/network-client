import { GetServerSideProps, GetServerSidePropsContext } from 'next';

import { NextPageWithLayout } from './_app';

import { Main } from '@/layouts/Main';
import { Authorized } from '@/layouts/Authorised';

import { getMyData } from '@/api/users';
import { Separator } from '@/components/ui/separator';

import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';

import { isAuthorized } from '@/lib/auth';

import { Pencil, Trash2, Upload, Image } from 'lucide-react';
import { avatarSource, firstLetterToUpperCase } from '@/lib/utils';
import { deleteAvatar } from '@/api/profiles';
import { useDefault } from '@/lib/hooks';
import { ChangeEvent } from 'react';

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
  const { toast, router } = useDefault();

  return (
    <div className='bg-white p-5 rounded-lg'>
      {me ? (
        <>
          <div className='flex gap-5 items-center'>
            <DropdownMenu>
              <DropdownMenuTrigger>
                <Avatar className='w-36 h-36'>
                  <AvatarImage src={avatarSource(me.profile?.avatar)} />
                  <AvatarFallback>
                    {firstLetterToUpperCase(me.username)}
                  </AvatarFallback>
                </Avatar>
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
                <DropdownMenuItem>
                  <input id='avatar' type='file' hidden />
                  <label htmlFor='avatar' className='flex items-center'>
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
                    onClick={async () => {
                      await deleteAvatar();

                      toast({
                        description: 'An avatar was successfully deleted.',
                      });

                      router.replace(router.asPath);
                    }}
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
