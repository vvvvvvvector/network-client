import { axiosApiInstance } from '@/axios';

import { AuthorisedUser, Avatar, NetworkUser, User } from '@/lib/types';

const getMyData = async () => {
  const { data } = await axiosApiInstance.get<AuthorisedUser>('/users/me');

  return data;
};

const getUserPublicAvailableDataByUsername = async (username: string) => {
  const { data } = await axiosApiInstance.get<NetworkUser>(
    `/users/${username}`
  );

  return data;
};

const getMyUsernameAndAvatar = async (url: string) => {
  const { data } = await axiosApiInstance.get<User & Avatar>(url);

  return data;
};

const getAuthorizedUserUsername = async () => {
  const { data } = await axiosApiInstance.get<string>('/users/me/username');

  return data;
};

export {
  getMyData,
  getUserPublicAvailableDataByUsername,
  getAuthorizedUserUsername,
  getMyUsernameAndAvatar
};
