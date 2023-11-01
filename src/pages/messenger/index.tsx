import { useRouter } from 'next/router';

import { NextPageWithLayout } from '@/pages/_app';

import { Main } from '@/layouts/main';
import { Authorized } from '@/layouts/authorised';

import { Separator } from '@/components/ui/separator';
import { Avatar } from '@/components/avatar';

import { PAGES } from '@/lib/constants';

// chats fetch on client using SWR
const chats = [
  {
    id: 'djaskdj312312aksjdksa',
    friendUsername: 'happy',
    friendAvatar: '',
    lastChatMessage: 'hello',
    lastChatMessageDate: '11 Oct 2023'
  },
  {
    id: 'd412658askj31dkaswqeq',
    friendUsername: 'sad',
    friendAvatar: '',
    lastChatMessage: 'How are you?',
    lastChatMessageDate: '15 Oct 2023'
  },
  {
    id: 'djaskjdk312312aswqeq',
    friendUsername: 'vector',
    friendAvatar: '',
    lastChatMessage: 'yeah, i am fine',
    lastChatMessageDate: '12 Oct 2023'
  },
  {
    id: '312132jaskjdka87783swqeq',
    friendUsername: 'papich',
    friendAvatar: '',
    lastChatMessage: 'xDddddddd',
    lastChatMessageDate: '20 Oct 2023'
  }
];

const Messenger: NextPageWithLayout = () => {
  const router = useRouter();

  return (
    <div className='rounded-lg bg-background p-5'>
      <span>Messenger</span>
      <Separator className='mb-4 mt-4' />
      <ul className='flex flex-col gap-8'>
        {chats.map((chat) => (
          <li
            onClick={() =>
              router.push({
                pathname: PAGES.MESSENGER_CHAT,
                query: {
                  id: `${chat.id}->${chat.friendUsername}`
                }
              })
            }
            key={chat.id}
            className='flex cursor-pointer items-center gap-5 transition-[transform] hover:scale-[1.03]'
          >
            <Avatar
              className='ml-2'
              username='helloworld'
              size='medium'
              avatar={chat.friendAvatar}
            />
            <div className='flex w-full flex-col gap-2'>
              <div className='flex justify-between'>
                <span className='font-bold'>{chat.friendUsername}</span>
                <span className='mr-2'>{chat.lastChatMessageDate}</span>
              </div>
              <span>{chat.lastChatMessage}</span>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
};

Messenger.getLayout = (page) => (
  <Main title='Authorised / Messenger'>
    <Authorized>{page}</Authorized>
  </Main>
);

export default Messenger;
