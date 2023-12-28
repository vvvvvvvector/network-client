import type { GetServerSideProps } from 'next';

import { type NextPageWithLayout } from '@/pages/_app';

import { Main } from '@/layouts/main';
import { Authorized } from '@/layouts/authorised';
import { Friends as FriendsLayout } from '@/layouts/friends';

import { Friends } from '@/components/friends/friends';

import { getMyFriends } from '@/api/friends';

import { isAuthorized, isRedirect } from '@/lib/auth';
import type { UserFromListOfUsers } from '@/lib/types';

interface Props {
  users: UserFromListOfUsers[] | null;
}

const Index: NextPageWithLayout<Props> = ({ users }) => {
  if (!users) {
    return (
      <p className='mb-7 mt-7 text-center leading-9'>
        Something went wrong
        <br /> Please, try again later
        <br /> <span className='text-4xl'>😭</span>
      </p>
    );
  }

  return <Friends users={users} />;
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
