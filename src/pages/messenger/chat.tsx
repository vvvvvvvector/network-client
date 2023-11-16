import { NextPageWithLayout } from '@/pages/_app';

import { Main } from '@/layouts/main';
import { Authorized } from '@/layouts/authorised';

import { useFrequentlyUsedHooks } from '@/hooks/use-frequently-used-hooks';

const Chat: NextPageWithLayout = () => {
  const { router } = useFrequentlyUsedHooks();

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
