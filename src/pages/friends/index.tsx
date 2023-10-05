import { NextPageWithLayout } from '../_app';

import { Main } from '@/layouts/Main';
import { Authorized } from '@/layouts/Authorised';
import { Friends } from '@/layouts/Friends';

import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';

import { GetServerSideProps, GetServerSidePropsContext } from 'next';

import { getMyFriends, unfriend } from '@/api/friends';

import { isAuthorized } from '@/lib/auth';

import { MessagesSquare, MoreHorizontal, UserMinus } from 'lucide-react';

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';

import { useDefault } from '@/lib/hooks';

interface Props {
  users: {
    username: string;
    profile: {
      avatar?: string;
    };
  }[];
}

const Index: NextPageWithLayout<Props> = ({ users }) => {
  const { router, toast } = useDefault();

  return (
    <>
      <div className='text-sm flex items-center justify-between'>
        <ul className='flex gap-7'>
          <li
            className={`hover:bg-gray-50 rounded p-2 cursor-pointer px-[1rem] py-[0.5rem]`}
          >
            {`All friends (${users.length})`}
          </li>
          <li
            className={` hover:bg-gray-50 rounded p-2 cursor-pointer px-[1rem] py-[0.5rem]`}
          >
            {`Online (${0})`}
          </li>
        </ul>
        <Button onClick={() => router.push('/friends/find')}>
          Find friends
        </Button>
      </div>
      <Separator className='mt-4 mb-4' />
      {users.length > 0 ? (
        <ul className='flex flex-col gap-5'>
          {users.map((user) => (
            <li
              className='flex py-2 items-center justify-between'
              key={user.username}
            >
              <div className='flex gap-3 items-center'>
                <Avatar>
                  <AvatarImage src={user.profile?.avatar} />
                  <AvatarFallback>
                    {user?.username[0].toUpperCase()}
                  </AvatarFallback>
                </Avatar>
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
                    <MoreHorizontal size={20} />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent>
                  <DropdownMenuGroup>
                    <DropdownMenuItem onClick={() => router.push('/messenger')}>
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
                          description: `${user.username} was successfully deleted from your friends list.`,
                        });

                        router.replace(router.asPath);
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
        users,
      },
    };
  } catch (error) {
    return {
      props: {
        users: [],
      },
    };
  }
};

export default Index;
