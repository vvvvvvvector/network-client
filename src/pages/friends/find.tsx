import { useState } from 'react';
import type { GetServerSideProps } from 'next';
import { Search, UserPlus, SearchSlash } from 'lucide-react';
import Link from 'next/link';

import type { NextPageWithLayout } from '@/pages/_app';

import { Main } from '@/layouts/main';
import { Authorized } from '@/layouts/authorised';
import { Friends } from '@/layouts/friends';

import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { Input } from '@/components/ui/input';
import { Tooltip } from '@/components/tooltip';
import { Avatar } from '@/components/avatar';
import { Pagination, PaginationItem } from '@/components/friends/pagination';

import { getNetworkUsersUsernames } from '@/api/friends';

import { useFrequentlyUsedHooks } from '@/hooks/use-frequently-used-hooks';
import { useRequestsActions } from '@/hooks/use-requests-actions';
import { useFocus } from '@/hooks/use-focus';

import { isAuthorized, isRedirect } from '@/lib/auth';
import type { BaseFriendRequestStatus, UserFromListOfUsers } from '@/lib/types';
import { ICON_INSIDE_BUTTON_SIZE } from '@/lib/constants';

export type RequestStatus = BaseFriendRequestStatus | 'none';

const REQUEST_INFO: Record<Exclude<RequestStatus, 'none'>, string> = {
  rejected: 'Request already exists',
  accepted: 'Already friends',
  pending: 'Request already exists'
};

interface Props {
  users: (UserFromListOfUsers & { requestStatus: RequestStatus })[] | null;
  totalPages: number;
  limitPerPage: number;
}

const Find: NextPageWithLayout<Props> = ({
  users,
  totalPages,
  limitPerPage
}) => {
  const [searchValue, setSearchValue] = useState('');

  const inputRef = useFocus<HTMLInputElement>();

  const { router } = useFrequentlyUsedHooks();

  const { send } = useRequestsActions();

  const onSearch = async () => {
    if (searchValue) {
      await router.push(
        {
          query: {
            page: 1,
            username: searchValue.trim()
          }
        },
        undefined,
        { scroll: false }
      );
    }
  };

  const onResetSearch = async () => {
    await router.push(
      {
        query: {
          page: 1
        }
      },
      undefined,
      { scroll: false }
    );

    setSearchValue('');
  };

  if (!users) {
    return (
      <p className='mb-7 mt-7 text-center leading-9'>
        Something went wrong
        <br /> Please, try again later
        <br /> <span className='text-4xl'>😭</span>
      </p>
    );
  }

  return (
    <>
      <div className='mb-4 flex gap-2'>
        <span>Find friends</span>
      </div>
      <div className='flex justify-between gap-5 text-sm'>
        <Input
          ref={inputRef}
          value={searchValue}
          onChange={(e) => setSearchValue(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === 'Enter') onSearch();
          }}
          placeholder='Search...'
        />
        {!router.query.username ? (
          <Button onClick={onSearch} size='icon' className='w-14'>
            <Search size={ICON_INSIDE_BUTTON_SIZE} />
          </Button>
        ) : (
          <Tooltip text='Reset search'>
            <Button onClick={onResetSearch} size='icon' className='w-14'>
              <SearchSlash size={ICON_INSIDE_BUTTON_SIZE} />
            </Button>
          </Tooltip>
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
                <Link href={`/${user.username}`}>
                  <Avatar
                    size='medium'
                    username={user.username}
                    avatar={user.profile.avatar?.name}
                  />
                </Link>
                <Link href={`/${user.username}`}>
                  <span className='cursor-pointer hover:underline'>
                    {user.username}
                  </span>
                </Link>
              </div>
              {user.requestStatus === 'none' ? (
                <Tooltip text='Send a friend request'>
                  <Button onClick={send(user.username)} variant='outline'>
                    <UserPlus size={ICON_INSIDE_BUTTON_SIZE} />
                  </Button>
                </Tooltip>
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
      {users.length > 0 && (
        <Pagination totalPages={totalPages}>
          <Pagination.Content>
            <PaginationItem.Previous />
            {[...Array(totalPages)].map((_, index) => (
              <PaginationItem key={index} selected={index + 1}>
                {index + 1}
              </PaginationItem>
            ))}
            <PaginationItem.Next />
          </Pagination.Content>
        </Pagination>
      )}
    </>
  );
};

Find.getLayout = (page) => (
  <Main title='Friends / Find'>
    <Authorized>
      <Friends>{page}</Friends>
    </Authorized>
  </Main>
);

export const getServerSideProps = (async (context) => {
  try {
    const res = await isAuthorized(context);

    if (isRedirect(res)) return res;

    const response = await getNetworkUsersUsernames(
      context.query.page as string,
      context.query.username as string | undefined
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
        users: null,
        totalPages: 0,
        limitPerPage: 0
      }
    };
  }
}) satisfies GetServerSideProps<Props>;

export default Find;
