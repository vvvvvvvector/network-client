import { FC, PropsWithChildren } from 'react';

import { useRouter } from 'next/router';

export const Friends: FC<PropsWithChildren> = ({ children }) => {
  const router = useRouter();

  return (
    <div className='grid grid-cols-[600px_minmax(0,1fr)] gap-5'>
      <div className='flex flex-col bg-white p-5 rounded-lg'>{children}</div>
      <div className='flex-1 bg-white p-5 rounded-lg h-[125px]'>
        <ul className='flex flex-col gap-2'>
          <li
            onClick={() => router.push('/friends')}
            className={`${
              router.asPath === '/friends' && 'bg-gray-50 font-semibold'
            } text-sm hover:bg-gray-50 rounded p-2 cursor-pointer`}
          >
            My friends
          </li>
          <li
            onClick={() => router.push('/friends/requests')}
            className={`${
              router.asPath === '/friends/requests' &&
              'bg-gray-50 font-semibold'
            } text-sm hover:bg-gray-50 rounded p-2 cursor-pointer`}
          >
            Friend requests
          </li>
        </ul>
      </div>
    </div>
  );
};
