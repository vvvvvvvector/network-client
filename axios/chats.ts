import { axiosApiInstance } from '@/axios';

import type { Chat, ChatFromListOfChats } from '@/lib/types';

export const CHATS_ROUTE = '/chats';

// ------------------- swr uses this functions -------------------
const getAutorisedUserChats = async (url: string) => {
  const { data } = await axiosApiInstance.get<ChatFromListOfChats[]>(`${url}`);

  return data;
};
// ------------------- swr uses this functions -------------------

const initiateChat = async (addresseeUsername: string) => {
  const { data: id } = await axiosApiInstance.post<string>(`${CHATS_ROUTE}`, {
    addresseeUsername
  });

  return id;
};

const getChatIdByAddresseeUsername = async (addresseeUsername: string) => {
  const { data: id } = await axiosApiInstance.get<string>(
    `${CHATS_ROUTE}/between-users-chat-id?addressee=${addresseeUsername}`
  );

  return id;
};

const getChatData = async (url: string, id: string) => {
  const { data } = await axiosApiInstance.get<Chat>(`${url}/${id}`);

  return data;
};

export {
  getAutorisedUserChats,
  initiateChat,
  getChatIdByAddresseeUsername,
  getChatData
};
