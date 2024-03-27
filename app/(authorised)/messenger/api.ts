import { request } from '@/app/server';

import { type ChatFromListOfChats } from '@/lib/types';

export async function getAutorisedUserChats() {
  return request<ChatFromListOfChats[]>('chats');
}
