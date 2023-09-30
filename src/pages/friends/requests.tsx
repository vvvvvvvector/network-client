import { NextPageWithLayout } from '../_app';

import { Authorized } from '@/layouts/Authorised';
import { Friends } from '@/layouts/Friends';
import { Main } from '@/layouts/Main';

import { Separator } from '@/components/ui/separator';

import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';

import { GetServerSideProps, GetServerSidePropsContext } from 'next';

import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip';

import {
  acceptFriendRequest,
  getIncomingFriendRequests,
  getOutgoingFriendRequests,
  getRejectedFriendRequests,
  rejectFriendRequest,
} from '@/api/friends';
import { Button } from '@/components/ui/button';

import { Check, X } from 'lucide-react';

import axios from 'axios';

import { useState } from 'react';

import { isAuthorized } from '@/lib/auth';
import { cn } from '@/lib/utils';
import { useDefault } from '@/lib/hooks';

type GenericRequest = {
  createdAt: string;
  user: {
    username: string;
  };
};

type Sender = {
  createdAt: string;
  sender: {
    username: string;
  };
};

type Receiver = {
  createdAt: string;
  receiver: {
    username: string;
  };
};

interface Props {
  requests: {
    incoming: Array<Sender>;
    outgoing: Array<Receiver>;
    rejected: Array<Sender>;
  };
}

const lis = ['incoming', 'outgoing', 'rejected'] as const;
type RequestsTypes = (typeof lis)[number];

const List = ({
  type,
  data,
}: {
  type: RequestsTypes;
  data: Array<GenericRequest>;
}) => {
  const { router, toast } = useDefault();

  const onClickAcceptFriendRequest = (username: string) => {
    return async (e: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
      e.stopPropagation();

      try {
        await acceptFriendRequest(username);

        toast({
          description: 'Friend request was successfully accepted.',
        });

        router.replace(router.asPath);
      } catch (error) {
        if (axios.isAxiosError(error)) {
          toast({
            variant: 'destructive',
            description: `${error.response?.data.message}`,
          });
        }
      }
    };
  };

  const onClickRejectFriendRequest = (username: string) => {
    return async (e: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
      e.stopPropagation();

      try {
        await rejectFriendRequest(username);

        toast({
          description: 'Friend request was successfully rejected.',
        });

        router.replace(router.asPath);
      } catch (error) {
        if (axios.isAxiosError(error)) {
          toast({
            variant: 'destructive',
            description: `${error.response?.data.message}`,
          });
        }
      }
    };
  };

  return (
    <>
      {data.length > 0 ? (
        <ul className='flex flex-col gap-5'>
          {data.map((request) => (
            <li
              className='flex py-2 items-center justify-between'
              key={request.user.username}
            >
              <div className='flex gap-3 items-center'>
                <Avatar>
                  <AvatarImage src='' />
                  <AvatarFallback>
                    {request.user.username[0].toUpperCase()}
                  </AvatarFallback>
                </Avatar>
                <span
                  onClick={() => router.push(`/${request.user.username}`)}
                  className='cursor-pointer hover:underline'
                >
                  {request.user.username}
                </span>
              </div>
              {type === 'incoming' ? (
                <div className='flex gap-3'>
                  <TooltipProvider>
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <Button
                          onClick={onClickAcceptFriendRequest(
                            request.user.username
                          )}
                          variant='outline'
                        >
                          <Check size={20} />
                        </Button>
                      </TooltipTrigger>
                      <TooltipContent>
                        <p>Accept friend request</p>
                      </TooltipContent>
                    </Tooltip>
                  </TooltipProvider>
                  <TooltipProvider>
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <Button
                          onClick={onClickRejectFriendRequest(
                            request.user.username
                          )}
                          variant='outline'
                        >
                          <X size={20} />
                        </Button>
                      </TooltipTrigger>
                      <TooltipContent>
                        <p>Reject friend request</p>
                      </TooltipContent>
                    </Tooltip>
                  </TooltipProvider>
                </div>
              ) : type === 'outgoing' ? (
                <></>
              ) : (
                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Button
                        onClick={onClickAcceptFriendRequest(
                          request.user.username
                        )}
                        variant='outline'
                      >
                        <Check size={20} />
                      </Button>
                    </TooltipTrigger>
                    <TooltipContent>
                      <p>Add to friends</p>
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>
              )}
            </li>
          ))}
        </ul>
      ) : (
        <span className='text-center'>
          {`You don't have any ${type} requests yet.`}
        </span>
      )}
    </>
  );
};

const Requests: NextPageWithLayout<Props> = ({ requests }) => {
  const [list, setList] = useState<RequestsTypes>('incoming');

  return (
    <>
      <div className='text-sm'>
        <ul className='flex gap-7'>
          {lis.map((li) => (
            <li
              key={li}
              onClick={() => setList(li)}
              className={cn(
                'hover:bg-gray-50 rounded p-2 cursor-pointer px-[1rem] py-[0.5rem]',
                { 'bg-gray-50 font-semibold': list === li }
              )}
            >
              {`${li[0].toUpperCase() + li.substring(1)} (${
                requests[li].length
              })`}
            </li>
          ))}
        </ul>
      </div>
      <Separator className='mt-4 mb-4' />
      <List
        type={list}
        data={requests[list].map((i) => {
          const { createdAt, ...rest } = i;

          let username = '';

          if ('sender' in rest) {
            username = rest.sender.username;
          } else {
            username = rest.receiver.username;
          }

          return {
            ...i,
            user: {
              username,
            },
          };
        })}
      />
    </>
  );
};

Requests.getLayout = (page) => (
  <Main title='Friend Requests'>
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

    const requests = await Promise.all([
      getIncomingFriendRequests(),
      getOutgoingFriendRequests(),
      getRejectedFriendRequests(),
    ]);

    return {
      props: {
        requests: {
          incoming: requests[0],
          outgoing: requests[1],
          rejected: requests[2],
        },
      },
    };
  } catch (error) {
    return {
      props: {
        requests: {},
      },
    };
  }
};

export default Requests;
