'use client';

import { useParams } from 'next/navigation';

export default function NetworkUserNotFoundPage() {
  const params = useParams<{ username: string }>();

  return (
    <div className='rounded-lg bg-background p-5'>
      <p className='my-11 text-center leading-9'>
        User
        <b>{` ${params ? params.username : 'what just happend?'} `}</b>
        doesn&apos;t exist.
        <br /> <span className='text-4xl'>🧐</span>
      </p>
    </div>
  );
}
