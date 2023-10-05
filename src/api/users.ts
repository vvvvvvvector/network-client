import { axiosApiInstance } from '@/axios';

const getMyData = async () => {
  const { data } = await axiosApiInstance.get('/users/me');

  return data;
};

const getMyUsernameAndAvatar = async (url: string) => {
  const { data } = await axiosApiInstance.get(url);

  return data;
};

const getAuthorizedUserUsername = async () => {
  const { data } = await axiosApiInstance.get('/users/me/username');

  return data;
};

const getUserPublicAvailableDataByUsername = async (username: string) => {
  const { data } = await axiosApiInstance.get(`/users/${username}`);

  return data;
};

export {
  getMyData,
  getUserPublicAvailableDataByUsername,
  getAuthorizedUserUsername,
  getMyUsernameAndAvatar,
};
