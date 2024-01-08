import { type SetStateAction, useState } from 'react';
import Link, { type LinkProps } from 'next/link';
import { Menu, Network } from 'lucide-react';

import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';
import { Button } from '@/components/ui/button';

const MobileNav = () => {
  const [open, setOpen] = useState(false);

  return (
    <Sheet open={open} onOpenChange={setOpen} defaultOpen={open}>
      <SheetTrigger asChild>
        <Button variant='ghost' size='icon' className='md:hidden'>
          <Menu />
        </Button>
      </SheetTrigger>
      <SheetContent side='left'>
        <MobileLink
          href='news'
          onOpenChange={setOpen}
          className='flex items-center'
        >
          <Network className='mr-2 size-5' />
          <span className='text-xl font-bold'>Network</span>
        </MobileLink>
        <div className='flex flex-col space-y-3'>
          <MobileLink href='profile' onOpenChange={setOpen}>
            My profile
          </MobileLink>
          <MobileLink href='news' onOpenChange={setOpen}>
            News
          </MobileLink>
          <MobileLink href='messenger' onOpenChange={setOpen}>
            Messenger
          </MobileLink>
          <MobileLink href='friends' onOpenChange={setOpen}>
            Friends
          </MobileLink>
          <MobileLink href='photos' onOpenChange={setOpen}>
            Photos
          </MobileLink>
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
