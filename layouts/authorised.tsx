import { type PropsWithChildren } from 'react';
import { useEffect } from 'react';
import {
  MessageCircle,
  Users,
  UserCircle,
  Newspaper,
  Image
} from 'lucide-react';
import { parseCookies } from 'nookies';

import { Header } from '@/components/header';

import { capitalize } from '@/lib/utils';
import { TOKEN_NAME, MAIN_NAV_PAGES as pages } from '@/lib/constants';

import { useFrequentlyUsedHooks } from '@/hooks/use-frequently-used-hooks';

import { useSocketStore } from '@/zustand/socket.store';

export const icon = (type: (typeof pages)[number], size: number) => {
  switch (type) {
    case '/profile':
      return <UserCircle size={size} />;
    case '/news':
      return <Newspaper size={size} />;
    case '/messenger':
      return <MessageCircle size={size} />;
    case '/friends':
      return <Users size={size} />;
    case '/photos':
      return <Image size={size} />;
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

export const Authorized = ({ children }: PropsWithChildren) => {
  const { router } = useFrequentlyUsedHooks();

  const { connect, disconnect } = useSocketStore();

  useEffect(() => {
    // console.log('authorized');

    connect(parseCookies()[TOKEN_NAME]);

    return () => {
      // console.log('unauthorized');

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
                <li
                  key={page}
                  onClick={() => {
                    if (page === '/friends') {
                      router.push({
                        pathname: `${page}`,
                        query: {
                          tab: 'all'
                        }
                      });
                    } else {
                      router.push(`${page}`);
                    }
                  }}
                  className='flex cursor-pointer items-center gap-2 rounded p-2 text-sm transition-[background-color] hover:bg-neutral-200 dark:hover:bg-neutral-950'
                >
                  {icon(page, 20)}
                  <span className='ml-1'>{menuItemName(page)}</span>
                </li>
              ))}
            </ul>
            <main>{children}</main>
          </div>
        </div>
      </div>
    </div>
  );
};
