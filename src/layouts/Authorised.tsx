import { FC, PropsWithChildren } from 'react';
import { useRouter } from 'next/navigation';
import {
  MessageCircle,
  Users,
  User,
  Newspaper,
  AlertOctagon,
  Image,
} from 'lucide-react';

import { Header } from '@/components/Header';

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
    <div className='flex flex-col min-h-screen'>
      <Header />
      <div className='flex-1 flex justify-center bg-gray-100'>
        <div className='w-full max-w-[1150px] px-10 mt-5 mb-5'>
          <div className='grid grid-cols-[175px_minmax(0,1fr)] gap-5'>
            <ul className='flex gap-5 flex-col'>
              {lis.map((li) => (
                <li
                  key={li}
                  onClick={() => {
                    router.push(`/${li}`);
                  }}
                  className='text-sm hover:bg-gray-200 rounded p-2 cursor-pointer flex gap-2 items-center'
                >
                  {icon(li, 20)}
                  <span>{menuItemName(li)}</span>
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
