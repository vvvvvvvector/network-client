import { GetServerSideProps, GetServerSidePropsContext } from 'next';

import { NextPageWithLayout } from './_app';

import { Main } from '@/layouts/Main';
import { Authorized } from '@/layouts/Authorised';

import { AuthorisedProfile } from '@/components/AuthorisedProfile';

import { isAuthorized } from '@/lib/auth';
import { AuthorisedUser } from '@/lib/types';

import { getMyData } from '@/api/users';

interface AuthorisedUserProps {
  me: AuthorisedUser;
}

const Profile: NextPageWithLayout<AuthorisedUserProps> = ({ me }) => {
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

export const getServerSideProps: GetServerSideProps = async (
  ctx: GetServerSidePropsContext
) => {
  try {
    const res = await isAuthorized(ctx);

    if (res && 'redirect' in res) return res;

    const me = await getMyData();

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
};

export default Profile;
