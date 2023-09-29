import { NextPageWithLayout } from '../_app';

import { Authorized } from '@/layouts/Authorised';
import { Friends } from '@/layouts/Friends';
import { Main } from '@/layouts/Main';

import { Separator } from '@/components/ui/separator';

import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';

import { useRouter } from 'next/router';
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
import { useToast } from '@/components/ui/use-toast';

import { Check, X } from 'lucide-react';

import axios from 'axios';

import { useState } from 'react';

import { isAuthorized } from '@/lib/auth';

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

type RequestsTypes = 'incoming' | 'outgoing' | 'rejected';

const List = ({
  type,
  data,
}: {
  type: RequestsTypes;
  data: Array<GenericRequest>;
}) => {
  const router = useRouter();

  const { toast } = useToast();

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
                          onClick={async (e) => {
                            e.stopPropagation();

                            try {
                              await acceptFriendRequest(request.user.username);

                              toast({
                                description:
                                  'Friend request was successfully accepted.',
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
                          }}
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
                          onClick={async (e) => {
                            e.stopPropagation();

                            try {
                              await rejectFriendRequest(request.user.username);

                              toast({
                                description:
                                  'Friend request was successfully rejected.',
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
                          }}
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
                        onClick={async (e) => {
                          e.stopPropagation();

                          try {
                            await acceptFriendRequest(request.user.username);

                            toast({
                              description:
                                'Friend request was successfully accepted.',
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
                        }}
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
          <li
            onClick={() => setList('incoming')}
            className={`${
              list === 'incoming' && 'bg-gray-50 font-semibold'
            } hover:bg-gray-50 rounded p-2 cursor-pointer px-[1rem] py-[0.5rem]`}
          >
            {`Incoming (${requests['incoming'].length})`}
          </li>
          <li
            onClick={() => setList('outgoing')}
            className={`${
              list === 'outgoing' && 'bg-gray-50 font-semibold'
            } hover:bg-gray-50 rounded p-2 cursor-pointer px-[1rem] py-[0.5rem]`}
          >
            {`Outgoing (${requests['outgoing'].length})`}
          </li>
          <li
            onClick={() => setList('rejected')}
            className={`${
              list === 'rejected' && 'bg-gray-50 font-semibold'
            } hover:bg-gray-50 rounded p-2 cursor-pointer px-[1rem] py-[0.5rem]`}
          >
            {`Rejected (${requests['rejected'].length})`}
          </li>
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
