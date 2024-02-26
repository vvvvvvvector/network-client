import { useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';

import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';

import { FriendsList } from '@/components/friends/friends-list';

import { type UserFromListOfUsers } from '@/lib/types';
import { cn } from '@/lib/utils';
import { PAGES } from '@/lib/constants';

import { useConnectionsInformation } from '@/hooks/use-connections-information';

export const Friends = ({ users }: { users: UserFromListOfUsers[] }) => {
  const router = useRouter();

  const searchParams = useSearchParams();

  const params = new URLSearchParams(searchParams?.toString());

  useEffect(() => {
    switch (params.get('tab')) {
      case 'all':
        router.replace(`${PAGES.FRIENDS}?tab=all`);
        break;
      case 'online':
        router.replace(`${PAGES.FRIENDS}?tab=online`);
        break;
      default:
        router.replace(`${PAGES.FRIENDS}?tab=all`);
    }
  }, [router]);

  const connectionsInformation = useConnectionsInformation(
    users.reduce(
      (accumulator, currentValue) =>
        Object.assign(accumulator, {
          [currentValue.username]: 'offline'
        }),
      {}
    )
  );

  return (
    <>
      <div className='flex items-center justify-between text-sm'>
        <ul className='flex gap-3 sm:gap-7'>
          <li
            onClick={() => router.replace(`${PAGES.FRIENDS}?tab=all`)}
            className={cn(
              `cursor-pointer rounded p-2 px-[1rem] py-[0.5rem] hover:bg-accent`,
              {
                'bg-accent': params.get('tab') === 'all'
              }
            )}
          >
            <span className='flex sm:hidden'>{`All [${users.length}]`}</span>
            <span className='hidden sm:flex'>{`All friends [${users.length}]`}</span>
          </li>
          <li
            onClick={() => router.replace(`${PAGES.FRIENDS}?tab=online`)}
            className={cn(
              `cursor-pointer rounded p-2 px-[1rem] py-[0.5rem] hover:bg-accent`,
              {
                'bg-accent': params.get('tab') === 'online'
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
        <Button onClick={() => router.replace(`${PAGES.FRIENDS_FIND}?page=1`)}>
          <span className='flex sm:hidden'>Find</span>
          <span className='hidden sm:flex'>Find friends</span>
        </Button>
      </div>
      <Separator className='my-4' />
      <FriendsList
        friends={users}
        connectionsInformation={connectionsInformation}
      />
    </>
  );
};
