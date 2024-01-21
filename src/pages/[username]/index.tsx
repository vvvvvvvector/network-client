import { type GetServerSideProps } from 'next';
import { type PropsWithChildren } from 'react';

import { type NextPageWithLayout } from '@/pages/_app';

import { Main } from '@/layouts/main';
import { Authorized } from '@/layouts/authorised';

import { DefaultProfile } from '@/components/profiles/default-profile';
import { FriendProfile } from '@/components/profiles/friend-profile';

import { getNetworkUserPubliclyAvailableData } from '@/api/users';

import { isAuthorized, isRedirect } from '@/lib/auth';
import type { NetworkUser } from '@/lib/types';
import { PAGES } from '@/lib/constants';

import { useFrequentlyUsedHooks } from '@/hooks/use-frequently-used-hooks';

type PageUrlParams = {
  username: string;
};

interface Props {
  user: NetworkUser | null;
}

const Index: NextPageWithLayout<Props> = ({ user }) => {
  const { router } = useFrequentlyUsedHooks();

  if (!user) {
    return (
      <OnErrorLayout>
        User
        <b>{` ${router.query.username} `}</b>
        doesn&apos;t exist.
        <br /> <span className='text-4xl'>🧐</span>
      </OnErrorLayout>
    );
  }

  const commonProps = {
    username: user.username,
    profile: user.profile,
    lastSeen: user.lastSeen,
    contacts: user.contacts
  };

  if (user.extendedFriendRequestStatus === 'friend')
    return <FriendProfile {...commonProps} />;

  return (
    <DefaultProfile
      extendedFriendRequestStatus={user.extendedFriendRequestStatus}
      {...commonProps}
    />
  );
};

Index.getLayout = (page) => {
  const notFoundTitle = 'User not found :<';

  const username = page.props.user?.username || notFoundTitle;

  const title = username === notFoundTitle ? notFoundTitle : `@${username}`;

  return (
    <Main title={title}>
      <Authorized>{page}</Authorized>
    </Main>
  );
};

const OnErrorLayout = ({ children }: PropsWithChildren) => {
  return (
    <div className='rounded-lg bg-background p-5'>
      <p className='my-11 text-center leading-9'>{children}</p>
    </div>
  );
};

export const getServerSideProps = (async (context) => {
  try {
    const res = await isAuthorized(context);

    if (isRedirect(res)) return res;

    const { username: networkUserUsername } = context.params!; // ! operator is a type assertion operator that tells the TypeScript compiler that a variable is not null or undefined, and it should be treated as such.

    if (networkUserUsername === res.authorizedUserUsername)
      return {
        redirect: {
          destination: PAGES.MY_PROFILE,
          permanent: false
        }
      };

    const user = await getNetworkUserPubliclyAvailableData(networkUserUsername);

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
}) satisfies GetServerSideProps<Props, PageUrlParams>;

export default Index;
