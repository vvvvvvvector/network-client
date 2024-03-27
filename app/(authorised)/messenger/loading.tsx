import { Icons } from '@/components/icons';

export default function MessengerChatsListLoading() {
  return (
    <div className='rounded-lg bg-background'>
      <div className='grid place-items-center gap-5 rounded-lg bg-background p-20'>
        <span>Loading your chats...</span>
        <Icons.spinner size={50} className='animate-spin' />
      </div>
    </div>
  );
}
