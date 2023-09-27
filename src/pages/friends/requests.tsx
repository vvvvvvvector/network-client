import { NextPageWithLayout } from '../_app';

import { Authorized } from '@/layouts/Authorised';
import { Friends } from '@/layouts/Friends';
import { Main } from '@/layouts/Main';

import { Separator } from '@/components/ui/separator';

import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';

import { useRouter } from 'next/router';
import { GetServerSideProps, GetServerSidePropsContext } from 'next';
import { axiosApiInstance } from '@/axios';

import nookies from 'nookies';
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
import { useToast } from '@/components/ui/use-toast';

import { FC, useState } from 'react';

interface Props {
  incoming: {
    createdAt: string;
    sender: {
      username: string;
    };
  }[];
  outgoing: {
    createdAt: string;
    receiver: {
      username: string;
    };
  }[];
  rejected: {
    createdAt: string;
    sender: {
      username: string;
    };
  }[];
}

const List: FC<{
  type: 'incoming' | 'outgoing' | 'rejected';
  incoming: {
    createdAt: string;
    sender: {
      username: string;
    };
  }[];
  outgoing: {
    createdAt: string;
    receiver: {
      username: string;
    };
  }[];
  rejected: {
    createdAt: string;
    sender: {
      username: string;
    };
  }[];
}> = ({ type, incoming, outgoing, rejected }) => {
  const router = useRouter();

  const { toast } = useToast();

  switch (type) {
    case 'incoming':
      return (
        <>
          {incoming.length > 0 ? (
            <ul className='flex flex-col gap-5'>
              {incoming.map((request) => (
                <li
                  className='flex py-2 items-center justify-between'
                  key={request.sender.username}
                >
                  <div className='flex gap-3 items-center'>
                    <Avatar>
                      <AvatarImage src='' />
                      <AvatarFallback>
                        {request.sender.username[0].toUpperCase()}
                      </AvatarFallback>
                    </Avatar>
                    <span
                      onClick={() => router.push(`/${request.sender.username}`)}
                      className='cursor-pointer hover:underline'
                    >
                      {request.sender.username}
                    </span>
                  </div>
                  <div className='flex gap-3'>
                    <Button
                      onClick={async (e) => {
                        e.stopPropagation();

                        try {
                          await acceptFriendRequest(request.sender.username);

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
                    <Button
                      onClick={async (e) => {
                        e.stopPropagation();

                        try {
                          await rejectFriendRequest(request.sender.username);

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
                  </div>
                </li>
              ))}
            </ul>
          ) : (
            <span className='text-center'>
              You don't have any incoming requests yet.
            </span>
          )}
        </>
      );
    case 'outgoing':
      return (
        <>
          {outgoing.length > 0 ? (
            <ul className='flex flex-col gap-5'>
              {outgoing.map((request) => (
                <li
                  className='flex py-2 items-center justify-between'
                  key={request.receiver.username}
                >
                  <div className='flex gap-3 items-center'>
                    <Avatar>
                      <AvatarImage src='' />
                      <AvatarFallback>
                        {request.receiver.username[0].toUpperCase()}
                      </AvatarFallback>
                    </Avatar>
                    <span
                      onClick={() =>
                        router.push(`/${request.receiver.username}`)
                      }
                      className='cursor-pointer hover:underline'
                    >
                      {request.receiver.username}
                    </span>
                  </div>
                </li>
              ))}
            </ul>
          ) : (
            <span className='text-center'>
              You don't have any outgoing requests yet.
            </span>
          )}
        </>
      );
    case 'rejected':
      return (
        <>
          {rejected.length > 0 ? (
            <ul className='flex flex-col gap-5'>
              {rejected.map((request) => (
                <li
                  className='flex py-2 items-center justify-between'
                  key={request.sender.username}
                >
                  <div className='flex gap-3 items-center'>
                    <Avatar>
                      <AvatarImage src='' />
                      <AvatarFallback>
                        {request.sender.username[0].toUpperCase()}
                      </AvatarFallback>
                    </Avatar>
                    <span
                      onClick={() => router.push(`/${request.sender.username}`)}
                      className='cursor-pointer hover:underline'
                    >
                      {request.sender.username}
                    </span>
                  </div>
                  <Button
                    onClick={async (e) => {
                      e.stopPropagation();

                      try {
                        await acceptFriendRequest(request.sender.username);

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
                </li>
              ))}
            </ul>
          ) : (
            <span className='text-center'>
              You don't have any rejected requests yet.
            </span>
          )}
        </>
      );
  }
};

const Requests: NextPageWithLayout<Props> = ({
  incoming,
  outgoing,
  rejected,
}) => {
  const [list, setList] = useState<'incoming' | 'outgoing' | 'rejected'>(
    'incoming'
  );

  return (
    <>
      <div className='text-sm'>
        <ul className='flex gap-7'>
          <li
            onClick={() => setList('incoming')}
            className={`hover:bg-gray-50 rounded p-2 cursor-pointer px-[1rem] py-[0.5rem]`}
          >
            {`Incoming (${incoming.length})`}
          </li>
          <li
            onClick={() => setList('outgoing')}
            className={`hover:bg-gray-50 rounded p-2 cursor-pointer px-[1rem] py-[0.5rem]`}
          >
            {`Outgoing (${outgoing.length})`}
          </li>
          <li
            onClick={() => setList('rejected')}
            className={`hover:bg-gray-50 rounded p-2 cursor-pointer px-[1rem] py-[0.5rem]`}
          >
            {`Rejected (${rejected.length})`}
          </li>
        </ul>
      </div>
      <Separator className='mt-4 mb-4' />
      <List
        type={list}
        incoming={incoming}
        outgoing={outgoing}
        rejected={rejected}
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
    const { token } = nookies.get(ctx); // get token from the request

    axiosApiInstance.defaults.headers.Authorization = `Bearer ${token}`; // set cookie / token on the server

    const responses = await Promise.all([
      getIncomingFriendRequests(),
      getOutgoingFriendRequests(),
      getRejectedFriendRequests(),
    ]);

    return {
      props: {
        incoming: responses[0],
        outgoing: responses[1],
        rejected: responses[2],
      },
    };
  } catch (error) {
    return {
      props: {
        incoming: [],
        outgoing: [],
      },
    };
  }
};

export default Requests;
