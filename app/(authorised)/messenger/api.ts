import { request } from '@/app/server';

import type { Chat, ChatFromListOfChats } from '@/lib/types';

export async function getAutorisedUserChats() {
  return request<ChatFromListOfChats[]>('chats');
}

export async function getChatData(chatId: string) {
  return request<Chat>(`chats/${chatId}`);
}
