import { Header } from '@/components/Header';
import {
  MessageCircle,
  Users,
  User,
  Newspaper,
  AlertOctagon,
} from 'lucide-react';
import { FC, PropsWithChildren } from 'react';

import { useRouter } from 'next/navigation';

const lis = ['profile', 'news', 'messenger', 'friends'] as const;

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
    default:
      return <AlertOctagon size={size} />;
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
                  <span>
                    {li === 'profile'
                      ? 'My profile'
                      : `${li[0].toUpperCase() + li.substring(1)}`}
                  </span>
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
