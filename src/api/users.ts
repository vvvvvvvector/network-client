import { axiosApiInstance } from '@/axios';

import {
  AuthorisedUser,
  NetworkUser,
  User,
  AvatarWithoutLikes
} from '@/lib/types';

// vvv ------------------authorized------------------ vvv

const getAuthorizedUserData = async () => {
  const { data } = await axiosApiInstance.get<AuthorisedUser>('/users/me');

  return data;
};

export const url = '/users/me/username-avatar';

const getAuthorizedUserUsernameAndAvatar = async (url: string) => {
  const { data } = await axiosApiInstance.get<User & AvatarWithoutLikes>(url);

  return data;
};

const getAuthorizedUserUsername = async () => {
  const { data } = await axiosApiInstance.get<string>('/users/me/username');

  return data;
};

const toogleAuthorizedUserEmailPrivacy = async () => {
  await axiosApiInstance.patch<{
    email: {
      isPublic: boolean;
    };
  }>('/users/me/contacts/email/privacy');
};

// ^^^ ------------------authorized------------------ ^^^

const getNetworkUserPubliclyAvailableData = async (username: string) => {
  const { data } = await axiosApiInstance.get<NetworkUser>(
    `/users/${username}`
  );

  return data;
};

export {
  getAuthorizedUserData,
  getNetworkUserPubliclyAvailableData,
  getAuthorizedUserUsername,
  toogleAuthorizedUserEmailPrivacy,
  getAuthorizedUserUsernameAndAvatar
};
