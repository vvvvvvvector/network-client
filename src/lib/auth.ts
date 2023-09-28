import { GetServerSidePropsContext } from 'next';

import { axiosApiInstance } from '@/axios';

import nookies from 'nookies';

import { getAuthorizedUserUsername } from '@/api/users';

export const isAuthorized = async (ctx: GetServerSidePropsContext) => {
  const { token } = nookies.get(ctx); // get token from the request

  axiosApiInstance.defaults.headers.Authorization = `Bearer ${token}`; // set cookie / token on the server

  try {
    await getAuthorizedUserUsername(); // request which requires token. It will return error if user is not authorized
  } catch (err) {
    return {
      redirect: {
        destination: '/',
        permanent: false,
      },
    };
  }
};
