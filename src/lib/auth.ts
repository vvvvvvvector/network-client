import { GetServerSidePropsContext } from 'next';
import nookies from 'nookies';

import { axiosApiInstance } from '@/axios';

import { getAuthorizedUserUsername } from '@/api/users';
import { PAGES } from '@/lib/constants';

export const isAuthorized = async (ctx: GetServerSidePropsContext) => {
  const { token } = nookies.get(ctx); // get token from the request

  axiosApiInstance.defaults.headers.Authorization = `Bearer ${token}`; // set cookie / token on the server

  try {
    await getAuthorizedUserUsername(); // request which requires token. It will return error if user is not authorized
  } catch (err) {
    return {
      redirect: {
        destination: PAGES.SIGN_IN,
        permanent: false
      }
    };
  }
};
