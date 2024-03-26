'use client';

import { useState, useTransition } from 'react';
import { z } from 'zod';
import axios from 'axios';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';

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

import { Icons } from '@/components/icons';

import { signUp } from '@/axios/auth';

import { ICON_INSIDE_BUTTON_SIZE, PAGES } from '@/lib/constants';
import { cn } from '@/lib/utils';

const formSchema = z.object({
  email: z
    .string()
    .min(1, { message: 'Email is required' })
    .email({ message: 'Invalid email address' }),
  username: z.string().min(1, { message: 'Username is required' }),
  password: z
    .string()
    .min(1, { message: 'Password is required' })
    .regex(new RegExp('^(?=.*[A-Za-z])(?=.*[0-9])[A-Za-z0-9]{8,}$'), {
      message: 'Minimum 8 characters, at least 1 letter and 1 number'
    })
});

export const SignUpForm = () => {
  const [loading, setLoading] = useState(false);

  const [isPending, startTransition] = useTransition();

  const router = useRouter();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: '',
      username: '',
      password: ''
    }
  });

  const onSubmit = async (data: z.infer<typeof formSchema>) => {
    try {
      setLoading(true);

      const { receiver, link } = await signUp(data);

      setLoading(false);

      toast.success(`Activation link has been sent to ${receiver}.`, {
        description: `Link: ${link}`
      });

      startTransition(() => {
        router.push(PAGES.SIGN_IN);
      });
    } catch (error) {
      setLoading(false);

      if (axios.isAxiosError(error)) {
        toast.error(`${error.response?.data.message}`);
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className='space-y-10'>
        <FormField
          control={form.control}
          name='email'
          render={({ field }) => (
            <FormItem>
              <FormLabel>Email</FormLabel>
              <FormControl>
                <Input
                  placeholder='your email here...'
                  type='text'
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
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
        />
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
        />
        <Button
          type='submit'
          className='w-full'
          disabled={loading || isPending}
        >
          {loading || isPending ? (
            <div className='flex items-center gap-2'>
              <Icons.spinner
                className={cn('animate-spin', ICON_INSIDE_BUTTON_SIZE)}
              />
              <span>Loading...</span>
            </div>
          ) : (
            'Sign Up'
          )}
        </Button>
      </form>
    </Form>
  );
};
