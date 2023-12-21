import type { GetServerSideProps } from 'next';

import type { NextPageWithLayout } from '@/pages/_app';

import { Main } from '@/layouts/main';
import { Authorized } from '@/layouts/authorised';

import { AuthorisedProfile } from '@/components/profiles/authorised-profile';

import { isAuthorized, isRedirect } from '@/lib/auth';
import type { AuthorisedUser } from '@/lib/types';

import { getAuthorizedUserData } from '@/api/users';

interface Props {
  user: AuthorisedUser | null;
}

const Profile: NextPageWithLayout<Props> = ({ user }) => {
  if (!user) {
    return (
      <div className='rounded-lg bg-background p-5'>
        <p className='mb-7 mt-7 text-center leading-9'>
          Error while loading your profile data
          <br /> Please try again later
          <br /> <span className='text-4xl'>😭</span>
        </p>
      </div>
    );
  }

  return <AuthorisedProfile {...user} />;
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

    const user = await getAuthorizedUserData();

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

export default Profile;
