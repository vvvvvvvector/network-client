import { FC } from 'react';
import { GetServerSideProps, GetServerSidePropsContext } from 'next';

import { NextPageWithLayout } from '../_app';

import { Main } from '@/layouts/Main';
import { Authorized } from '@/layouts/Authorised';

import { getUserPublicAvailableDataByUsername } from '@/api/users';

import { isAuthorized } from '@/lib/auth';

import { NotFriendProfile } from '@/components/NotFriendProfile';
import { FriendProfile } from '@/components/FriendProfile';

export interface UserProfileProps {
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

const PROFILE: Record<
  'friend' | 'notFriend',
  FC<Omit<UserProfileProps['user'], 'isFriend'>>
> = {
  friend: FriendProfile,
  notFriend: NotFriendProfile,
};

const Index: NextPageWithLayout<UserProfileProps> = ({ user }) => {
  if (!user) {
    return (
      <div className='bg-white p-5 rounded-lg'>
        <span>Error while loading user data.</span>
      </div>
    );
  }

  return PROFILE[user.isFriend ? 'friend' : 'notFriend']({
    username: user.username,
    profile: user.profile,
    contacts: user.contacts,
  });
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
