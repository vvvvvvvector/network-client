import { useRouter } from 'next/router';

import { NextPageWithLayout } from '@/pages/_app';

import { Main } from '@/layouts/main';
import { Authorized } from '@/layouts/authorised';

const Chat: NextPageWithLayout = () => {
  const router = useRouter();

  return (
    <div className='rounded-lg bg-background p-5'>
      <span>{`Chat Room [roomId: ${router.query.id}]`}</span>
    </div>
  );
};

Chat.getLayout = (page) => (
  <Main title='Messenger / Chat'>
    <Authorized>{page}</Authorized>
  </Main>
);

export default Chat;
