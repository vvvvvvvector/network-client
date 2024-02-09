import { type PropsWithChildren } from 'react';
import { useTheme } from 'next-themes';

import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger
} from '@/components/ui/dropdown-menu';

import { PAGES } from '@/lib/constants';

import { useFrequentlyUsedHooks } from '@/hooks/use-frequently-used-hooks';
import { Icons } from '@/components/icons';

export const Auth = ({ children }: PropsWithChildren) => {
  const { router } = useFrequentlyUsedHooks();

  const { setTheme } = useTheme();

  return (
    <>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button
            size='icon'
            variant='outline'
            className='absolute right-8 top-8'
          >
            <Icons.lightMode className='size-4 rotate-0 scale-100 dark:-rotate-90 dark:scale-0' />
            <Icons.darkMode className='absolute size-4 rotate-90 scale-0 dark:rotate-0 dark:scale-100' />
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
      <div className='grid size-full place-items-center dark:bg-neutral-900'>
        <div className='w-full max-w-[350px] space-y-7'>
          <h3 className='text-center text-lg font-medium'>{`${
            router.asPath === PAGES.SIGN_IN ? 'Hello 👋' : 'Create your account'
          }`}</h3>
          {children}
          <Separator />
          <div className='space-x-4 text-center text-sm text-muted-foreground'>
            <span>{`${
              router.asPath === PAGES.SIGN_IN
                ? "Don't have an account?"
                : 'Already have an account?'
            }`}</span>
            <button
              className='hover:text-foreground hover:underline dark:hover:text-foreground'
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
