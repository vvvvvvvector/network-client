import { axiosApiInstance } from '@/axios';

const getMyData = async () => {
  const { data } = await axiosApiInstance.get('/users/me');

  return data;
};

const getUserPublicAvailableDataByUsername = async (username: string) => {
  const { data } = await axiosApiInstance.get(`/users/${username}`);

  return data;
};

const getAllUsersUsernames = async () => {
  const { data } = await axiosApiInstance.get('/users/usernames');

  return data;
};

export {
  getMyData,
  getUserPublicAvailableDataByUsername,
  getAllUsersUsernames,
};
