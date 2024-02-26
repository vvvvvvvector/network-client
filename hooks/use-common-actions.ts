import axios from 'axios';
import { toast } from 'sonner';
import { useRouter } from 'next/navigation';

import { getChatIdByAddresseeUsername, initiateChat } from '@/api-calls/chats';

import { env } from '@/lib/env';
import { PAGES } from '@/lib/constants';

export const useCommonActions = () => {
  const { push } = useRouter();

  const onClickGoToProfile = (username: string) => () => {
    push(`/${username}`);
  };

  const onClickOpenPhoto = (avatarName: string | undefined) => () => {
    location.href = `${env.NEXT_PUBLIC_API_URL}/uploads/avatars/${avatarName}`;
  };

  const onClickWriteMessage = (username: string) => async () => {
    try {
      const existingChatId = await getChatIdByAddresseeUsername(username); // Object.is(existingChatId, '') -> true

      if (existingChatId) {
        push(`${PAGES.MESSENGER_CHAT}?id=${existingChatId}`);
      } else {
        const newlyInitiatedChatId = await initiateChat(username);

        push(`${PAGES.MESSENGER_CHAT}?id=${newlyInitiatedChatId}`);
      }
    } catch (error) {
      if (axios.isAxiosError(error)) {
        toast.error(`${error.response?.data.message}`);
      }
    }
  };

  return {
    goToProfile: onClickGoToProfile,
    writeMessage: onClickWriteMessage,
    openPhoto: onClickOpenPhoto
  };
};
