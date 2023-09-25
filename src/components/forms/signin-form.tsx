import { useState } from 'react';

import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';

import { useForm } from 'react-hook-form';

import { Button } from '@/components/ui/button';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { useToast } from '@/components/ui/use-toast';

import * as Api from '@/api';
import axios from 'axios';

import { useRouter } from 'next/router';

import { setCookie } from 'nookies';

const formSchema = z.object({
  username: z.string().nonempty({ message: 'Username is required' }),
  password: z.string().nonempty({ message: 'Password is required' }),
});

export function SignInForm() {
  const [loading, setLoading] = useState(false);

  const router = useRouter();

  const { toast } = useToast();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      username: '',
      password: '',
    },
  });

  const onSubmit = async (data: z.infer<typeof formSchema>) => {
    try {
      setLoading(true);

      const { token } = await Api.auth.signIn(data);

      setLoading(false);

      setCookie(null, 'next-network-token', token, {
        path: '/',
      });

      toast({
        description: 'You have successfully signed in.',
      });

      router.push('/profile');
    } catch (error) {
      setLoading(false);

      if (axios.isAxiosError(error)) {
        toast({
          variant: 'destructive',
          description: `${error.response?.data.message}`,
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
          {loading ? 'Loading...' : 'Sign In'}
        </Button>
      </form>
    </Form>
  );
}
