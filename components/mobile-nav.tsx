import { type SetStateAction, useState } from 'react';
import Link, { type LinkProps } from 'next/link';

import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';
import { Button } from '@/components/ui/button';

import { Icons } from '@/components/icons';

import { icon, menuItemName } from '@/layouts/authorised';

import { MAIN_NAV_PAGES as pages } from '@/lib/constants';

const MobileNav = () => {
  const [open, setOpen] = useState(false);

  return (
    <Sheet open={open} onOpenChange={setOpen} defaultOpen={open}>
      <SheetTrigger asChild>
        <Button
          className='hover:bg-transparent focus-visible:bg-transparent focus-visible:ring-1 focus-visible:ring-offset-0'
          variant='ghost'
          size='icon'
        >
          <Icons.mobileMenu />
          <span className='sr-only'>open mobile menu</span>
        </Button>
      </SheetTrigger>
      <SheetContent className='flex flex-col gap-7' side='left'>
        <MobileLink
          href='news'
          onOpenChange={setOpen}
          className='flex items-center'
        >
          {/* <Network className='mr-3 size-7' /> */}
          <span className='ml-8 text-2xl font-bold'>Network</span>
        </MobileLink>
        <div className='flex flex-col gap-10 pl-8'>
          {pages.map((page) => (
            <MobileLink
              key={page}
              href={{
                pathname: `${page}`,
                query:
                  page === '/friends'
                    ? {
                        tab: 'all'
                      }
                    : undefined
              }}
              onOpenChange={setOpen}
              className='flex items-center'
            >
              {icon(page, 20)}
              <span className='ml-2'>{menuItemName(page)}</span>
            </MobileLink>
          ))}
        </div>
      </SheetContent>
    </Sheet>
  );
};

interface MobileLinkProps extends LinkProps {
  onOpenChange: React.Dispatch<SetStateAction<boolean>>;
  children: React.ReactNode;
  className?: string;
}

const MobileLink = ({
  className,
  onOpenChange,
  children,
  ...props
}: MobileLinkProps) => {
  return (
    <Link
      className={className}
      onClick={() => {
        onOpenChange(false);
      }}
      {...props}
    >
      {children}
    </Link>
  );
};

export { MobileNav };
