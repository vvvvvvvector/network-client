import { ReactElement } from 'react';
import { GetServerSideProps, GetServerSidePropsContext } from 'next';
import nookies from 'nookies';

import { NextPageWithLayout } from './_app';

import { SignUpForm } from '@/components/forms/signup-form';

import { Auth } from '@/layouts/auth';
import { Main } from '@/layouts/main';

import { axiosApiInstance } from '@/axios';

import { getAuthorizedUserUsername } from '@/api/users';

import { PAGES } from '@/lib/constants';

const SignUp: NextPageWithLayout = () => {
  return <SignUpForm />;
};

SignUp.getLayout = (page: ReactElement) => (
  <Main title='Auth / Sign Up'>
    <Auth>{page}</Auth>
  </Main>
);

export const getServerSideProps: GetServerSideProps = async (
  ctx: GetServerSidePropsContext
) => {
  const { token } = nookies.get(ctx);

  axiosApiInstance.defaults.headers.Authorization = `Bearer ${token}`;

  try {
    await getAuthorizedUserUsername();

    return {
      redirect: {
        destination: PAGES.PROFILE,
        permanent: false
      }
    };
  } catch (error) {
    return {
      props: {}
    };
  }
};

export default SignUp;
