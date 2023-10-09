import { ReactElement } from 'react';
import { GetServerSideProps, GetServerSidePropsContext } from 'next';
import nookies from 'nookies';

import { NextPageWithLayout } from './_app';

import { SignUpForm } from '@/components/forms/signup-form';

import { Auth } from '@/layouts/Auth';
import { Main } from '@/layouts/Main';

import { axiosApiInstance } from '@/axios';

import { getAuthorizedUserUsername } from '@/api/users';
import { Pages } from '@/lib/constants';

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
        destination: Pages.PROFILE,
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
