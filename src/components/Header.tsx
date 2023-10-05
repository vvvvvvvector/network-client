import { ChevronDown, Palette, Settings, LogOut, Network } from 'lucide-react';

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';

import { signOut } from '@/api/auth';

import { useDefault } from '@/lib/hooks';

import useSWR from 'swr';

import { useState } from 'react';

import { getMyUsernameAndAvatar } from '@/api/users';

const Header = () => {
  const [isOpen, setIsOpen] = useState(false);

  const { router, toast } = useDefault();

  const { data, error } = useSWR<{
    username: string;
    avatar?: string;
  }>('/users/me/username-avatar', getMyUsernameAndAvatar);

  const onClickSignOut = () => {
    signOut();

    toast({
      description: 'You have successfully signed out.',
    });

    router.push('/');
  };

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
            <DropdownMenu open={isOpen} onOpenChange={setIsOpen}>
              <DropdownMenuTrigger asChild>
                <div
                  onClick={() => setIsOpen(true)}
                  className='cursor-pointer hover:bg-gray-50 h-full w-[100px] flex gap-2 items-center justify-center'
                >
                  <Avatar>
                    <AvatarImage src={data?.avatar} />
                    <AvatarFallback>
                      {data?.username.charAt(0).toLocaleUpperCase()}
                    </AvatarFallback>
                  </Avatar>
                  <ChevronDown size={16} />
                </div>
              </DropdownMenuTrigger>
              <DropdownMenuContent className='w-56'>
                <DropdownMenuLabel>
                  <div className='flex gap-2'>
                    <span>Profile: </span>
                    <span
                      onClick={() => {
                        router.push('/profile');

                        setIsOpen(false);
                      }}
                      className='hover:underline cursor-pointer'
                    >
                      {data?.username}
                    </span>
                  </div>
                </DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuGroup>
                  <DropdownMenuItem className='cursor-pointer'>
                    <Settings className='mr-2 h-4 w-4' />
                    <span>Settings</span>
                  </DropdownMenuItem>
                </DropdownMenuGroup>
                <DropdownMenuSeparator />
                <DropdownMenuGroup>
                  <DropdownMenuItem className='cursor-pointer'>
                    <Palette className='mr-2 h-4 w-4' />
                    <span>Mode</span>
                  </DropdownMenuItem>
                </DropdownMenuGroup>
                <DropdownMenuSeparator />
                <DropdownMenuGroup>
                  <DropdownMenuItem
                    className='cursor-pointer'
                    onClick={onClickSignOut}
                  >
                    <LogOut className='mr-2 h-4 w-4' />
                    <span>Sign out</span>
                  </DropdownMenuItem>
                </DropdownMenuGroup>
              </DropdownMenuContent>
            </DropdownMenu>
          </li>
        </ul>
      </div>
    </header>
  );
};

export { Header };
