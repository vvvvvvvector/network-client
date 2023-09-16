import { ReactElement } from 'react';

import { NextPageWithLayout } from './_app';

import { SignUpForm } from '@/components/signup-form';

import { Auth } from '@/layouts/Auth';
import { Main } from '@/layouts/Main';

const SignUp: NextPageWithLayout = () => {
  return <SignUpForm />;
};

SignUp.getLayout = (page: ReactElement) => (
  <Main title='Auth / Sign Up'>
    <Auth>{page}</Auth>
  </Main>
);

export default SignUp;
