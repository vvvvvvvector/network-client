import { FC, PropsWithChildren } from 'react';
import { Sun, MoonStar } from 'lucide-react';
import { useTheme } from 'next-themes';

import { useRouter } from 'next/router';

import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';

import { PAGES } from '@/lib/constants';

export const Auth: FC<PropsWithChildren> = ({ children }) => {
  const router = useRouter();

  const { theme, setTheme } = useTheme();

  return (
    <>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button
            size='icon'
            variant='outline'
            className='absolute top-8 right-8'
          >
            <Sun className='h-4 w-4 rotate-0 scale-100 dark:-rotate-90 dark:scale-0' />
            <MoonStar className='absolute h-4 w-4 rotate-90 scale-0 dark:rotate-0 dark:scale-100' />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align='end'>
          <DropdownMenuItem onClick={() => setTheme('light')}>
            Light
          </DropdownMenuItem>
          <DropdownMenuItem onClick={() => setTheme('dark')}>
            Dark
          </DropdownMenuItem>
          <DropdownMenuItem onClick={() => setTheme('system')}>
            System
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
      <div className='dark:bg-neutral-900 w-full h-full grid place-items-center'>
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
              className='dark:hover:text-foreground hover:text-foreground hover:underline'
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
    </>
  );
};
