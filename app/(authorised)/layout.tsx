'use client';

import Link from 'next/link';
import { useEffect } from 'react';
import { parseCookies } from 'nookies';

import { Icons } from '@/components/icons';
import { Header } from '@/components/header';

import { capitalize } from '@/lib/utils';
import { TOKEN_NAME, MAIN_NAV_PAGES as pages } from '@/lib/constants';

import { useSocketStore } from '@/zustand/socket.store';

export const icon = (type: (typeof pages)[number], size: number) => {
  switch (type) {
    case '/profile':
      return <Icons.myProfile size={size} />;
    case '/news':
      return <Icons.news size={size} />;
    case '/messenger':
      return <Icons.messenger size={size} />;
    case '/friends':
      return <Icons.friends size={size} />;
    case '/photos':
      return <Icons.photos size={size} />;
    default:
      const _: never = type; // eslint-disable-line
      throw 'Not all cases are covered';
  }
};

export const menuItemName = (type: (typeof pages)[number]) => {
  const pathname = type.slice(1);

  switch (type) {
    case '/profile':
      return `My ${pathname}`;
    default:
      return capitalize(pathname);
  }
};

export const query = (type: (typeof pages)[number]) => {
  switch (type) {
    case '/friends':
      return {
        tab: 'all'
      };
    default:
      return undefined;
  }
};

export default function AuthorizedLayout({
  children
}: {
  children: React.ReactNode;
}) {
  const { connect, disconnect } = useSocketStore();

  useEffect(() => {
    connect(parseCookies()[TOKEN_NAME]);

    return () => {
      disconnect();
    };
  }, []);

  return (
    <div className='flex min-h-screen flex-col'>
      <Header />
      <div className='flex flex-1 justify-center bg-authorised'>
        <div className='my-3 w-full max-w-authorised px-5'>
          <div className='grid grid-cols-1 gap-5 md:grid-cols-[175px_minmax(0,1fr)]'>
            <ul className='hidden gap-5 md:flex md:flex-col'>
              {pages.map((page) => (
                <Link
                  key={page}
                  href={{
                    pathname: page,
                    query: query(page)
                  }}
                >
                  <li className='flex cursor-pointer items-center gap-2 rounded p-2 text-sm transition-[background-color] hover:bg-neutral-200 dark:hover:bg-neutral-950'>
                    {icon(page, 20)}
                    <span className='ml-1'>{menuItemName(page)}</span>
                  </li>
                </Link>
              ))}
            </ul>
            <main>{children}</main>
          </div>
        </div>
      </div>
    </div>
  );
}
