import axios from 'axios';

import { useFrequentlyUsedHooks } from '@/hooks/use-frequently-used-hooks';

import {
  unfriend,
  acceptFriendRequest,
  rejectFriendRequest,
  cancelFriendRequest,
  sendFriendRequest
} from '@/api/friends';

export const useRequestsActions = () => {
  const { router, toast } = useFrequentlyUsedHooks();

  const revalidate = () => {
    router.replace(router.asPath, undefined, {
      scroll: false
    });
  };

  const onClickUnfriend = (username: string) => async () => {
    try {
      await unfriend(username);

      toast({
        description: `${username} was successfully deleted from your friends list.`
      });

      revalidate();
    } catch (error) {
      if (axios.isAxiosError(error)) {
        toast({
          variant: 'destructive',
          description: `${error.response?.data.message}`
        });
      }
    }
  };

  const onClickAcceptFriendRequest = <T = HTMLButtonElement>(
    username: string
  ) => {
    return async (e: React.MouseEvent<T, MouseEvent>) => {
      e.stopPropagation();

      try {
        await acceptFriendRequest(username);

        toast({
          description: 'Friend request was successfully accepted.'
        });

        revalidate();
      } catch (error) {
        if (axios.isAxiosError(error)) {
          toast({
            variant: 'destructive',
            description: `${error.response?.data.message}`
          });
        }
      }
    };
  };

  const onClickRejectFriendRequest = <T = HTMLButtonElement>(
    username: string
  ) => {
    return async (e: React.MouseEvent<T, MouseEvent>) => {
      e.stopPropagation();

      try {
        await rejectFriendRequest(username);

        toast({
          description: 'Friend request was successfully rejected.'
        });

        revalidate();
      } catch (error) {
        if (axios.isAxiosError(error)) {
          toast({
            variant: 'destructive',
            description: `${error.response?.data.message}`
          });
        }
      }
    };
  };

  const onClickCancelRequest = <T = HTMLButtonElement>(username: string) => {
    return async (e: React.MouseEvent<T, MouseEvent>) => {
      e.stopPropagation();

      try {
        await cancelFriendRequest(username);

        toast({
          description: 'Friend request was successfully canceled.'
        });

        revalidate();
      } catch (error) {
        if (axios.isAxiosError(error)) {
          toast({
            variant: 'destructive',
            description: `${error.response?.data.message}`
          });
        }
      }
    };
  };

  const onClickSendFriendRequest = <T = HTMLButtonElement>(
    username: string
  ) => {
    return async (e: React.MouseEvent<T, MouseEvent>) => {
      e.stopPropagation();

      try {
        await sendFriendRequest(username);

        toast({
          description: 'Friend request was successfully sent.'
        });

        revalidate();
      } catch (error) {
        if (axios.isAxiosError(error)) {
          toast({
            variant: 'destructive',
            description: `${error.response?.data.message}`
          });
        }
      }
    };
  };

  return {
    accept: onClickAcceptFriendRequest,
    unfriend: onClickUnfriend,
    reject: onClickRejectFriendRequest,
    cancel: onClickCancelRequest,
    send: onClickSendFriendRequest
  };
};
