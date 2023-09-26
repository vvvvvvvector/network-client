import { NextPageWithLayout } from '../_app';

import { Authorized } from '@/layouts/Authorised';
import { Friends } from '@/layouts/Friends';
import { Main } from '@/layouts/Main';

import { Separator } from '@/components/ui/separator';

import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';

import { useRouter } from 'next/router';

const Requests: NextPageWithLayout = () => {
  const users = [
    {
      username: 'incoming request 1',
    },
    {
      username: 'incoming request 2',
    },
    {
      username: 'incoming request 3',
    },
    {
      username: 'incoming request 4',
    },
    {
      username: 'incoming request 5',
    },
    {
      username: 'incoming request 6',
    },
  ];

  const router = useRouter();

  return (
    <>
      <div className='text-sm'>
        <ul className='flex gap-7'>
          <li
            className={`hover:bg-gray-50 rounded p-2 cursor-pointer px-[1rem] py-[0.5rem]`}
          >
            {`Pending (${users.length})`}
          </li>
          <li
            className={`hover:bg-gray-50 rounded p-2 cursor-pointer px-[1rem] py-[0.5rem]`}
          >
            {`Outgoing (${0})`}
          </li>
        </ul>
      </div>
      <Separator className='mt-4 mb-4' />
      {users.length > 0 ? (
        <ul className='flex flex-col gap-5'>
          {users.map((user) => (
            <li
              className='flex py-2 items-center justify-between'
              key={user.username}
            >
              <div className='flex gap-3 items-center'>
                <Avatar>
                  <AvatarImage src='' />
                  <AvatarFallback>A</AvatarFallback>
                </Avatar>
                <span
                  onClick={() => router.push(`/${user.username}`)}
                  className='cursor-pointer hover:underline'
                >
                  {user.username}
                </span>
              </div>
            </li>
          ))}
        </ul>
      ) : (
        <span className='text-center'>
          You don't have any incoming request yet :(
        </span>
      )}
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
