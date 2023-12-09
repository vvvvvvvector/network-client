import { FC } from 'react';
import { Check, Undo2, X } from 'lucide-react';

import { RequestsTypes } from '@/pages/friends/requests';

import { Button } from '@/components/ui/button';
import { Tooltip } from '@/components/tooltip';
import { Avatar } from '@/components/avatar';

import { useCommonActions } from '@/hooks/use-common-actions';
import { useRequestsActions } from '@/hooks/use-requests-actions';

import { ICON_INSIDE_BUTTON_SIZE } from '@/lib/constants';
import { UserFromListOfUsers } from '@/lib/types';

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

interface Props {
  type: RequestsTypes;
  users: UserFromListOfUsers[];
}

export const RequestsList: FC<Props> = ({ type, users }) => {
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

  if (!users.length) {
    return (
      <span className='mb-7 mt-7 text-center'>
        {`You don't have any ${type} requests yet.`}
      </span>
    );
  }

  return (
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
              avatar={user.profile.avatar?.name}
            />
            <span
              onClick={goToProfile(user.username)}
              className='cursor-pointer hover:underline'
            >
              {user.username}
            </span>
          </div>
          {BUTTONS[type]({
            onClicks: ON_CLICKS(type)(user.username)
          })}
        </li>
      ))}
    </ul>
  );
};
