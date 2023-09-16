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

const formSchema = z.object({
  email: z
    .string()
    .nonempty({ message: 'Email is required' })
    .email({ message: 'Invalid email address' }),
  username: z.string().nonempty({ message: 'Username is required' }),
  password: z
    .string()
    .nonempty({ message: 'Password is required' })
    .regex(new RegExp('^(?=.*[A-Za-z])(?=.*[0-9])[A-Za-z0-9]{8,}$'), {
      message: 'Minimum 8 characters, at least 1 letter and 1 number',
    }),
});

export function SignUpForm() {
  const [loading, setLoading] = useState(false);

  const { toast } = useToast();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: '',
      username: '',
      password: '',
    },
  });

  const onSubmit = async (data: z.infer<typeof formSchema>) => {
    try {
      setLoading(true);

      const { receiver, link } = await Api.auth.signUp(data);

      setLoading(false);

      toast({
        title: `Activation link has been sent to ${receiver}.`,
        description: `Link: ${link}`,
      });
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
        <Button type='submit' className='w-full' disabled={loading}>
          {loading ? 'Loading...' : 'Sign Up'}
        </Button>
      </form>
    </Form>
  );
}
