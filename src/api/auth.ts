import { destroyCookie } from 'nookies';

import { axiosApiInstance } from '@/axios';

import { TOKEN } from '@/lib/constants';

const signIn = async (values: { username: string; password: string }) => {
  const { data } = await axiosApiInstance.post<{ token: string }>(
    '/auth/signin',
    values
  );

  return data;
};

const signUp = async (values: {
  username: string;
  password: string;
  email: string;
}) => {
  const { data } = await axiosApiInstance.post<{
    message: string;
    statusCode: number;
    receiver: string;
    link: string;
  }>('/auth/signup', values);

  return data;
};

const signOut = () => {
  destroyCookie(null, TOKEN, {
    path: '/'
  });
};

export { signIn, signUp, signOut };
