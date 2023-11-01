import { GetServerSideProps, GetServerSidePropsContext } from 'next';
import { MessagesSquare, MoreHorizontal, UserMinus } from 'lucide-react';

import { NextPageWithLayout } from '@/pages/_app';

import { Main } from '@/layouts/main';
import { Authorized } from '@/layouts/authorised';
import { Friends } from '@/layouts/friends';

import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger
} from '@/components/ui/dropdown-menu';
import { Avatar } from '@/components/avatar';

import { getMyFriends } from '@/api/friends';

import { useCombain } from '@/hooks/use-combain';
import { useRequestsActions } from '@/hooks/use-requests-actions';
import { useCommonActions } from '@/hooks/use-common-actions';

import { isAuthorized } from '@/lib/auth';
import {
  DROPDOWN_MENU_ICON_STYLES,
  ICON_INSIDE_BUTTON_SIZE,
  PAGES
} from '@/lib/constants';
import { ProfileWithAvatarWithoutLikes, User } from '@/lib/types';
import { cn } from '@/lib/utils';

interface Props {
  users: (User & ProfileWithAvatarWithoutLikes)[];
}

const Index: NextPageWithLayout<Props> = ({ users }) => {
  const { router } = useCombain();

  const { unfriend } = useRequestsActions();
  const { goToProfile, writeMessage } = useCommonActions();

  const onClickFindFriends = () => {
    router.push({
      pathname: PAGES.FRIENDS_FIND,
      query: {
        page: 1
      }
    });
  };

  return (
    <>
      <div className='flex items-center justify-between text-sm'>
        <ul className='flex gap-7'>
          <li
            className={cn(
              `cursor-pointer rounded bg-accent p-2 px-[1rem] py-[0.5rem] hover:bg-accent`
            )}
          >
            {`All friends [${users.length}]`}
          </li>
          <li
            className={cn(
              `cursor-pointer rounded p-2 px-[1rem] py-[0.5rem] hover:bg-accent`
            )}
          >
            {`Online [${0}]`}
          </li>
        </ul>
        <Button onClick={onClickFindFriends}>Find friends</Button>
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
                  avatar={user.profile.avatar?.name}
                />
                <span
                  onClick={goToProfile(user.username)}
                  className='cursor-pointer hover:underline'
                >
                  {user.username}
                </span>
              </div>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant='ghost' size='icon'>
                    <MoreHorizontal size={ICON_INSIDE_BUTTON_SIZE} />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent>
                  <DropdownMenuItem onClick={writeMessage(user.username)}>
                    <MessagesSquare className={DROPDOWN_MENU_ICON_STYLES} />
                    <span>Write message</span>
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={unfriend(user.username)}>
                    <UserMinus className={DROPDOWN_MENU_ICON_STYLES} />
                    <span>Unfriend</span>
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </li>
          ))}
        </ul>
      ) : (
        <span className='mb-7 mt-7 text-center'>
          You don't have any friends yet.
        </span>
      )}
    </>
  );
};

Index.getLayout = (page) => (
  <Main title='Authorised / My Friends'>
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
