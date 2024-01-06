import { useEffect } from 'react';
import { Check, Undo2, X } from 'lucide-react';
import Link from 'next/link';

import type { RequestsTypes } from '@/pages/friends/requests';

import { Button } from '@/components/ui/button';
import { Tooltip } from '@/components/tooltip';
import { Avatar } from '@/components/avatar';

import { useRequestsActions } from '@/hooks/use-requests-actions';
import { useFrequentlyUsedHooks } from '@/hooks/use-frequently-used-hooks';

import { ICON_INSIDE_BUTTON_SIZE } from '@/lib/constants';
import type { UserFromListOfUsers } from '@/lib/types';

const BUTTONS: Record<
  RequestsTypes,
  ({
    onClicks
  }: {
    onClicks: Array<
      (e: React.MouseEvent<HTMLButtonElement, MouseEvent>) => Promise<void>
    >;
  }) => React.JSX.Element
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

interface Props {
  requests: {
    incoming: Array<UserFromListOfUsers>;
    outgoing: Array<UserFromListOfUsers>;
    rejected: Array<UserFromListOfUsers>;
  };
}

export const RequestsList = ({ requests }: Props) => {
  const { router } = useFrequentlyUsedHooks();

  const type = router.query.type as RequestsTypes;

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

  useEffect(() => {
    switch (router.query.type) {
      case 'incoming':
        router.push({
          pathname: router.pathname,
          query: {
            type: 'incoming'
          }
        });
        break;
      case 'outgoing':
        router.push({
          pathname: router.pathname,
          query: {
            type: 'outgoing'
          }
        });
        break;
      case 'rejected':
        router.push({
          pathname: router.pathname,
          query: {
            type: 'rejected'
          }
        });
        break;
      default:
        router.push({
          pathname: router.pathname,
          query: {
            type: 'incoming'
          }
        });
        break;
    }
  }, [type]);

  if (!requests[type]?.length) {
    return (
      <span className='my-7 text-center'>
        {`You don't have any ${type} requests yet.`}
      </span>
    );
  }

  return (
    <ul className='flex flex-col gap-5'>
      {requests[type].map((user) => (
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
          {BUTTONS[type]({
            onClicks: ON_CLICKS(type)(user.username)
          })}
        </li>
      ))}
    </ul>
  );
};
