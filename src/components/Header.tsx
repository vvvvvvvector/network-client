import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';

import { ChevronDown, Settings } from 'lucide-react';

import { LogOut, Network } from 'lucide-react';

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';

import { signOut } from '@/api/auth';

import { useRouter } from 'next/router';
import { useToast } from './ui/use-toast';

const Header = () => {
  const { toast } = useToast();

  const router = useRouter();

  return (
    <header className='static top-0 z-50 w-full border-b flex justify-center items-center'>
      <div className='w-full max-w-[1150px] h-14 flex items-center px-10'>
        <ul className='w-full h-full flex items-center justify-between'>
          <li>
            <div className='flex items-center gap-3'>
              <Network />
              <span className='font-bold text-2xl'>Network</span>
            </div>
          </li>
          <li className='h-full'>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <div className='cursor-pointer hover:bg-gray-50 h-full w-[100px] flex gap-2 items-center justify-center'>
                  <Avatar>
                    <AvatarImage src='https://avatars.githubusercontent.com/u/57532024?v=4' />
                    <AvatarFallback>P</AvatarFallback>
                  </Avatar>
                  <ChevronDown size={16} />
                </div>
              </DropdownMenuTrigger>
              <DropdownMenuContent className='w-56'>
                <DropdownMenuLabel>My profile</DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuGroup>
                  <DropdownMenuItem className='cursor-pointer'>
                    <Settings className='mr-2 h-4 w-4' />
                    <span>Settings</span>
                  </DropdownMenuItem>
                </DropdownMenuGroup>
                <DropdownMenuSeparator />
                <DropdownMenuItem
                  className='cursor-pointer'
                  onClick={() => {
                    signOut();

                    toast({
                      description: 'You have successfully signed out.',
                    });

                    router.push('/');
                  }}
                >
                  <LogOut className='mr-2 h-4 w-4' />
                  <span>Sign out</span>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </li>
        </ul>
      </div>
    </header>
  );
};

export { Header };
