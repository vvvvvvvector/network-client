import { Icons } from '@/components/icons';

export default function ChatLoading() {
  return (
    <div className='grid h-[calc(100vh-3.5rem-0.8rem-0.8rem)] place-items-center rounded-lg bg-background'>
      <div className='grid place-items-center gap-5 p-20'>
        <span>Loading the chat...</span>
        <Icons.spinner size={40} className='animate-spin' />
      </div>
    </div>
  );
}
