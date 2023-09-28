import { ReactElement } from 'react';

import { NextPageWithLayout } from './_app';

import { SignUpForm } from '@/components/forms/signup-form';

import { Auth } from '@/layouts/Auth';
import { Main } from '@/layouts/Main';

import { GetServerSideProps, GetServerSidePropsContext } from 'next';

import { axiosApiInstance } from '@/axios';

import nookies from 'nookies';

import { getAuthorizedUserUsername } from '@/api/users';

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
        destination: '/profile',
        permanent: false,
      },
    };
  } catch (error) {
    return {
      props: {},
    };
  }
};

export default SignUp;
