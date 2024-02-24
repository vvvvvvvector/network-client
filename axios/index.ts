import axios from 'axios';
import { parseCookies } from 'nookies';

import { env } from '@/lib/env';
import { TOKEN_NAME } from '@/lib/constants';

const axiosApiInstance = axios.create();

axiosApiInstance.defaults.baseURL = env.NEXT_PUBLIC_API_URL;

axiosApiInstance.interceptors.request.use((req) => {
  const token = parseCookies()[TOKEN_NAME];

  if (token) {
    req.headers.Authorization = `Bearer ${token}`;
  }

  return req;
});

export { axiosApiInstance };
