import { ReactElement } from 'react';

import { NextPageWithLayout } from './_app';

import { SignInForm } from '@/components/signin-form';
import { Auth } from '@/layouts/Auth';

const SignIn: NextPageWithLayout = () => {
  return <SignInForm />;
};

SignIn.getLayout = (page: ReactElement) => <Auth>{page}</Auth>;

export default SignIn;
