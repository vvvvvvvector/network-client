import { NextPageWithLayout } from '../_app';

import { Main } from '@/layouts/Main';
import { Authorized } from '@/layouts/Authorised';

const Index: NextPageWithLayout = () => {
  return <div className='bg-white p-5 rounded-lg'>My photos</div>;
};

Index.getLayout = (page) => (
  <Main title='Authorised / Photos'>
    <Authorized>{page}</Authorized>
  </Main>
);

export default Index;
