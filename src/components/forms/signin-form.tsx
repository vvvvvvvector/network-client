import { useState } from 'react';
import { z } from 'zod';
import { useForm } from 'react-hook-form';
import axios from 'axios';
import { setCookie } from 'nookies';
import { Loader2 } from 'lucide-react';
import { zodResolver } from '@hookform/resolvers/zod';

import { Button } from '@/components/ui/button';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';

import { signIn } from '@/api/auth';

import { useCombain } from '@/hooks/use-combain';

import { ICON_INSIDE_BUTTON_SIZE, PAGES, TOKEN } from '@/lib/constants';

const formSchema = z.object({
  username: z.string().nonempty({ message: 'Username is required' }),
  password: z.string().nonempty({ message: 'Password is required' })
});

export function SignInForm() {
  const [loading, setLoading] = useState(false);

  const { router, toast } = useCombain();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      username: '',
      password: process.env.NEXT_PUBLIC_SIGN_IN_PASSWORD || ''
    }
  });

  const onSubmit = async (data: z.infer<typeof formSchema>) => {
    try {
      setLoading(true);

      const { token } = await signIn(data);

      setLoading(false);

      setCookie(null, TOKEN, token, {
        path: '/'
      });

      toast({
        description: 'You have successfully signed in.'
      });

      router.push(PAGES.NEWS);
    } catch (error) {
      setLoading(false);

      if (axios.isAxiosError(error)) {
        toast({
          variant: 'destructive',
          description: `${error.response?.data.message}`
        });
      }
    }
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className='space-y-10'>
        <FormField
          control={form.control}
          name='username'
          render={({ field }) => (
            <FormItem>
              <FormLabel>Username</FormLabel>
              <FormControl>
                <Input
                  placeholder='your username here...'
                  type='text'
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        ></FormField>
        <FormField
          control={form.control}
          name='password'
          render={({ field }) => (
            <FormItem>
              <FormLabel>Password</FormLabel>
              <FormControl>
                <Input
                  placeholder='your password here...'
                  type='password'
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        ></FormField>
        <Button type='submit' className='w-full' disabled={loading}>
          {loading ? (
            <div className='flex items-center gap-2'>
              <Loader2
                size={ICON_INSIDE_BUTTON_SIZE}
                className='animate-spin'
              />
              <span>Loading...</span>
            </div>
          ) : (
            'Sign In'
          )}
        </Button>
      </form>
    </Form>
  );
}
