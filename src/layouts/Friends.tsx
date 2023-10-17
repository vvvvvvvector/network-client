import { FC, PropsWithChildren } from 'react';
import { useRouter } from 'next/router';

import { cn } from '@/lib/utils';

import { PAGES } from '@/lib/constants';

export const Friends: FC<PropsWithChildren> = ({ children }) => {
  const router = useRouter();

  return (
    <div className='grid grid-cols-[600px_minmax(0,1fr)] gap-5'>
      <div className='flex flex-col rounded-lg bg-background p-5'>
        {children}
      </div>
      <div className='h-[125px] rounded-lg bg-background p-5'>
        <ul className='flex flex-col gap-2'>
          <li
            onClick={() => router.push(PAGES.FRIENDS_ALL)}
            className={cn(
              'cursor-pointer rounded p-2 text-sm hover:bg-gray-50 dark:hover:bg-neutral-900',
              {
                'bg-gray-50 font-semibold dark:bg-neutral-900':
                  router.asPath === PAGES.FRIENDS_ALL
              }
            )}
          >
            My friends
          </li>
          <li
            onClick={() => router.push(PAGES.FRIENDS_REQUESTS)}
            className={cn(
              'cursor-pointer rounded p-2 text-sm hover:bg-gray-50 dark:hover:bg-neutral-900',
              {
                'bg-gray-50 font-semibold dark:bg-neutral-900':
                  router.asPath === PAGES.FRIENDS_REQUESTS
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
