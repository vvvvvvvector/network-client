import { type Metadata } from 'next';

import { getChatData } from '@/app/(authorised)/messenger/api';

import { Chat } from '@/components/messenger/chat';

interface Props {
  params: {
    chatId: string;
  };
}

export const metadata: Metadata = {
  title: 'Messenger / Chat'
};

export default async function ChatPage({ params }: Props) {
  const chat = await getChatData(params.chatId);

  return (
    <div className='flex h-[calc(100vh-3.5rem-0.8rem-0.8rem)] flex-col gap-2 rounded-lg bg-background p-4'>
      <Chat chat={chat} />
    </div>
  );
}
