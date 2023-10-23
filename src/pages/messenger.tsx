import { NextPageWithLayout } from '@/pages/_app';

import { Main } from '@/layouts/main';
import { Authorized } from '@/layouts/authorised';

import { Separator } from '@/components/ui/separator';
import { Avatar } from '@/components/avatar';

const Messenger: NextPageWithLayout = () => {
  return (
    <div className='rounded-lg bg-background p-5'>
      <span>Messenger</span>
      <Separator className='mb-4 mt-4' />
      <ul className='flex flex-col gap-5'>
        {[...Array(3)].map((_, index) => (
          <li key={index} className='flex cursor-pointer items-center gap-3'>
            <Avatar username='helloworld' size='medium' avatar='' />
            <div className='flex w-full flex-col gap-2'>
              <div className='flex justify-between'>
                <span className='font-bold'>hello world (username)</span>
                <span>23 Oct (last message date and time)</span>
              </div>
              <span>hello world!!! (last message)</span>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
};

Messenger.getLayout = (page) => (
  <Main title='Authorised / Messenger'>
    <Authorized>{page}</Authorized>
  </Main>
);

export default Messenger;
