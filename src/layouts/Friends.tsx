import { FC, PropsWithChildren } from 'react';
import { useRouter } from 'next/router';

import { cn } from '@/lib/utils';

import { PAGES } from '@/lib/constants';

export const Friends: FC<PropsWithChildren> = ({ children }) => {
  const router = useRouter();

  return (
    <div className='grid grid-cols-[600px_minmax(0,1fr)] gap-5'>
      <div className='flex flex-col bg-background p-5 rounded-lg'>
        {children}
      </div>
      <div className='bg-background p-5 rounded-lg h-[125px]'>
        <ul className='flex flex-col gap-2'>
          <li
            onClick={() => router.push(PAGES.FRIENDS_ALL)}
            className={cn(
              'text-sm dark:hover:bg-neutral-900 hover:bg-gray-50 rounded p-2 cursor-pointer',
              {
                'dark:bg-neutral-900 bg-gray-50 font-semibold':
                  router.asPath === PAGES.FRIENDS_ALL,
              }
            )}
          >
            My friends
          </li>
          <li
            onClick={() => router.push(PAGES.FRIENDS_REQUESTS)}
            className={cn(
              'text-sm dark:hover:bg-neutral-900 hover:bg-gray-50 rounded p-2 cursor-pointer',
              {
                'dark:bg-neutral-900 bg-gray-50 font-semibold':
                  router.asPath === PAGES.FRIENDS_REQUESTS,
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
