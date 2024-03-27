'use client';

import { useRouter, useSearchParams } from 'next/navigation';
import { useState } from 'react';
import Link from 'next/link';

import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';

import { Icons } from '@/components/icons';
import { Avatar } from '@/components/avatar';
import { Tooltip } from '@/components/tooltip';
import { Pagination, PaginationItem } from '@/components/friends/pagination';

import { getNetworkUsersUsernames } from '@/app/(authorised)/friends/api';

import { useFocus } from '@/hooks/use-focus';
import { useRequestsActions } from '@/hooks/use-requests-actions';

import { ICON_INSIDE_BUTTON_SIZE, PAGES } from '@/lib/constants';

import { RequestStatus } from '@/axios/friends';

interface Props {
  data: Awaited<ReturnType<typeof getNetworkUsersUsernames>>;
}

const REQUEST_INFO: Record<Exclude<RequestStatus, 'none'>, string> = {
  rejected: 'Request already exists',
  accepted: 'Already friends',
  pending: 'Request already exists'
};

export const NetworkUsersList = ({ data: { users, pages } }: Props) => {
  const [searchValue, setSearchValue] = useState('');

  const inputRef = useFocus<HTMLInputElement>();

  const { replace } = useRouter();

  const searchParams = useSearchParams();

  const params = new URLSearchParams(searchParams?.toString());

  const { send } = useRequestsActions();

  const onSearch = () => {
    if (searchValue)
      replace(`${PAGES.FRIENDS_FIND}?page=1&username=${searchValue.trim()}`);
  };

  return (
    <>
      <div className='mb-4 flex gap-2'>
        <span>Find friends</span>
      </div>
      <div className='flex justify-between gap-5 text-sm'>
        <Input
          ref={inputRef}
          value={searchValue}
          placeholder='Search...'
          onChange={(e) => setSearchValue(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === 'Enter') onSearch();
          }}
        />
        {!params.get('username') ? (
          <Button onClick={onSearch} size='icon' className='w-14'>
            <Icons.search className={ICON_INSIDE_BUTTON_SIZE} />
          </Button>
        ) : (
          <Tooltip text='Reset search'>
            <Button
              size='icon'
              className='w-14'
              onClick={() => {
                replace(`${PAGES.FRIENDS_FIND}?page=1`);

                setSearchValue('');
              }}
            >
              <Icons.resetSearch className={ICON_INSIDE_BUTTON_SIZE} />
            </Button>
          </Tooltip>
        )}
      </div>
      <Separator className='my-4' />
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
                    <Icons.addUser className={ICON_INSIDE_BUTTON_SIZE} />
                  </Button>
                </Tooltip>
              ) : (
                <span>{REQUEST_INFO[user.requestStatus]}</span>
              )}
            </li>
          ))}
        </ul>
      ) : (
        <span className='my-7 text-center'>
          Your search returned no results.
        </span>
      )}
      {users.length > 0 && (
        <Pagination totalPages={pages}>
          <Pagination.Content>
            <PaginationItem.Previous />
            {[...Array(pages)].map((_, index) => (
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
