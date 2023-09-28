import { ReactElement } from 'react';

import { NextPageWithLayout } from './_app';

import { SignInForm } from '@/components/forms/signin-form';

import { Auth } from '@/layouts/Auth';
import { Main } from '@/layouts/Main';
import { GetServerSideProps, GetServerSidePropsContext } from 'next';

import { axiosApiInstance } from '@/axios';

import nookies from 'nookies';

import { getAuthorizedUserUsername } from '@/api/users';

const Index: NextPageWithLayout = () => {
  return <SignInForm />;
};

Index.getLayout = (page: ReactElement) => (
  <Main title='Auth / Sign In'>
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

export default Index;
