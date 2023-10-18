import { GetServerSideProps, GetServerSidePropsContext } from 'next';

import { NextPageWithLayout } from '../_app';

import { Main } from '@/layouts/main';
import { Authorized } from '@/layouts/authorised';
import { Friends } from '@/layouts/friends';

import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger
} from '@/components/ui/dropdown-menu';
import { Avatar } from '@/components/avatar';

import { MessagesSquare, MoreHorizontal, UserMinus } from 'lucide-react';

import { getMyFriends, unfriend } from '@/api/friends';

import { useCombain } from '@/hooks/use-combain';

import { isAuthorized } from '@/lib/auth';
import { FRIENDS_ICON_INSIDE_BUTTON_SIZE, PAGES } from '@/lib/constants';
import { ProfileWithAvatar, User } from '@/lib/types';

interface Props {
  users: (User & ProfileWithAvatar)[];
}

const Index: NextPageWithLayout<Props> = ({ users }) => {
  const { router, toast } = useCombain();

  return (
    <>
      <div className='flex items-center justify-between text-sm'>
        <ul className='flex gap-7'>
          <li
            className={`cursor-pointer rounded p-2 px-[1rem] py-[0.5rem] hover:bg-gray-50 dark:hover:bg-neutral-900`}
          >
            {`All friends [${users.length}]`}
          </li>
          <li
            className={` cursor-pointer rounded p-2 px-[1rem] py-[0.5rem] hover:bg-gray-50 dark:hover:bg-neutral-900`}
          >
            {`Online [${0}]`}
          </li>
        </ul>
        <Button
          onClick={() =>
            router.push({
              pathname: PAGES.FRIENDS_FIND,
              query: {
                page: 1
              }
            })
          }
        >
          Find friends
        </Button>
      </div>
      <Separator className='mb-4 mt-4' />
      {users.length > 0 ? (
        <ul className='flex flex-col gap-5'>
          {users.map((user) => (
            <li
              className='flex items-center justify-between py-2'
              key={user.username}
            >
              <div className='flex items-center gap-3'>
                <Avatar
                  size='medium'
                  username={user.username}
                  avatar={user.profile?.avatar}
                />
                <span
                  onClick={() => router.push(`/${user.username}`)}
                  className='cursor-pointer hover:underline'
                >
                  {user.username}
                </span>
              </div>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant='ghost' size='icon'>
                    <MoreHorizontal size={FRIENDS_ICON_INSIDE_BUTTON_SIZE} />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent>
                  <DropdownMenuGroup>
                    <DropdownMenuItem
                      onClick={() => router.push(PAGES.MESSENGER)}
                    >
                      <MessagesSquare className='mr-2 h-4 w-4' />
                      <span>Write message</span>
                    </DropdownMenuItem>
                  </DropdownMenuGroup>
                  <DropdownMenuSeparator />
                  <DropdownMenuGroup>
                    <DropdownMenuItem
                      onClick={async () => {
                        await unfriend(user.username);

                        toast({
                          description: `${user.username} was successfully deleted from your friends list.`
                        });

                        router.replace(router.asPath, undefined, {
                          scroll: false
                        });
                      }}
                    >
                      <UserMinus className='mr-2 h-4 w-4' />
                      <span>Unfriend</span>
                    </DropdownMenuItem>
                  </DropdownMenuGroup>
                </DropdownMenuContent>
              </DropdownMenu>
            </li>
          ))}
        </ul>
      ) : (
        <span className='text-center'>You don't have any friends yet.</span>
      )}
    </>
  );
};

Index.getLayout = (page) => (
  <Main title='Friends'>
    <Authorized>
      <Friends>{page}</Friends>
    </Authorized>
  </Main>
);

export const getServerSideProps: GetServerSideProps = async (
  ctx: GetServerSidePropsContext
) => {
  try {
    const res = await isAuthorized(ctx);

    if (res && 'redirect' in res) return res;

    const users = await getMyFriends();

    return {
      props: {
        users
      }
    };
  } catch (error) {
    return {
      props: {
        users: []
      }
    };
  }
};

export default Index;
