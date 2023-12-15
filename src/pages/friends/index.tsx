import { GetServerSideProps } from 'next';

import { NextPageWithLayout } from '@/pages/_app';

import { Main } from '@/layouts/main';
import { Authorized } from '@/layouts/authorised';
import { Friends as FriendsLayout } from '@/layouts/friends';

import { Friends } from '@/components/friends/friends';

import { getMyFriends } from '@/api/friends';

import { isAuthorized, isRedirect } from '@/lib/auth';
import { UserFromListOfUsers } from '@/lib/types';

import { useSocketStore } from '@/zustand/socket.store';

interface Props {
  users: UserFromListOfUsers[] | null;
}

const Index: NextPageWithLayout<Props> = ({ users }) => {
  const { socket } = useSocketStore();

  if (!socket) {
    return (
      <p className='mb-7 mt-7 text-center leading-9'>
        Something wrong with your connection
        <br /> Please try again later
        <br /> <span className='text-4xl'>😭</span>
      </p>
    );
  }

  if (!users) {
    return (
      <p className='mb-7 mt-7 text-center leading-9'>
        Something went wrong
        <br /> Please, try again later
        <br /> <span className='text-4xl'>😭</span>
      </p>
    );
  }

  return <Friends users={users} socket={socket} />;
};

Index.getLayout = (page) => (
  <Main title='Authorised / My Friends'>
    <Authorized>
      <FriendsLayout>{page}</FriendsLayout>
    </Authorized>
  </Main>
);

export const getServerSideProps = (async (context) => {
  try {
    const res = await isAuthorized(context);

    if (isRedirect(res)) return res;

    const users = await getMyFriends();

    return {
      props: {
        users
      }
    };
  } catch (error) {
    return {
      props: {
        users: null
      }
    };
  }
}) satisfies GetServerSideProps<Props>;

export default Index;
