import { useEffect, useState } from 'react';
import axios from 'axios';
import { GetServerSideProps, GetServerSidePropsContext } from 'next';

import { NextPageWithLayout } from '../_app';

import { Main } from '@/layouts/main';
import { Authorized } from '@/layouts/authorised';
import { Friends } from '@/layouts/friends';

import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { Input } from '@/components/ui/input';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger
} from '@/components/ui/tooltip';
import { Avatar } from '@/components/avatar';

import {
  Search,
  UserPlus,
  SearchSlash,
  ChevronLeft,
  ChevronRight
} from 'lucide-react';

import { getNetworkUsersUsernames, sendFriendRequest } from '@/api/friends';

import { useCombain } from '@/hooks/use-combain';

import { isAuthorized } from '@/lib/auth';
import { ProfileWithAvatar, User } from '@/lib/types';

type RequestStatus = 'rejected' | 'accepted' | 'pending' | 'lack';

interface Props {
  users: (User & ProfileWithAvatar & { requestStatus: RequestStatus })[];
  totalPages: number;
  limitPerPage: number;
}

const REQUEST_INFO: Record<Exclude<RequestStatus, 'lack'>, string> = {
  rejected: 'Request already exists',
  accepted: 'Already friends',
  pending: 'Request already exists'
};

const Find: NextPageWithLayout<Props> = ({
  users,
  totalPages,
  limitPerPage
}) => {
  const { router, toast } = useCombain();

  const [searchValue, setSearchValue] = useState('');

  const [currentPage, setCurrentPage] = useState(1);

  useEffect(() => {
    if (router.query.username) {
      router.push({
        query: {
          page: currentPage,
          username: router.query.username
        }
      });
    } else {
      router.push({
        query: {
          page: currentPage
        }
      });
    }
  }, [currentPage]);

  const onClickPrevPage = () => {
    if (currentPage > 1) setCurrentPage((prev) => prev - 1);
  };

  const onClickNextPage = () => {
    if (totalPages > currentPage) setCurrentPage((prev) => prev + 1);
  };

  const onClickSendFriendRequest = (username: string) => {
    return async (e: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
      e.stopPropagation();

      try {
        await sendFriendRequest(username);

        toast({
          description: 'Friend request was successfully sent.'
        });

        router.replace(router.asPath, undefined, { scroll: false });
      } catch (error) {
        if (axios.isAxiosError(error)) {
          toast({
            variant: 'destructive',
            description: `${error.response?.data.message}`
          });
        }
      }
    };
  };

  return (
    <>
      <div className='mb-4 flex gap-2'>
        <span>Find friends</span>
      </div>
      <div className='flex justify-between gap-5 text-sm'>
        <Input
          value={searchValue}
          onChange={(e) => setSearchValue(e.target.value)}
          placeholder='Search...'
        />
        {!router.query.username ? (
          <Button
            onClick={async () => {
              if (searchValue) {
                await router.push({
                  query: {
                    page: 1,
                    username: searchValue
                  }
                });

                setCurrentPage(1);
              }
            }}
            size='icon'
            className='w-16'
          >
            <Search className='h-5 w-5' />
          </Button>
        ) : (
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  onClick={async () => {
                    await router.push({
                      query: {
                        page: 1
                      }
                    });

                    setCurrentPage(1);

                    setSearchValue('');
                  }}
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
      <Separator className='mb-4 mt-4' />
      {users.length > 0 ? (
        <ul className='flex flex-col gap-5'>
          {users.map((user) => (
            <li
              className='flex items-center justify-between py-2'
              key={user.username}
            >
              <div className='flex items-center gap-3'>
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
                <span>{REQUEST_INFO[user.requestStatus]}</span>
              )}
            </li>
          ))}
        </ul>
      ) : (
        <span className='mb-7 mt-7 text-center'>
          Your search returned no results.
        </span>
      )}
      {users.length > 0 && totalPages > 1 && (
        <div className='mt-4 flex justify-center gap-1'>
          <Button
            variant='ghost'
            size='icon'
            disabled={currentPage === 1}
            onClick={onClickPrevPage}
          >
            <ChevronLeft />
          </Button>
          {[...Array(totalPages)].map((_, index) => (
            <Button
              key={index + 1}
              onClick={() => setCurrentPage(index + 1)}
              variant={index + 1 === currentPage ? 'outline' : 'ghost'}
            >
              {index + 1}
            </Button>
          ))}
          <Button
            variant='ghost'
            size='icon'
            disabled={currentPage === totalPages}
            onClick={onClickNextPage}
          >
            <ChevronRight />
          </Button>
        </div>
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

    const response = await getNetworkUsersUsernames(
      ctx.query.page as string,
      ctx.query.username as string
    );

    return {
      props: {
        users: response.users,
        totalPages: response.pages,
        limitPerPage: response.limit
      }
    };
  } catch (error) {
    return {
      props: {
        users: [],
        pages: 0,
        limitPerPage: 0
      }
    };
  }
};

export default Find;
