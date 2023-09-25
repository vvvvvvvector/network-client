import { NextPageWithLayout } from './_app';

import { Main } from '@/layouts/Main';

import { Authorized } from '@/layouts/Authorised';

const Friends: NextPageWithLayout = () => {
  return <div className='w-full h-full bg-emerald-200'>Friends</div>;
};

Friends.getLayout = (page) => (
  <Main title='Authorised / Friends'>
    <Authorized>{page}</Authorized>
  </Main>
);

export default Friends;
