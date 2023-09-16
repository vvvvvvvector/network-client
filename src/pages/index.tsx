import { ReactElement } from 'react';

import { NextPageWithLayout } from './_app';

import { SignInForm } from '@/components/signin-form';

import { Auth } from '@/layouts/Auth';
import { Main } from '@/layouts/Main';

const SignIn: NextPageWithLayout = () => {
  return <SignInForm />;
};

SignIn.getLayout = (page: ReactElement) => (
  <Main title='Auth / Sign In'>
    <Auth>{page}</Auth>
  </Main>
);

export default SignIn;
