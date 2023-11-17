import { GetServerSideProps } from 'next';

import { NextPageWithLayout } from '@/pages/_app';

import { Main } from '@/layouts/main';
import { Authorized } from '@/layouts/authorised';

import { AuthorisedProfile } from '@/components/authorised-profile';

import { isAuthorized, isRedirect } from '@/lib/auth';
import { AuthorisedUser } from '@/lib/types';

import { getAuthorizedUserData } from '@/api/users';

interface Props {
  me: AuthorisedUser | null;
}

const Profile: NextPageWithLayout<Props> = ({ me }) => {
  if (!me) {
    return (
      <div className='rounded-lg bg-background p-5'>
        <span>Error while loading Your data.</span>
      </div>
    );
  }

  return <AuthorisedProfile {...me} />;
};

Profile.getLayout = (page) => (
  <Main title='Authorised / My Profile'>
    <Authorized>{page}</Authorized>
  </Main>
);

export const getServerSideProps = (async (context) => {
  try {
    const res = await isAuthorized(context);

    if (isRedirect(res)) return res;

    const me = await getAuthorizedUserData();

    return {
      props: {
        me
      }
    };
  } catch (error) {
    return {
      props: {
        me: null
      }
    };
  }
}) satisfies GetServerSideProps<Props>;

export default Profile;
