import { FC, PropsWithChildren } from 'react';

import { useRouter } from 'next/router';

import { Separator } from '@/components/ui/separator';

export const Auth: FC<PropsWithChildren> = ({ children }) => {
  const router = useRouter();

  return (
    <div className='w-full h-full grid place-items-center'>
      <div className='w-full max-w-[350px] space-y-7'>
        <h3 className='text-lg font-medium text-center'>{`${
          router.asPath === '/' ? 'Hello 👋' : 'Create your account'
        }`}</h3>
        {children}
        <Separator />
        <div className='text-sm text-muted-foreground text-center space-x-4'>
          <span>{`${
            router.asPath === '/'
              ? "Don't have an account?"
              : 'Already have an account?'
          }`}</span>
          <button
            className='hover:text-black hover:underline'
            onClick={
              router.asPath === '/'
                ? () => router.push('/signup')
                : () => router.push('/')
            }
          >
            {`${router.asPath === '/' ? 'Sign in' : 'Sign up'}`}
          </button>
        </div>
      </div>
    </div>
  );
};
