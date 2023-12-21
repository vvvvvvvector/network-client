import type { GetServerSidePropsContext } from 'next';
import nookies from 'nookies';

import { axiosApiInstance } from '@/axios';

import { getAuthorizedUserUsername } from '@/api/users';

import { PAGES, TOKEN_NAME } from '@/lib/constants';

type Redirect = {
  destination: string;
  permanent: boolean;
};

export const isRedirect = (
  res: { redirect: Redirect } | undefined
): res is { redirect: Redirect } => {
  if (!res) return false;

  return 'redirect' in res;
};

export const isAuthorized = async (ctx: GetServerSidePropsContext) => {
  const token = nookies.get(ctx)[TOKEN_NAME]; // get token from the request

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
