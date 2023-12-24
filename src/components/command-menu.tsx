import { type FC, useEffect, useCallback } from 'react';
import {
  MessageCircle,
  Users,
  UserCircle,
  Newspaper,
  Image,
  Sun,
  MoonStar,
  Monitor,
  UserSearch,
  Mailbox,
  Cog,
  MonitorSmartphone,
  ArrowUpRight,
  ArrowDownLeft,
  XSquare
} from 'lucide-react';
import { useTheme } from 'next-themes';

import {
  CommandDialog,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
  CommandSeparator
} from '@/components/ui/command';
import { Button } from '@/components/ui/button';

import { PAGES } from '@/lib/constants';

import { useFrequentlyUsedHooks } from '@/hooks/use-frequently-used-hooks';

import { useCommandMenuStore } from '@/zustand/command-menu.store';

const COMMAND_ITEM_ICON_STYLE = 'mr-2 h-4 w-4';

export const CommandMenu: FC = () => {
  const { commandMenuOpened, toogleCmdMenuOpenState, setCommandMenuOpened } =
    useCommandMenuStore();

  const { setTheme } = useTheme();

  const { router } = useFrequentlyUsedHooks();

  useEffect(() => {
    const down = (e: KeyboardEvent) => {
      if (e.key === 'k' && (e.metaKey || e.ctrlKey)) {
        e.preventDefault();

        toogleCmdMenuOpenState();
      }
    };

    document.addEventListener('keydown', down);

    return () => document.removeEventListener('keydown', down);
  }, []);

  const runCommand = useCallback((command: (...args: any) => unknown) => {
    setCommandMenuOpened(false);

    command();
  }, []);

  return (
    <>
      <Button
        variant='outline'
        onClick={() => setCommandMenuOpened(true)}
        className={
          'flex w-[120px] items-center justify-between rounded-lg text-sm text-muted-foreground sm:w-[250px]'
        }
      >
        <span>Search...</span>
        <kbd className='pointer-events-none hidden h-5 select-none items-center gap-1 rounded border border-border bg-muted px-1.5 font-mono text-[10px] font-medium opacity-100 sm:flex dark:bg-neutral-900'>
          <span className='text-xs'>⌘</span>K
        </kbd>
      </Button>
      <CommandDialog
        open={commandMenuOpened}
        onOpenChange={setCommandMenuOpened}
      >
        <CommandInput placeholder='Search for pages or commands...' />
        <CommandList>
          <CommandEmpty>No results found 🥲</CommandEmpty>
          <CommandGroup heading='Pages'>
            <CommandItem
              onSelect={() => runCommand(() => router.push(PAGES.MY_PROFILE))}
            >
              <UserCircle className={COMMAND_ITEM_ICON_STYLE} />
              <span>My profile</span>
            </CommandItem>
            <CommandItem
              onSelect={() => runCommand(() => router.push(PAGES.NEWS))}
            >
              <Newspaper className={COMMAND_ITEM_ICON_STYLE} />
              <span>News</span>
            </CommandItem>
            <CommandItem
              onSelect={() => runCommand(() => router.push(PAGES.MESSENGER))}
            >
              <MessageCircle className={COMMAND_ITEM_ICON_STYLE} />
              <span>Messenger</span>
            </CommandItem>
            <CommandItem
              onSelect={() =>
                runCommand(() =>
                  router.push({
                    pathname: PAGES.FRIENDS,
                    query: {
                      tab: 'all'
                    }
                  })
                )
              }
            >
              <Users className={COMMAND_ITEM_ICON_STYLE} />
              <span>Friends</span>
            </CommandItem>
            <CommandItem
              onSelect={() => runCommand(() => router.push(PAGES.PHOTOS))}
            >
              <Image className={COMMAND_ITEM_ICON_STYLE} />
              <span>Photos</span>
            </CommandItem>
          </CommandGroup>
          <CommandSeparator />
          <CommandGroup heading='Friends'>
            <CommandItem
              onSelect={() => runCommand(() => router.push(PAGES.FRIENDS_FIND))}
            >
              <UserSearch className={COMMAND_ITEM_ICON_STYLE} />
              <span>Find</span>
            </CommandItem>
            <CommandItem
              onSelect={() =>
                runCommand(() =>
                  router.push({
                    pathname: PAGES.FRIENDS_REQUESTS,
                    query: { type: 'incoming' }
                  })
                )
              }
            >
              <Mailbox className={COMMAND_ITEM_ICON_STYLE} />
              <span>Friend Requests</span>
            </CommandItem>
            <CommandItem
              onSelect={() =>
                runCommand(() =>
                  router.push({
                    pathname: PAGES.FRIENDS,
                    query: {
                      tab: 'all'
                    }
                  })
                )
              }
            >
              <Users className={COMMAND_ITEM_ICON_STYLE} />
              <span>All</span>
            </CommandItem>
            <CommandItem
              onSelect={() =>
                runCommand(() =>
                  router.push({
                    pathname: PAGES.FRIENDS,
                    query: {
                      tab: 'online'
                    }
                  })
                )
              }
            >
              <MonitorSmartphone className={COMMAND_ITEM_ICON_STYLE} />
              <span>Online</span>
            </CommandItem>
          </CommandGroup>
          <CommandSeparator />
          <CommandGroup heading='Friend Requests'>
            <CommandItem
              onSelect={() =>
                runCommand(() =>
                  router.push({
                    pathname: PAGES.FRIENDS_REQUESTS,
                    query: { type: 'incoming' }
                  })
                )
              }
            >
              <ArrowDownLeft className={COMMAND_ITEM_ICON_STYLE} />
              <span>Incoming</span>
            </CommandItem>
            <CommandItem
              onSelect={() =>
                runCommand(() =>
                  router.push({
                    pathname: PAGES.FRIENDS_REQUESTS,
                    query: { type: 'outgoing' }
                  })
                )
              }
            >
              <ArrowUpRight className={COMMAND_ITEM_ICON_STYLE} />
              <span>Outgoing</span>
            </CommandItem>
            <CommandItem
              onSelect={() =>
                runCommand(() =>
                  router.push({
                    pathname: PAGES.FRIENDS_REQUESTS,
                    query: { type: 'rejected' }
                  })
                )
              }
            >
              <XSquare className={COMMAND_ITEM_ICON_STYLE} />
              <span>Rejected</span>
            </CommandItem>
          </CommandGroup>
          <CommandSeparator />
          <CommandGroup heading='Theme'>
            <CommandItem onSelect={() => runCommand(() => setTheme('light'))}>
              <Sun className={COMMAND_ITEM_ICON_STYLE} />
              <span>Light</span>
            </CommandItem>
            <CommandItem onSelect={() => runCommand(() => setTheme('dark'))}>
              <MoonStar className={COMMAND_ITEM_ICON_STYLE} />
              <span>Dark</span>
            </CommandItem>
            <CommandItem onSelect={() => runCommand(() => setTheme('system'))}>
              <Monitor className={COMMAND_ITEM_ICON_STYLE} />
              <span>System</span>
            </CommandItem>
          </CommandGroup>
          <CommandSeparator />
          <CommandGroup heading='Settings'>
            <CommandItem>
              <Cog className={COMMAND_ITEM_ICON_STYLE} />
              <span>Settings</span>
            </CommandItem>
          </CommandGroup>
        </CommandList>
      </CommandDialog>
    </>
  );
};
