import { ReactElement } from 'react';

import { NextPageWithLayout } from './_app';

import { SignInForm } from '@/components/forms/signin-form';

import { Auth } from '@/layouts/Auth';
import { Main } from '@/layouts/Main';

const Index: NextPageWithLayout = () => {
  return <SignInForm />;
};

Index.getLayout = (page: ReactElement) => (
  <Main title='Auth / Sign In'>
    <Auth>{page}</Auth>
  </Main>
);

export default Index;
