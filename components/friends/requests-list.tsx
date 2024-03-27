'use client';

import { useEffect } from 'react';
import Link from 'next/link';
import { useRouter, usePathname } from 'next/navigation';

import { Button } from '@/components/ui/button';

import { Tooltip } from '@/components/tooltip';
import { Icons } from '@/components/icons';
import { Avatar } from '@/components/avatar';

import { useRequestsActions } from '@/hooks/use-requests-actions';
import { useTab } from '@/hooks/use-tab';

import { ICON_INSIDE_BUTTON_SIZE } from '@/lib/constants';
import { type UserFromListOfUsers } from '@/lib/types';

import { types } from '@/app/(authorised)/friends/requests/page';

const BUTTONS: Record<
  (typeof types)[number],
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
            <Icons.accept className={ICON_INSIDE_BUTTON_SIZE} />
          </Button>
        </Tooltip>
        <Tooltip text='Reject friend request'>
          <Button onClick={onClicks[1]} variant='outline'>
            <Icons.reject className={ICON_INSIDE_BUTTON_SIZE} />
          </Button>
        </Tooltip>
      </div>
    );
  },
  outgoing: ({ onClicks }) => {
    return (
      <Tooltip text='Cancel request'>
        <Button onClick={onClicks[0]} variant='outline'>
          <Icons.undo className={ICON_INSIDE_BUTTON_SIZE} />
        </Button>
      </Tooltip>
    );
  },
  rejected: ({ onClicks }) => {
    return (
      <Tooltip text='Add to friends'>
        <Button onClick={onClicks[0]} variant='outline'>
          <Icons.accept className={ICON_INSIDE_BUTTON_SIZE} />
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
  const router = useRouter();
  const pathname = usePathname();

  const type = useTab<typeof types>('type');

  const { accept, reject, cancel } = useRequestsActions();

  const ON_CLICKS = (type: (typeof types)[number]) => {
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
    switch (type) {
      case 'incoming':
        router.replace(`${pathname}?type=${type}`);
        break;
      case 'outgoing':
        router.replace(`${pathname}?type=${type}`);
        break;
      case 'rejected':
        router.replace(`${pathname}?type=${type}`);
        break;
      default:
        router.replace(`${pathname}?type=incoming`);
    }
  }, [router]);

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
