import type { GetServerSideProps } from 'next';

import type { NextPageWithLayout } from '@/pages/_app';

import { Authorized } from '@/layouts/authorised';
import { Friends } from '@/layouts/friends';
import { Main } from '@/layouts/main';

import { RequestsList } from '@/components/friends/requests-list';
import { Separator } from '@/components/ui/separator';

import {
  getIncomingFriendRequests,
  getOutgoingFriendRequests,
  getRejectedFriendRequests
} from '@/api/friends';

import { useFrequentlyUsedHooks } from '@/hooks/use-frequently-used-hooks';

import { isAuthorized, isRedirect } from '@/lib/auth';
import { capitalize, cn } from '@/lib/utils';
import { UserFromListOfUsers } from '@/lib/types';
import { PAGES } from '@/lib/constants';

const lis = ['incoming', 'outgoing', 'rejected'] as const;
export type RequestsTypes = (typeof lis)[number];

interface Props {
  requests: {
    incoming: Array<UserFromListOfUsers>;
    outgoing: Array<UserFromListOfUsers>;
    rejected: Array<UserFromListOfUsers>;
  } | null;
}

const Requests: NextPageWithLayout<Props> = ({ requests }) => {
  const { router } = useFrequentlyUsedHooks();

  if (!requests) {
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
      <div className='text-sm'>
        <ul className='flex gap-7'>
          {lis.map((li) => (
            <li
              key={li}
              onClick={() =>
                router.push({
                  pathname: PAGES.FRIENDS_REQUESTS,
                  query: { type: li }
                })
              }
              className={cn(
                'cursor-pointer rounded p-2 px-[1rem] py-[0.5rem] transition-[background-color] hover:bg-accent',
                {
                  'bg-accent': router.query.type === li
                }
              )}
            >
              {`${capitalize(li)} [${requests[li].length}]`}
            </li>
          ))}
        </ul>
      </div>
      <Separator className='mb-4 mt-4' />
      <RequestsList requests={requests} />
    </>
  );
};

Requests.getLayout = (page) => (
  <Main title='Friends / Requests'>
    <Authorized>
      <Friends>{page}</Friends>
    </Authorized>
  </Main>
);

export const getServerSideProps = (async (context) => {
  try {
    const res = await isAuthorized(context);

    if (isRedirect(res)) return res;

    const requests = await Promise.all([
      getIncomingFriendRequests(),
      getOutgoingFriendRequests(),
      getRejectedFriendRequests()
    ]);

    return {
      props: {
        requests: {
          incoming: requests[0],
          outgoing: requests[1],
          rejected: requests[2]
        }
      }
    };
  } catch (error) {
    return {
      props: {
        requests: null
      }
    };
  }
}) satisfies GetServerSideProps<Props>;

export default Requests;
