import { FC, PropsWithChildren } from 'react';
import { useRouter } from 'next/navigation';
import {
  MessageCircle,
  Users,
  User,
  Newspaper,
  AlertOctagon,
  Image
} from 'lucide-react';

import { Header } from '@/components/header';

import { capitalize } from '@/lib/utils';

const lis = ['profile', 'news', 'messenger', 'friends', 'photos'] as const;

const icon = (type: (typeof lis)[number], size: number) => {
  switch (type) {
    case 'profile':
      return <User size={size} />;
    case 'news':
      return <Newspaper size={size} />;
    case 'messenger':
      return <MessageCircle size={size} />;
    case 'friends':
      return <Users size={size} />;
    case 'photos':
      return <Image size={size} />;
    default:
      return <AlertOctagon size={size} />;
  }
};

const menuItemName = (type: (typeof lis)[number]) => {
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
      <div className='flex flex-1 justify-center bg-gray-100 dark:bg-neutral-900'>
        <div className='mb-5 mt-5 w-full max-w-[1150px] px-10'>
          <div className='grid grid-cols-[175px_minmax(0,1fr)] gap-5'>
            <ul className='flex flex-col gap-5'>
              {lis.map((li) => (
                <li
                  key={li}
                  onClick={() => {
                    router.push(`/${li}`);
                  }}
                  className='flex cursor-pointer items-center gap-2 rounded p-2 text-sm hover:bg-gray-200 dark:hover:bg-neutral-950'
                >
                  {icon(li, 20)}
                  <span className='ml-1'>{menuItemName(li)}</span>
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
