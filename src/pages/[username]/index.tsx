import { GetServerSideProps } from 'next';

import { NextPageWithLayout } from '@/pages/_app';

import { Main } from '@/layouts/main';
import { Authorized } from '@/layouts/authorised';

import { getNetworkUserPublicAvailableData } from '@/api/users';

import { isAuthorized, isRedirect } from '@/lib/auth';
import { NetworkUser } from '@/lib/types';

import { DefaultProfile } from '@/components/default-profile';
import { FriendProfile } from '@/components/friend-profile';

export interface Props {
  user: NetworkUser | null;
}

const Index: NextPageWithLayout<Props> = ({ user }) => {
  if (!user) {
    return (
      <div className='rounded-lg bg-background p-5'>
        <span>Error while loading user data.</span>
      </div>
    );
  }

  if (user.extendedFriendRequestStatus === 'friend')
    return (
      <FriendProfile
        username={user.username}
        profile={user.profile}
        contacts={user.contacts}
      />
    );

  return (
    <DefaultProfile
      extendedFriendRequestStatus={user.extendedFriendRequestStatus}
      username={user.username}
      profile={user.profile}
      contacts={user.contacts}
    />
  );
};

Index.getLayout = (page) => (
  <Main title={`User / ${page.props.children[1].props.user.username}`}>
    <Authorized>{page}</Authorized>
  </Main>
);

export const getServerSideProps = (async (context) => {
  try {
    const res = await isAuthorized(context);

    if (isRedirect(res)) return res;

    const user = await getNetworkUserPublicAvailableData(
      context.query.username as string
    );

    return {
      props: {
        user
      }
    };
  } catch (error) {
    return {
      props: {
        user: null
      }
    };
  }
}) satisfies GetServerSideProps<Props>;

export default Index;
