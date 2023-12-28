import { type NextPageWithLayout } from '@/pages/_app';

import { Main } from '@/layouts/main';
import { Authorized } from '@/layouts/authorised';

const News: NextPageWithLayout = () => {
  return <div className='rounded-lg bg-background p-5'>News</div>;
};

News.getLayout = (page) => (
  <Main title='Authorised / News'>
    <Authorized>{page}</Authorized>
  </Main>
);

export default News;
