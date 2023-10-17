import { destroyCookie } from 'nookies';

import { axiosApiInstance } from '@/axios';

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

const signIn = async (values: SignInForm): Promise<SignInResponse> => {
  const { data } = await axiosApiInstance.post<SignInResponse>(
    '/auth/signin',
    values
  );

  return data;
};

const signUp = async (values: SignUpForm): Promise<SignUpResponse> => {
  const { data } = await axiosApiInstance.post<SignUpResponse>(
    '/auth/signup',
    values
  );

  return data;
};

const signOut = () => {
  destroyCookie(null, 'token', {
    path: '/'
  });
};

export { signIn, signUp, signOut };
