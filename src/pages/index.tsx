import { useRouter } from 'next/router';

import { SignInForm } from '@/components/signin-form';
import { Separator } from '@/components/ui/separator';

export default function SignIn() {
  const router = useRouter();

  return (
    <div className='w-full max-w-[350px] space-y-7'>
      <h3 className='text-lg font-medium text-center'>Hello 👋</h3>
      <SignInForm />
      <Separator />
      <div className='text-sm text-muted-foreground text-center space-x-4'>
        <span>Don't have an account?</span>
        <button
          className='hover:text-black hover:underline'
          onClick={() => router.push('/signup')}
        >
          Sign up
        </button>
      </div>
    </div>
  );
}
