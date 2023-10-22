import { ReactElement } from 'react';
import { GetServerSideProps, GetServerSidePropsContext } from 'next';
import nookies from 'nookies';

import { NextPageWithLayout } from '@/pages/_app';

import { SignInForm } from '@/components/forms/signin-form';

import { Auth } from '@/layouts/auth';
import { Main } from '@/layouts/main';

import { axiosApiInstance } from '@/axios';

import { getAuthorizedUserUsername } from '@/api/users';

import { PAGES } from '@/lib/constants';

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

export default Index;
