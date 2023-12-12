import useSWR from 'swr';
import { useState } from 'react';
import {
  ChevronDown,
  Settings,
  LogOut,
  Network,
  Sun,
  MoonStar,
  Monitor,
  AlertTriangle
} from 'lucide-react';
import { useTheme } from 'next-themes';

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger
} from '@/components/ui/dropdown-menu';
import { Avatar } from '@/components/avatar';
import {
  Dialog,
  DialogContent,
  DialogClose,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';

import { signOut } from '@/api/auth';
import { getAuthorizedUserUsernameAndAvatar, url } from '@/api/users';

import { useFrequentlyUsedHooks } from '@/hooks/use-frequently-used-hooks';

import { DROPDOWN_MENU_ICON_STYLES, PAGES } from '@/lib/constants';
import { AvatarWithoutLikes, User } from '@/lib/types';

const ThemeMenu = [
  {
    text: 'Light',
    icon: <Sun className={DROPDOWN_MENU_ICON_STYLES} />
  },
  {
    text: 'Dark',
    icon: <MoonStar className={DROPDOWN_MENU_ICON_STYLES} />
  },
  {
    text: 'System',
    icon: <Monitor className={DROPDOWN_MENU_ICON_STYLES} />
  },
  {
    text: 'Error!',
    icon: <AlertTriangle className={DROPDOWN_MENU_ICON_STYLES} />
  }
] as const;

const whatActiveTheme = (theme: string | undefined) => {
  switch (theme) {
    case 'light':
      return ThemeMenu[0];
    case 'dark':
      return ThemeMenu[1];
    case 'system':
      return ThemeMenu[2];
    default:
      return ThemeMenu[3];
  }
};

const Header = () => {
  const [open, setOpen] = useState(false);

  const { theme, setTheme } = useTheme();

  const [themeMenu, setThemeMenu] = useState<(typeof ThemeMenu)[number]>(
    whatActiveTheme(theme)
  );

  const { router, toast } = useFrequentlyUsedHooks();

  const { data } = useSWR<Omit<User, 'lastSeen'> & AvatarWithoutLikes>(
    url,
    getAuthorizedUserUsernameAndAvatar
  );

  return (
    <header className='sticky top-0 z-50 flex w-full items-center justify-center border-b border-b-muted bg-background'>
      <div className='flex h-14 w-full max-w-authorised items-center px-5'>
        <ul className='flex h-full w-full items-center justify-between'>
          <li>
            <div
              onClick={() => router.push(PAGES.NEWS)}
              className='flex cursor-pointer items-center gap-3'
            >
              <Network />
              <span className='text-2xl font-bold'>Network</span>
            </div>
          </li>
          <li className='h-full'>
            <Dialog>
              <DropdownMenu
                open={open}
                defaultOpen={open}
                onOpenChange={setOpen}
              >
                <DropdownMenuTrigger asChild>
                  <div
                    onClick={() => setOpen(true)}
                    className='flex h-full w-[100px] cursor-pointer items-center justify-center gap-2 transition-[background-color] hover:bg-accent'
                  >
                    <Avatar
                      username={data?.username || 'Unknown'}
                      avatar={data?.avatar?.name}
                    />
                    <ChevronDown className='h-4 w-4' />
                  </div>
                </DropdownMenuTrigger>
                <DropdownMenuContent align='center' className='w-52'>
                  <DropdownMenuLabel>
                    <div className='flex gap-2'>
                      <span>Profile: </span>
                      <span
                        onClick={() => {
                          router.push(PAGES.PROFILE);

                          setOpen(false);
                        }}
                        className='cursor-pointer hover:underline'
                      >
                        {data?.username || 'Unknown'}
                      </span>
                    </div>
                  </DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem>
                    <Settings className={DROPDOWN_MENU_ICON_STYLES} />
                    <span>Settings</span>
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onSelect={(e) => e.preventDefault()}>
                    {themeMenu.icon}
                    <div className='flex flex-1 justify-between'>
                      <span>Theme:</span>
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <div className='mr-2 flex items-center'>
                            <span>{themeMenu.text}</span>
                          </div>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align='end'>
                          {ThemeMenu.slice(0, 3).map((item) => (
                            <DropdownMenuItem
                              key={item.text}
                              onClick={() => {
                                setThemeMenu({ ...item });

                                setTheme(item.text.toLowerCase());
                              }}
                            >
                              {item.icon}
                              <span>{item.text}</span>
                            </DropdownMenuItem>
                          ))}
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </div>
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DialogTrigger className='w-full'>
                    <DropdownMenuItem>
                      <LogOut className={DROPDOWN_MENU_ICON_STYLES} />
                      <span>Sign out</span>
                    </DropdownMenuItem>
                  </DialogTrigger>
                </DropdownMenuContent>
              </DropdownMenu>
              <DialogContent className='max-w-[500px]'>
                <DialogHeader>
                  <DialogTitle>Please, confirm your intention</DialogTitle>
                  <DialogDescription>
                    Are you sure you want to sign out?
                  </DialogDescription>
                  <DialogFooter>
                    <DialogClose asChild>
                      <Button type='button' variant='secondary'>
                        Close
                      </Button>
                    </DialogClose>
                    <Button
                      onClick={() => {
                        signOut();

                        toast({
                          description: 'You have successfully signed out.'
                        });

                        router.push(PAGES.SIGN_IN);
                      }}
                    >
                      Confirm
                    </Button>
                  </DialogFooter>
                </DialogHeader>
              </DialogContent>
            </Dialog>
          </li>
        </ul>
      </div>
    </header>
  );
};

export { Header };
