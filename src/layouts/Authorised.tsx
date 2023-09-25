import { Header } from '@/components/Header';
import { MessageCircle, Users, User } from 'lucide-react';
import { FC, PropsWithChildren } from 'react';

import { useRouter } from 'next/navigation';

export const Authorized: FC<PropsWithChildren> = ({ children }) => {
  const router = useRouter();

  return (
    <div className='relative flex flex-col min-h-screen'>
      <Header />
      <div className='flex-1 flex justify-center bg-gray-100'>
        <div className='w-full max-w-[1100px] px-10 mt-5'>
          <div className='flex-1 flex gap-4'>
            <ul className='flex flex-col gap-5 w-full max-w-[175px]'>
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
            <main className='flex-1'>{children}</main>
          </div>
        </div>
      </div>
    </div>
  );
};
