import { Header } from '@/components/Header';
import { MessageCircle, Users, User, Newspaper } from 'lucide-react';
import { FC, PropsWithChildren } from 'react';

import { useRouter } from 'next/navigation';

export const Authorized: FC<PropsWithChildren> = ({ children }) => {
  const router = useRouter();

  return (
    <div className='flex flex-col min-h-screen'>
      <Header />
      <div className='flex-1 flex justify-center bg-gray-100'>
        <div className='w-full max-w-[1150px] px-10 mt-5 mb-5'>
          <div className='grid grid-cols-[175px_minmax(0,1fr)] gap-5'>
            <ul className='flex gap-5 flex-col'>
              <li
                onClick={() => {
                  router.push('/profile');
                }}
                className='text-sm hover:bg-gray-200 rounded p-2 cursor-pointer flex gap-2 items-center'
              >
                <User size={20} />
                <span>My profile</span>
              </li>
              <li
                onClick={() => {
                  router.push('/news');
                }}
                className='text-sm hover:bg-gray-200 rounded p-2 cursor-pointer flex gap-2 items-center'
              >
                <Newspaper size={20} />
                <span>News</span>
              </li>
              <li
                onClick={() => {
                  router.push('/messenger');
                }}
                className='text-sm hover:bg-gray-200 rounded p-2 cursor-pointer flex gap-2 items-center'
              >
                <MessageCircle size={20} />
                <span>Messenger</span>
              </li>
              <li
                onClick={() => {
                  router.push('/friends');
                }}
                className='text-sm hover:bg-gray-200 rounded p-2 cursor-pointer flex gap-2 items-center'
              >
                <Users size={20} />
                <span>Friends</span>
              </li>
            </ul>
            <main>{children}</main>
          </div>
        </div>
      </div>
    </div>
  );
};
