import { useState } from 'react';
import axios from 'axios';
import { GetServerSideProps, GetServerSidePropsContext } from 'next';

import { NextPageWithLayout } from '../_app';

import { Main } from '@/layouts/Main';
import { Authorized } from '@/layouts/Authorised';
import { Friends } from '@/layouts/Friends';

import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { Input } from '@/components/ui/input';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip';
import { Avatar } from '@/components/Avatar';

import { Search, UserPlus, SearchSlash, Table } from 'lucide-react';

import { getNetworkUsersUsernames, sendFriendRequest } from '@/api/friends';

import { useCombain } from '@/hooks/useCombain';

import { isAuthorized } from '@/lib/auth';
import { ProfileWithAvatar, User } from '@/lib/types';

type RequestStatus = 'rejected' | 'accepted' | 'pending' | 'lack';

interface Props {
  users: (User & ProfileWithAvatar & { requestStatus: RequestStatus })[];
}

const REQUEST_INFO: Record<
  Exclude<RequestStatus, 'lack'>,
  React.JSX.Element
> = {
  rejected: <>Request already exists</>,
  accepted: <>Already friends</>,
  pending: <>Request already exists</>,
};

const Find: NextPageWithLayout<Props> = ({ users }) => {
  const [searchValue, setSearchValue] = useState('');

  const { router, toast } = useCombain();

  const filteredUsers = users.filter((user) =>
    user.username.toLowerCase().includes(searchValue.toLocaleLowerCase())
  );

  const onClickSendFriendRequest = (username: string) => {
    return async (e: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
      e.stopPropagation();

      try {
        await sendFriendRequest(username);

        toast({
          description: 'Friend request was successfully sent.',
        });

        router.replace(router.asPath, undefined, { scroll: false });
      } catch (error) {
        if (axios.isAxiosError(error)) {
          toast({
            variant: 'destructive',
            description: `${error.response?.data.message}`,
          });
        }
      }
    };
  };

  return (
    <>
      <div className='flex gap-2 mb-4'>
        <span>People:</span>
        <span className='text-gray-400'>{`${filteredUsers.length}`}</span>
      </div>
      <div className='text-sm flex gap-5 justify-between'>
        <Input
          value={searchValue}
          onChange={(e) => setSearchValue(e.target.value)}
          placeholder='Search...'
        />
        {searchValue === '' ? (
          <Button size='icon' className='w-16'>
            <Search className='h-5 w-5' />
          </Button>
        ) : (
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  onClick={() => setSearchValue('')}
                  size='icon'
                  className='w-16'
                >
                  <SearchSlash className='h-5 w-5' />
                </Button>
              </TooltipTrigger>
              <TooltipContent>
                <p>Reset search</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        )}
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
                <Avatar
                  size='medium'
                  username={user.username}
                  avatar={user.profile?.avatar}
                />
                <span
                  onClick={() => router.push(`/${user.username}`)}
                  className='cursor-pointer hover:underline'
                >
                  {user.username}
                </span>
              </div>
              {user.requestStatus === 'lack' ? (
                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Button
                        onClick={onClickSendFriendRequest(user.username)}
                        variant='outline'
                      >
                        <UserPlus size={20} />
                      </Button>
                    </TooltipTrigger>
                    <TooltipContent>
                      <p>Send a friend request</p>
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>
              ) : (
                REQUEST_INFO[user.requestStatus]
              )}
            </li>
          ))}
        </ul>
      ) : (
        <span className='text-center'>Your search returned no results.</span>
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
    const res = await isAuthorized(ctx);

    if (res && 'redirect' in res) return res;

    const users = await getNetworkUsersUsernames();

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
