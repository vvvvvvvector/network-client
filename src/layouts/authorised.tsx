import { FC, PropsWithChildren } from 'react';
import { useRouter } from 'next/navigation';
import {
  MessageCircle,
  Users,
  UserCircle,
  Newspaper,
  Image
} from 'lucide-react';

import { Header } from '@/components/header';

import { capitalize } from '@/lib/utils';

const pages = ['profile', 'news', 'messenger', 'friends', 'photos'] as const;

const icon = (type: (typeof pages)[number], size: number) => {
  switch (type) {
    case 'profile':
      return <UserCircle size={size} />;
    case 'news':
      return <Newspaper size={size} />;
    case 'messenger':
      return <MessageCircle size={size} />;
    case 'friends':
      return <Users size={size} />;
    case 'photos':
      return <Image size={size} />;
    default:
      const _: never = type;
      throw 'Not all cases are covered';
  }
};

const menuItemName = (type: (typeof pages)[number]) => {
  switch (type) {
    case 'profile':
      return `My ${type}`;
    default:
      return capitalize(type);
  }
};

export const Authorized: FC<PropsWithChildren> = ({ children }) => {
  const router = useRouter();

  return (
    <div className='flex min-h-screen flex-col'>
      <Header />
      <div className='flex flex-1 justify-center bg-authorised'>
        <div className='mb-5 mt-5 w-full max-w-authorised px-5'>
          <div className='grid grid-cols-1 gap-5 md:grid-cols-[175px_minmax(0,1fr)]'>
            <ul className='hidden gap-5 md:flex md:flex-col'>
              {pages.map((page) => (
                <li
                  key={page}
                  onClick={() => router.push(`/${page}`)}
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
