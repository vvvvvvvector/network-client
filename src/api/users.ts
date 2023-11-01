import { axiosApiInstance } from '@/axios';

import { AuthorisedUser, Avatar, NetworkUser, User } from '@/lib/types';

// vvv ------------------authorized------------------ vvv

const getAuthorizedUserData = async () => {
  const { data } = await axiosApiInstance.get<AuthorisedUser>('/users/me');

  return data;
};

const getAuthorizedUserUsernameAndAvatar = async (url: string) => {
  const { data } = await axiosApiInstance.get<User & Avatar>(url);

  return data;
};

const getAuthorizedUserUsername = async () => {
  const { data } = await axiosApiInstance.get<string>('/users/me/username');

  return data;
};

// ^^^ ------------------authorized------------------ ^^^

const getNetworkUserPublicAvailableData = async (username: string) => {
  const { data } = await axiosApiInstance.get<NetworkUser>(
    `/users/${username}`
  );

  return data;
};

export {
  getAuthorizedUserData,
  getNetworkUserPublicAvailableData,
  getAuthorizedUserUsername,
  getAuthorizedUserUsernameAndAvatar
};
