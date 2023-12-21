import type { NextPageWithLayout } from '@/pages/_app';

import { Main } from '@/layouts/main';
import { Authorized } from '@/layouts/authorised';

const Index: NextPageWithLayout = () => {
  return <div className='rounded-lg bg-background p-5'>My photos</div>;
};

Index.getLayout = (page) => (
  <Main title='Authorised / Photos'>
    <Authorized>{page}</Authorized>
  </Main>
);

export default Index;
