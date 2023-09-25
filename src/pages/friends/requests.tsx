import { NextPageWithLayout } from '../_app';

import { Authorized } from '@/layouts/Authorised';
import { Friends } from '@/layouts/Friends';
import { Main } from '@/layouts/Main';

import { Separator } from '@/components/ui/separator';

const Requests: NextPageWithLayout = () => {
  return (
    <>
      <div className='text-sm'>
        <ul className='flex gap-7'>
          <li
            className={`hover:bg-gray-50 rounded p-2 cursor-pointer px-[1rem] py-[0.5rem]`}
          >
            Pending
          </li>
          <li
            className={`hover:bg-gray-50 rounded p-2 cursor-pointer px-[1rem] py-[0.5rem]`}
          >
            Outgoing
          </li>
        </ul>
      </div>
      <Separator className='mt-4 mb-4' />
      <div className='flex flex-col gap-5'>
        <div>hello world</div>
        <div>hello world</div>
        <div>hello world</div>
        <div>hello world</div>
        <div>hello world</div>
      </div>
    </>
  );
};

Requests.getLayout = (page) => (
  <Main title='Friend Requests'>
    <Authorized>
      <Friends>{page}</Friends>
    </Authorized>
  </Main>
);

export default Requests;
