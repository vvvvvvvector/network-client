import { useState } from 'react';
import { GetServerSideProps, GetServerSidePropsContext } from 'next';
import { Check, X, Undo2 } from 'lucide-react';

import { NextPageWithLayout } from '@/pages/_app';

import { Authorized } from '@/layouts/authorised';
import { Friends } from '@/layouts/friends';
import { Main } from '@/layouts/main';

import { Separator } from '@/components/ui/separator';
import { Button } from '@/components/ui/button';
import { Tooltip } from '@/components/tooltip';
import { Avatar } from '@/components/avatar';

import {
  getIncomingFriendRequests,
  getOutgoingFriendRequests,
  getRejectedFriendRequests
} from '@/api/friends';

import { isAuthorized } from '@/lib/auth';
import { capitalize, cn } from '@/lib/utils';
import { UserFromListOfUsers } from '@/lib/types';
import { ICON_INSIDE_BUTTON_SIZE } from '@/lib/constants';

import { useRequestsActions } from '@/hooks/use-requests-actions';
import { useCommonActions } from '@/hooks/use-common-actions';

interface Props {
  requests: {
    incoming: Array<UserFromListOfUsers>;
    outgoing: Array<UserFromListOfUsers>;
    rejected: Array<UserFromListOfUsers>;
  };
}

const lis = ['incoming', 'outgoing', 'rejected'] as const;
type RequestsTypes = (typeof lis)[number];

const BUTTONS: Record<
  RequestsTypes,
  React.FC<{
    onClicks: Array<
      (e: React.MouseEvent<HTMLButtonElement, MouseEvent>) => Promise<void>
    >;
  }>
> = {
  incoming: ({ onClicks }) => {
    return (
      <div className='flex gap-3'>
        <Tooltip text='Accept friend request'>
          <Button onClick={onClicks[0]} variant='outline'>
            <Check size={ICON_INSIDE_BUTTON_SIZE} />
          </Button>
        </Tooltip>
        <Tooltip text='Reject friend request'>
          <Button onClick={onClicks[1]} variant='outline'>
            <X size={ICON_INSIDE_BUTTON_SIZE} />
          </Button>
        </Tooltip>
      </div>
    );
  },
  outgoing: ({ onClicks }) => {
    return (
      <Tooltip text='Cancel request'>
        <Button onClick={onClicks[0]} variant='outline'>
          <Undo2 size={ICON_INSIDE_BUTTON_SIZE} />
        </Button>
      </Tooltip>
    );
  },
  rejected: ({ onClicks }) => {
    return (
      <Tooltip text='Add to friends'>
        <Button onClick={onClicks[0]} variant='outline'>
          <Check size={ICON_INSIDE_BUTTON_SIZE} />
        </Button>
      </Tooltip>
    );
  }
};

const List = ({
  type,
  data
}: {
  type: RequestsTypes;
  data: Array<UserFromListOfUsers>;
}) => {
  const { goToProfile } = useCommonActions();

  const { accept, reject, cancel } = useRequestsActions();

  const ON_CLICKS = (type: RequestsTypes) => {
    return (username: string) => {
      switch (type) {
        case 'incoming':
          return [accept(username), reject(username)];
        case 'outgoing':
          return [cancel(username)];
        case 'rejected':
          return [accept(username)];
      }
    };
  };

  return (
    <>
      {data.length > 0 ? (
        <ul className='flex flex-col gap-5'>
          {data.map((request) => (
            <li
              className='flex items-center justify-between py-2'
              key={request.username}
            >
              <div className='flex items-center gap-3'>
                <Avatar
                  size='medium'
                  username={request.username}
                  avatar={request.profile.avatar?.name}
                />
                <span
                  onClick={goToProfile(request.username)}
                  className='cursor-pointer hover:underline'
                >
                  {request.username}
                </span>
              </div>
              {BUTTONS[type]({
                onClicks: ON_CLICKS(type)(request.username)
              })}
            </li>
          ))}
        </ul>
      ) : (
        <span className='mb-7 mt-7 text-center'>
          {`You don't have any ${type} requests yet.`}
        </span>
      )}
    </>
  );
};

const Requests: NextPageWithLayout<Props> = ({ requests }) => {
  const [requestsListType, setRequestsListType] =
    useState<RequestsTypes>('incoming');

  return (
    <>
      <div className='text-sm'>
        <ul className='flex gap-7'>
          {lis.map((li) => (
            <li
              key={li}
              onClick={() => setRequestsListType(li)}
              className={cn(
                'cursor-pointer rounded p-2 px-[1rem] py-[0.5rem] transition-[background-color] hover:bg-accent',
                {
                  'bg-accent': requestsListType === li
                }
              )}
            >
              {`${capitalize(li)} [${requests[li].length}]`}
            </li>
          ))}
        </ul>
      </div>
      <Separator className='mb-4 mt-4' />
      <List type={requestsListType} data={requests[requestsListType]} />
    </>
  );
};

Requests.getLayout = (page) => (
  <Main title='Friends / Requests'>
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

    const requests = await Promise.all([
      getIncomingFriendRequests(),
      getOutgoingFriendRequests(),
      getRejectedFriendRequests()
    ]);

    return {
      props: {
        requests: {
          incoming: requests[0],
          outgoing: requests[1],
          rejected: requests[2]
        }
      }
    };
  } catch (error) {
    return {
      props: {
        requests: {}
      }
    };
  }
};

export default Requests;
