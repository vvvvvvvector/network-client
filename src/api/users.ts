import { axiosApiInstance } from '@/axios';

import type {
  AuthorisedUser,
  NetworkUser,
  User,
  AvatarWithoutLikes
} from '@/lib/types';

const ROUTE = '/users';

// vvv ------------------authorized------------------ vvv

const getAuthorizedUserData = async () => {
  const { data } = await axiosApiInstance.get<AuthorisedUser>(`${ROUTE}/me`);

  return data;
};

export const url = `${ROUTE}/me/username-avatar`;

const getAuthorizedUserUsernameAndAvatar = async (url: string) => {
  const { data } = await axiosApiInstance.get<User & AvatarWithoutLikes>(url);

  return data;
};

const getAuthorizedUserUsername = async () => {
  const { data } = await axiosApiInstance.get<string>(`${ROUTE}/me/username`);

  return data;
};

const toogleAuthorizedUserEmailPrivacy = async () => {
  await axiosApiInstance.patch<{
    email: {
      isPublic: boolean;
    };
  }>(`${ROUTE}/me/contacts/email/privacy`);
};

// ^^^ ------------------authorized------------------ ^^^

const getNetworkUserPubliclyAvailableData = async (username: string) => {
  const { data } = await axiosApiInstance.get<NetworkUser>(
    `${ROUTE}/${username}`
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
