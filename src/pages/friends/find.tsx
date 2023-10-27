import { useState } from 'react';
import { GetServerSideProps, GetServerSidePropsContext } from 'next';
import { Search, UserPlus, SearchSlash } from 'lucide-react';

import { NextPageWithLayout } from '@/pages/_app';

import { Main } from '@/layouts/main';
import { Authorized } from '@/layouts/authorised';
import { Friends } from '@/layouts/friends';

import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { Input } from '@/components/ui/input';
import { Tooltip } from '@/components/tooltip';
import { Avatar } from '@/components/avatar';
import { Pagination } from '@/components/pagination';

import { getNetworkUsersUsernames } from '@/api/friends';

import { useCombain } from '@/hooks/use-combain';
import { useRequestsActions } from '@/hooks/use-requests-actions';
import { useCommonActions } from '@/hooks/use-common-actions';

import { isAuthorized } from '@/lib/auth';
import { ProfileWithAvatar, User } from '@/lib/types';
import { ICON_INSIDE_BUTTON_SIZE } from '@/lib/constants';

export type RequestStatus = 'rejected' | 'accepted' | 'pending' | 'lack';

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
  const { router } = useCombain();

  const { send } = useRequestsActions();
  const { goToProfile } = useCommonActions();

  const [searchValue, setSearchValue] = useState('');
  const [currentPage, setCurrentPage] = useState(1);

  const onClickSearch = () => async () => {
    if (searchValue) {
      await router.push(
        {
          query: {
            page: 1,
            username: searchValue
          }
        },
        undefined,
        { scroll: false }
      );

      setCurrentPage(1);
    }
  };

  const onClickResetSearch = () => async () => {
    await router.push(
      {
        query: {
          page: 1
        }
      },
      undefined,
      { scroll: false }
    );

    setCurrentPage(1);

    setSearchValue('');
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
          <Button onClick={onClickSearch()} size='icon' className='w-14'>
            <Search size={ICON_INSIDE_BUTTON_SIZE} />
          </Button>
        ) : (
          <Tooltip text='Reset search'>
            <Button onClick={onClickResetSearch()} size='icon' className='w-14'>
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
                <Avatar
                  size='medium'
                  username={user.username}
                  avatar={user.profile?.avatar}
                />
                <span
                  onClick={goToProfile(user.username)}
                  className='cursor-pointer hover:underline'
                >
                  {user.username}
                </span>
              </div>
              {user.requestStatus === 'lack' ? (
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
      <Pagination
        display={users.length > 0 && totalPages > 1}
        currentPage={currentPage}
        setCurrentPage={setCurrentPage}
        totalPages={totalPages}
      />
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
