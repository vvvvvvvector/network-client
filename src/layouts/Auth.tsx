import { FC, PropsWithChildren } from 'react';

import { useRouter } from 'next/router';

import { Separator } from '@/components/ui/separator';

import { PAGES } from '@/lib/constants';

export const Auth: FC<PropsWithChildren> = ({ children }) => {
  const router = useRouter();

  return (
    <div className='dark:bg-neutral-800 w-full h-full grid place-items-center'>
      <div className='w-full max-w-[350px] space-y-7'>
        <h3 className='text-lg font-medium text-center'>{`${
          router.asPath === PAGES.SIGN_IN ? 'Hello 👋' : 'Create your account'
        }`}</h3>
        {children}
        <Separator />
        <div className='text-sm text-muted-foreground text-center space-x-4'>
          <span>{`${
            router.asPath === PAGES.SIGN_IN
              ? "Don't have an account?"
              : 'Already have an account?'
          }`}</span>
          <button
            className='hover:text-black hover:underline'
            onClick={
              router.asPath === PAGES.SIGN_IN
                ? () => router.push(PAGES.SIGN_UP)
                : () => router.push(PAGES.SIGN_IN)
            }
          >
            {`${router.asPath === PAGES.SIGN_IN ? 'Sign up' : 'Sign in'}`}
          </button>
        </div>
      </div>
    </div>
  );
};
