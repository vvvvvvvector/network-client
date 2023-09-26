import { useState } from 'react';

import { NextPageWithLayout } from '../_app';

import { Main } from '@/layouts/Main';

import { Authorized } from '@/layouts/Authorised';
import { Button } from '@/components/ui/button';
import { Friends } from '@/layouts/Friends';
import { Separator } from '@/components/ui/separator';
import { Input } from '@/components/ui/input';
import { axiosApiInstance } from '@/axios';
import { GetServerSideProps, GetServerSidePropsContext } from 'next';

import { getAllUsersUsernames } from '@/api/users';

import nookies from 'nookies';

import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';

import { Search, UserPlus } from 'lucide-react';

import { useRouter } from 'next/router';

interface Props {
  users:
    | {
        username: string;
      }[];
}

const Find: NextPageWithLayout<Props> = ({ users }) => {
  const [searchValue, setSearchValue] = useState('');

  const router = useRouter();

  const filteredUsers = users.filter((user) =>
    user.username.toLowerCase().includes(searchValue.toLocaleLowerCase())
  );

  return (
    <>
      <div className='flex gap-2 mb-4'>
        <span>People:</span>
        <span className='text-gray-400'>{`${users.length}`}</span>
      </div>
      <div className='text-sm flex gap-5 justify-between'>
        <Input
          value={searchValue}
          onChange={(e) => setSearchValue(e.target.value)}
          placeholder='Search...'
        />
        <Button size='icon' className='w-16'>
          <Search className='h-5 w-5' />
        </Button>
      </div>
      <Separator className='mt-4 mb-4' />
      {filteredUsers.length > 0 ? (
        <ul className='flex flex-col gap-5'>
          {filteredUsers.map((user) => (
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
              <Button
                onClick={(e) => {
                  e.stopPropagation();
                }}
                variant='outline'
              >
                <UserPlus size={20} />
              </Button>
            </li>
          ))}
        </ul>
      ) : (
        <span className='text-center'>Your search returned no results</span>
      )}
    </>
  );
};

Find.getLayout = (page) => (
  <Main title='Friends'>
    <Authorized>
      <Friends>{page}</Friends>
    </Authorized>
  </Main>
);

export const getServerSideProps: GetServerSideProps = async (
  ctx: GetServerSidePropsContext
) => {
  try {
    const { token } = nookies.get(ctx); // get token from the request

    axiosApiInstance.defaults.headers.Authorization = `Bearer ${token}`; // set cookie / token on the server

    const users = await getAllUsersUsernames();

    return {
      props: {
        users,
      },
    };
  } catch (error) {
    return {
      props: {
        users: [],
      },
    };
  }
};

export default Find;
