import { useState } from 'react';

import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';
import { Button } from '@/components/ui/button';

import { Menu, Network } from 'lucide-react';

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
        <div className='flex items-center'>
          <Network className='mr-2 size-4' />
          <span className='font-bold'>Network</span>
        </div>
      </SheetContent>
    </Sheet>
  );
};

export { MobileNav };
