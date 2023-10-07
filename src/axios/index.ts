import axios from 'axios';

import { parseCookies } from 'nookies';

const axiosApiInstance = axios.create();

axiosApiInstance.defaults.baseURL = process.env.NEXT_PUBLIC_API_URL;

axiosApiInstance.interceptors.request.use((req) => {
  const token = parseCookies()['token'];

  if (token) {
    req.headers.Authorization = `Bearer ${token}`;
  }

  return req;
});

export { axiosApiInstance };
