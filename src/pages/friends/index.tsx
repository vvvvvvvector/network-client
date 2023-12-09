import { GetServerSideProps } from 'next';

import { NextPageWithLayout } from '@/pages/_app';

import { Main } from '@/layouts/main';
import { Authorized } from '@/layouts/authorised';
import { Friends } from '@/layouts/friends';

import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { FriendsList } from '@/components/friends/friends-list';

import { getMyFriends } from '@/api/friends';

import { useFrequentlyUsedHooks } from '@/hooks/use-frequently-used-hooks';

import { isAuthorized, isRedirect } from '@/lib/auth';
import { PAGES } from '@/lib/constants';
import { UserFromListOfUsers } from '@/lib/types';
import { cn } from '@/lib/utils';

interface Props {
  users: UserFromListOfUsers[] | null;
}

const Index: NextPageWithLayout<Props> = ({ users }) => {
  const { router } = useFrequentlyUsedHooks();

  if (!users) {
    return (
      <p className='mb-7 mt-7 text-center leading-9'>
        Something went wrong
        <br /> Please, try again later
        <br /> <span className='text-4xl'>😭</span>
      </p>
    );
  }

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
        <Button
          onClick={() => {
            router.push({
              pathname: PAGES.FRIENDS_FIND,
              query: {
                page: 1
              }
            });
          }}
        >
          Find friends
        </Button>
      </div>
      <Separator className='mb-4 mt-4' />
      <FriendsList users={users} />
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

export const getServerSideProps = (async (context) => {
  try {
    const res = await isAuthorized(context);

    if (isRedirect(res)) return res;

    const users = await getMyFriends();

    return {
      props: {
        users
      }
    };
  } catch (error) {
    return {
      props: {
        users: null
      }
    };
  }
}) satisfies GetServerSideProps<Props>;

export default Index;
