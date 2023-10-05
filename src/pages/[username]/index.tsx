import { GetServerSideProps, GetServerSidePropsContext } from 'next';

import { NextPageWithLayout } from '../_app';

import { Main } from '@/layouts/Main';

import { Authorized } from '@/layouts/Authorised';

import { getUserPublicAvailableDataByUsername } from '@/api/users';
import { Separator } from '@/components/ui/separator';

import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';

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
      <div className='flex gap-3 items-center'>
        <Avatar>
          <AvatarImage src={user.profile.avatar} />
          <AvatarFallback>{user.username[0].toUpperCase()}</AvatarFallback>
        </Avatar>
        <span className='text-2xl font-semibold'>{`${user?.username || 'x'} ${
          user.isFriend ? "(it's your friend)" : ''
        }`}</span>
      </div>
      <Separator className='mt-4 mb-4' />
      <ul className='flex flex-col gap-5'>
        <li>{`is profile activated: ${user?.profile.isActivated || 'x'}`}</li>
        <li>{`profile created at: ${
          new Date(user?.profile.createdAt) || 'x'
        }`}</li>
        <li>{`email: ${
          user?.contacts.email.isPublic
            ? user?.contacts.email.contact
            : 'private'
        }`}</li>
        {user.isFriend && (
          <li>{'for instance, only for friends content here...'}</li>
        )}
      </ul>
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
