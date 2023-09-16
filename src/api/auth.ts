import { destroyCookie } from 'nookies';

import {
  SignInFormDto,
  SignInResponse,
  SignUpFormDto,
  SignUpResponse,
} from './dtos/auth.dto';

import axios from '@/axios';

export const signIn = async (
  values: SignInFormDto
): Promise<SignInResponse> => {
  const { data } = await axios.post<SignInResponse>('/auth/signin', values);

  return data;
};

export const signUp = async (
  values: SignUpFormDto
): Promise<SignUpResponse> => {
  const { data } = await axios.post<SignUpResponse>('/auth/signup', values);

  return data;
};

export const signOut = () => {
  destroyCookie(null, 'next-network-token', {
    path: '/',
  });
};
