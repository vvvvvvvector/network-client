import { destroyCookie } from 'nookies';

import axios from '@/axios';

type SignInForm = {
  username: string;
  password: string;
};

type SignUpForm = SignInForm & {
  email: string;
};

type SignInResponse = {
  token: string;
};

type SignUpResponse = {
  message: string;
  statusCode: number;
  receiver: string;
  link: string;
};

export const signIn = async (values: SignInForm): Promise<SignInResponse> => {
  const { data } = await axios.post<SignInResponse>('/auth/signin', values);

  return data;
};

export const signUp = async (values: SignUpForm): Promise<SignUpResponse> => {
  const { data } = await axios.post<SignUpResponse>('/auth/signup', values);

  return data;
};

export const signOut = () => {
  destroyCookie(null, 'next-network-token', {
    path: '/',
  });
};
