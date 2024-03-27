import { axiosApiInstance } from '@/axios';

import type {
  AuthorisedUser,
  NetworkUser,
  User,
  AvatarWithoutLikes
} from '../lib/types';

const ROUTE = '/users';

// vvv ------------------authorised------------------ vvv

const getAuthorisedUserData = async () => {
  const { data } = await axiosApiInstance.get<AuthorisedUser>(`${ROUTE}/me`);

  return data;
};

export const url = `${ROUTE}/me/username-avatar`;

const getAuthorisedUserUsernameAndAvatar = async (url: string) => {
  const { data } = await axiosApiInstance.get<User & AvatarWithoutLikes>(url);

  return data;
};

const getAuthorisedUserUsername = async () => {
  const { data } = await axiosApiInstance.get<{ username: string }>(
    `${ROUTE}/me/username`
  );

  return data;
};

const toogleAuthorisedUserEmailPrivacy = async () => {
  await axiosApiInstance.patch<{
    email: {
      isPublic: boolean;
    };
  }>(`${ROUTE}/me/contacts/email/privacy`);
};

// ^^^ ------------------authorised------------------ ^^^

const getNetworkUserPubliclyAvailableData = async (username: string) => {
  const { data } = await axiosApiInstance.get<NetworkUser>(
    `${ROUTE}/${username}`
  );

  return data;
};

export {
  getAuthorisedUserData,
  getNetworkUserPubliclyAvailableData,
  getAuthorisedUserUsername,
  toogleAuthorisedUserEmailPrivacy,
  getAuthorisedUserUsernameAndAvatar
};
