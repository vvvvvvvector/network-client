import { useEffect } from 'react';

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

export const Friends = ({ users }: Props) => {
  const { router } = useFrequentlyUsedHooks();

  useEffect(() => {
    switch (router.query.tab) {
      case 'all':
        router.push({
          pathname: PAGES.FRIENDS,
          query: {
            tab: 'all'
          }
        });
        break;
      case 'online':
        router.push({
          pathname: PAGES.FRIENDS,
          query: {
            tab: 'online'
          }
        });
        break;
      default:
        router.push({
          pathname: PAGES.FRIENDS,
          query: {
            tab: 'all'
          }
        });
        break;
    }
  }, [router.query.tab]);

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
            onClick={() =>
              router.push({
                pathname: PAGES.FRIENDS,
                query: {
                  tab: 'all'
                }
              })
            }
            className={cn(
              `cursor-pointer rounded p-2 px-[1rem] py-[0.5rem] hover:bg-accent`,
              {
                'bg-accent': router.query.tab === 'all'
              }
            )}
          >
            <span className='flex sm:hidden'>{`All [${users.length}]`}</span>
            <span className='hidden sm:flex'>{`All friends [${users.length}]`}</span>
          </li>
          <li
            onClick={() =>
              router.push({
                pathname: PAGES.FRIENDS,
                query: {
                  tab: 'online'
                }
              })
            }
            className={cn(
              `cursor-pointer rounded p-2 px-[1rem] py-[0.5rem] hover:bg-accent`,
              {
                'bg-accent': router.query.tab === 'online'
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
          <span className='flex sm:hidden'>Find</span>
          <span className='hidden sm:flex'>Find friends</span>
        </Button>
      </div>
      <Separator className='mb-4 mt-4' />
      <FriendsList
        friends={users}
        connectionsInformation={connectionsInformation}
      />
    </>
  );
};
