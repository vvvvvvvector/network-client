import { type FC, useState } from 'react';

import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { FriendsList } from '@/components/friends/friends-list';

import type { UserFromListOfUsers } from '@/lib/types';
import { cn } from '@/lib/utils';
import { PAGES } from '@/lib/constants';

import { useFrequentlyUsedHooks } from '@/hooks/use-frequently-used-hooks';
import { useConnectionsInformation } from '@/hooks/use-connections-information';

interface Props {
  users: UserFromListOfUsers[];
}

export const Friends: FC<Props> = ({ users }) => {
  const [tab, setTab] = useState<'all' | 'online'>('all');

  const connectionsInformation = useConnectionsInformation(
    users.reduce(
      (accumulator, currentValue) =>
        Object.assign(accumulator, {
          [currentValue.username]: 'offline'
        }),
      {}
    )
  );

  const { router } = useFrequentlyUsedHooks();

  return (
    <>
      <div className='flex items-center justify-between text-sm'>
        <ul className='flex gap-7'>
          <li
            onClick={() => setTab('all')}
            className={cn(
              `cursor-pointer rounded p-2 px-[1rem] py-[0.5rem] hover:bg-accent`,
              {
                'bg-accent': tab === 'all'
              }
            )}
          >
            {`All friends [${users.length}]`}
          </li>
          <li
            onClick={() => setTab('online')}
            className={cn(
              `cursor-pointer rounded p-2 px-[1rem] py-[0.5rem] hover:bg-accent`,
              {
                'bg-accent': tab === 'online'
              }
            )}
          >
            {`Online [${
              Object.values(connectionsInformation).filter(
                (val) => val === 'online'
              ).length
            }]`}
          </li>
        </ul>
        <Button
          onClick={() => {
            router.push({
              pathname: PAGES.FRIENDS_FIND,
              query: {
                page: 1
              }
            });
          }}
        >
          Find friends
        </Button>
      </div>
      <Separator className='mb-4 mt-4' />
      <FriendsList
        listType={tab}
        friends={users}
        connectionsInformation={connectionsInformation}
      />
    </>
  );
};
