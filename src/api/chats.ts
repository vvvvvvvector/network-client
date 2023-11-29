import { axiosApiInstance } from '@/axios';

import { Chat } from '@/lib/types';

export const CHATS_ROUTE = '/chats';

// ------------------- swr uses this functions -------------------
const getAutorizedUserChats = async (url: string) => {
  const { data } = await axiosApiInstance.get<Chat[]>(`${url}`);

  return data;
};
// ------------------- swr uses this functions -------------------

const initiateChat = async (addresseeUsername: string) => {
  await axiosApiInstance.post(`${CHATS_ROUTE}`, { addresseeUsername });
};

export { getAutorizedUserChats, initiateChat };
