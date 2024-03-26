import { type GetServerSideProps } from 'next';
import { useRouter } from 'next/navigation';

import { type NextPageWithLayout } from '@/pages/_app';

import { Authorized } from '@/layouts/authorised';
import { Friends } from '@/layouts/friends';
import { Main } from '@/layouts/main';

import { Separator } from '@/components/ui/separator';

import { RequestsList } from '@/components/friends/requests-list';

import {
  getIncomingFriendRequests,
  getOutgoingFriendRequests,
  getRejectedFriendRequests
} from '@/axios/friends';

import { isAuthorized, isRedirect } from '@/lib/auth';
import { capitalize, cn } from '@/lib/utils';
import { type UserFromListOfUsers } from '@/lib/types';
import { PAGES } from '@/lib/constants';

import { useTab } from '@/hooks/use-tab';

interface Props {
  requests: {
    incoming: Array<UserFromListOfUsers>;
    outgoing: Array<UserFromListOfUsers>;
    rejected: Array<UserFromListOfUsers>;
  } | null;
}

export const types = ['incoming', 'outgoing', 'rejected'] as const;

const Requests: NextPageWithLayout<Props> = ({ requests }) => {
  const { push } = useRouter();

  const activeType = useTab<typeof types>('type');

  if (!requests) {
    return (
      <p className='my-7 text-center leading-9'>
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
          {types.map((type) => (
            <li
              key={type}
              onClick={() => push(`${PAGES.FRIENDS_REQUESTS}?type=${type}`)}
              className={cn(
                'cursor-pointer rounded p-2 px-[1rem] py-[0.5rem] transition-[background-color] hover:bg-accent',
                {
                  'bg-accent': activeType === type
                }
              )}
            >
              {`${capitalize(type)} [${requests[type].length}]`}
            </li>
          ))}
        </ul>
      </div>
      <Separator className='my-4' />
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
