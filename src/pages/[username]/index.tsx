import { GetServerSideProps, GetServerSidePropsContext } from 'next';
import { Heart, Image } from 'lucide-react';

import { NextPageWithLayout } from '../_app';

import { Main } from '@/layouts/Main';
import { Authorized } from '@/layouts/Authorised';

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Separator } from '@/components/ui/separator';
import { Badge } from '@/components/ui/badge';
import { A } from '@/components/A';

import { getUserPublicAvailableDataByUsername } from '@/api/users';

import { isAuthorized } from '@/lib/auth';

interface Props {
  user: {
    isFriend: boolean;
    username: string;
    profile: {
      isActivated: boolean;
      createdAt: string;
      avatar?: string;
    };
    contacts: {
      email: {
        isPublic: boolean;
        contact: string;
      };
    };
  };
}

const Index: NextPageWithLayout<Props> = ({ user }) => {
  return (
    <div className='bg-white p-5 rounded-lg'>
      {user ? (
        <>
          <div className='flex gap-5 items-center'>
            <DropdownMenu>
              <DropdownMenuTrigger>
                <A
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
              <span className='text-2xl font-semibold'>{`${
                user.username || 'x'
              }`}</span>
            </div>
            {user.isFriend && <Badge>Friend</Badge>}
          </div>
          <Separator className='mt-4 mb-4' />
          <ul className='flex flex-col gap-5'>
            <li>{`is profile activated: ${
              user.profile.isActivated || 'x'
            }`}</li>
            <li>{`profile created at: ${
              new Date(user.profile.createdAt) || 'x'
            }`}</li>
            <li>{`email: ${
              user.contacts.email.isPublic
                ? user.contacts.email.contact
                : 'private'
            }`}</li>
            {user.isFriend && (
              <li>{'for instance, only for friends content here...'}</li>
            )}
          </ul>
        </>
      ) : (
        <span>Error while loading user data.</span>
      )}
    </div>
  );
};

Index.getLayout = (page) => (
  <Main title='Someone profile'>
    <Authorized>{page}</Authorized>
  </Main>
);

export const getServerSideProps: GetServerSideProps = async (
  ctx: GetServerSidePropsContext
) => {
  try {
    const res = await isAuthorized(ctx);

    if (res && 'redirect' in res) return res;

    const user = await getUserPublicAvailableDataByUsername(
      ctx.query.username as string
    );

    return {
      props: {
        user,
      },
    };
  } catch (error) {
    return {
      props: {
        user: null,
      },
    };
  }
};

export default Index;
