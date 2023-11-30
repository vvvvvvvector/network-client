import axios from 'axios';

import { getChatIdByAddresseeUsername, initiateChat } from '@/api/chats';

import { useFrequentlyUsedHooks } from '@/hooks/use-frequently-used-hooks';

import { PAGES } from '@/lib/constants';

export const useCommonActions = () => {
  const { router, toast } = useFrequentlyUsedHooks();

  const onClickGoToProfile = (username: string) => () => {
    router.push(`/${username}`);
  };

  const onClickWriteMessage = (username: string) => async () => {
    try {
      const existingChatId = await getChatIdByAddresseeUsername(username); // Object.is(existingChatId, '') -> true

      if (existingChatId) {
        router.push({
          pathname: PAGES.MESSENGER_CHAT,
          query: {
            id: existingChatId
          }
        });
      } else {
        const newlyInitiatedChatId = await initiateChat(username);

        router.push({
          pathname: PAGES.MESSENGER_CHAT,
          query: {
            id: newlyInitiatedChatId
          }
        });
      }
    } catch (error) {
      if (axios.isAxiosError(error)) {
        toast({
          variant: 'destructive',
          description: `${error.response?.data.message}`
        });
      }
    }
  };

  const onClickOpenPhoto = (avatarName: string | undefined) => () => {
    location.href = `${process.env.NEXT_PUBLIC_API_URL}/uploads/avatars/${avatarName}`;
  };

  return {
    goToProfile: onClickGoToProfile,
    writeMessage: onClickWriteMessage,
    openPhoto: onClickOpenPhoto
  };
};
