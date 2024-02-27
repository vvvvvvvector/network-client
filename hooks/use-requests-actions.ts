import axios from 'axios';
import { toast } from 'sonner';
import { usePathname, useRouter, useSearchParams } from 'next/navigation';

import {
  unfriend,
  acceptFriendRequest,
  rejectFriendRequest,
  cancelFriendRequest,
  sendFriendRequest
} from '@/api-calls/friends';

export const useRequestsActions = () => {
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const { replace } = useRouter();

  const revalidate = () => {
    replace(`${pathname}?${searchParams}`);
  };

  const onClickUnfriend = (username: string) => async () => {
    try {
      await unfriend(username);

      toast.success(
        `${username} was successfully deleted from your friends list.`
      );

      revalidate();
    } catch (error) {
      if (axios.isAxiosError(error)) {
        toast.error(`${error.response?.data.message}`);
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

        toast.success('Friend request was successfully accepted.');

        revalidate();
      } catch (error) {
        if (axios.isAxiosError(error)) {
          toast.error(`${error.response?.data.message}`);
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

        toast.success('Friend request was successfully rejected.');

        revalidate();
      } catch (error) {
        if (axios.isAxiosError(error)) {
          toast.error(`${error.response?.data.message}`);
        }
      }
    };
  };

  const onClickCancelRequest = <T = HTMLButtonElement>(username: string) => {
    return async (e: React.MouseEvent<T, MouseEvent>) => {
      e.stopPropagation();

      try {
        await cancelFriendRequest(username);

        toast.success('Friend request was successfully canceled.');

        revalidate();
      } catch (error) {
        if (axios.isAxiosError(error)) {
          toast.error(`${error.response?.data.message}`);
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

        toast.success('Friend request was successfully sent.');

        revalidate();
      } catch (error) {
        if (axios.isAxiosError(error)) {
          toast.error(`${error.response?.data.message}`);
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
