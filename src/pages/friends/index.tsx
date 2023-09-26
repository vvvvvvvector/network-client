import { NextPageWithLayout } from '../_app';

import { Main } from '@/layouts/Main';

import { Authorized } from '@/layouts/Authorised';
import { Button } from '@/components/ui/button';
import { Friends } from '@/layouts/Friends';
import { Separator } from '@/components/ui/separator';

import { useRouter } from 'next/router';

import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';

const Index: NextPageWithLayout = () => {
  const users = [
    {
      username: 'friend 1',
    },
    {
      username: 'friend 2',
    },
    {
      username: 'friend 3',
    },
    {
      username: 'friend 4',
    },
    {
      username: 'friend 5',
    },
  ];

  const router = useRouter();

  return (
    <>
      <div className='text-sm flex items-center justify-between'>
        <ul className='flex gap-7'>
          <li
            className={` hover:bg-gray-50 rounded p-2 cursor-pointer px-[1rem] py-[0.5rem]`}
          >
            {`All friends (${users.length})`}
          </li>
          <li
            className={` hover:bg-gray-50 rounded p-2 cursor-pointer px-[1rem] py-[0.5rem]`}
          >
            {`Online (${0})`}
          </li>
        </ul>
        <Button onClick={() => router.push('/friends/find')}>
          Find friends
        </Button>
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
        <span className='text-center'>You don't have any friends yet :(</span>
      )}
    </>
  );
};

Index.getLayout = (page) => (
  <Main title='Friends'>
    <Authorized>
      <Friends>{page}</Friends>
    </Authorized>
  </Main>
);

export default Index;
