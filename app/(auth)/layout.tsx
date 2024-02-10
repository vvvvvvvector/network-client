'use client';

import { useTheme } from 'next-themes';
import { usePathname } from 'next/navigation';
import Link from 'next/link';

import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger
} from '@/components/ui/dropdown-menu';

import { Icons } from '@/components/icons';

import { PAGES } from '@/lib/constants';

export default function AuthLayout({
  children
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();

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
            pathname === PAGES.SIGN_IN ? 'Hello 👋' : 'Create your account'
          }`}</h3>
          {children}
          <Separator />
          <div className='space-x-4 text-center text-sm text-muted-foreground'>
            <span>{`${
              pathname === PAGES.SIGN_IN
                ? "Don't have an account?"
                : 'Already have an account?'
            }`}</span>
            <Link
              href={pathname === PAGES.SIGN_IN ? PAGES.SIGN_UP : PAGES.SIGN_IN}
              className='hover:text-foreground hover:underline dark:hover:text-foreground'
            >
              {`${pathname === PAGES.SIGN_IN ? 'Sign up' : 'Sign in'}`}
            </Link>
          </div>
        </div>
      </div>
    </>
  );
}
