import { NextPageWithLayout } from './_app';

import { Main } from '@/layouts/Main';
import { Authorized } from '@/layouts/Authorised';

const News: NextPageWithLayout = () => {
  return <div className='rounded-lg bg-background p-5'>News</div>;
};

News.getLayout = (page) => (
  <Main title='Authorised / News'>
    <Authorized>{page}</Authorized>
  </Main>
);

export default News;
