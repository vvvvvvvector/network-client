import { ReactElement } from 'react';

import { NextPageWithLayout } from './_app';

import { SignUpForm } from '@/components/signup-form';
import { Auth } from '@/layouts/Auth';

const SignUp: NextPageWithLayout = () => {
  return <SignUpForm />;
};

SignUp.getLayout = (page: ReactElement) => <Auth>{page}</Auth>;

export default SignUp;
