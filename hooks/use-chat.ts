import useSWR from 'swr';

import { CHATS_ROUTE, getChatData } from '@/api/chats';

export const useChat = (id: string | undefined) => {
  const { data, isLoading } = useSWR(
    id ? [CHATS_ROUTE, id] : null,
    ([url, id]) => getChatData(url, id)
  );

  return { data, isLoading };
};
