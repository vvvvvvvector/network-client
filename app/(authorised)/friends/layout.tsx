'use client';

import { usePathname } from 'next/navigation';
import Link from 'next/link';

import { cn } from '@/lib/utils';
import { PAGES } from '@/lib/constants';

export default function FriendsLayout({
  children
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();

  return (
    <div className='flex flex-col-reverse gap-5 lg:grid lg:grid-cols-[minmax(0,2.5fr)_minmax(0,1fr)] lg:items-start'>
      <div className='flex flex-col rounded-lg bg-background p-5'>
        {children}
      </div>
      <div className='rounded-lg bg-background p-5'>
        <ul className='flex flex-col gap-2'>
          <Link
            href={{
              pathname: PAGES.FRIENDS,
              query: {
                tab: 'all'
              }
            }}
          >
            <li
              className={cn(
                'cursor-pointer rounded p-2 text-sm transition-[background-color] hover:bg-accent',
                {
                  'bg-accent': pathname === PAGES.FRIENDS
                }
              )}
            >
              My friends
            </li>
          </Link>
          <Link
            href={{
              pathname: PAGES.FRIENDS_REQUESTS,
              query: {
                type: 'incoming'
              }
            }}
          >
            <li
              className={cn(
                'cursor-pointer rounded p-2 text-sm transition-[background-color] hover:bg-accent',
                {
                  'bg-accent': pathname === PAGES.FRIENDS_REQUESTS
                }
              )}
            >
              Friend requests
            </li>
          </Link>
        </ul>
      </div>
    </div>
  );
}
