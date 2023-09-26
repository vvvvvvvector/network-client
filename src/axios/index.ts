import axios from 'axios';

import { parseCookies } from 'nookies';

const axiosApiInstance = axios.create();

axiosApiInstance.defaults.baseURL = 'http://localhost:5173';

axiosApiInstance.interceptors.request.use((req) => {
  const token = parseCookies()['token'];

  if (token) {
    req.headers.Authorization = `Bearer ${token}`;
  }

  return req;
});

export { axiosApiInstance };
