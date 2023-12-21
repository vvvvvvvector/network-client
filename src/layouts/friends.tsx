import type { FC, PropsWithChildren } from 'react';

import { cn } from '@/lib/utils';
import { PAGES } from '@/lib/constants';

import { useFrequentlyUsedHooks } from '@/hooks/use-frequently-used-hooks';

export const Friends: FC<PropsWithChildren> = ({ children }) => {
  const { router } = useFrequentlyUsedHooks();

  return (
    <div className='flex flex-col-reverse gap-5 lg:grid lg:grid-cols-[minmax(0,2.5fr)_minmax(0,1fr)] lg:items-start'>
      <div className='flex flex-col rounded-lg bg-background p-5'>
        {children}
      </div>
      <div className='rounded-lg bg-background p-5'>
        <ul className='flex flex-col gap-2'>
          <li
            onClick={() => router.push(PAGES.FRIENDS_ALL)}
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
            onClick={() => router.push(PAGES.FRIENDS_REQUESTS)}
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
