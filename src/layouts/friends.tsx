import { FC, PropsWithChildren } from 'react';
import { useRouter } from 'next/router';

import { cn } from '@/lib/utils';

import { PAGES } from '@/lib/constants';

export const Friends: FC<PropsWithChildren> = ({ children }) => {
  const router = useRouter();

  const onClickMyFriendsTab = () => router.push(PAGES.FRIENDS_ALL);

  const onClickFriendRequestsTab = () => router.push(PAGES.FRIENDS_REQUESTS);

  return (
    <div className='grid grid-cols-[650px_minmax(0,1fr)] gap-5'>
      <div className='flex flex-col rounded-lg bg-background p-5'>
        {children}
      </div>
      <div className='h-[125px] rounded-lg bg-background p-5'>
        <ul className='flex flex-col gap-2'>
          <li
            onClick={onClickMyFriendsTab}
            className={cn(
              'cursor-pointer rounded p-2 text-sm transition-[background-color] hover:bg-accent',
              {
                'bg-accent': router.asPath === PAGES.FRIENDS_ALL
              }
            )}
          >
            My friends
          </li>
          <li
            onClick={onClickFriendRequestsTab}
            className={cn(
              'cursor-pointer rounded p-2 text-sm transition-[background-color] hover:bg-accent',
              {
                'bg-accent': router.asPath === PAGES.FRIENDS_REQUESTS
              }
            )}
          >
            Friend requests
          </li>
        </ul>
      </div>
    </div>
  );
};
