import { NextPageWithLayout } from './_app';

import { Main } from '@/layouts/Main';
import { Authorized } from '@/layouts/Authorised';

const Messenger: NextPageWithLayout = () => {
  return <div className='rounded-lg bg-background p-5'>Messenger</div>;
};

Messenger.getLayout = (page) => (
  <Main title='Authorised / Messenger'>
    <Authorized>{page}</Authorized>
  </Main>
);

export default Messenger;
