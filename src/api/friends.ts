import { axiosApiInstance } from '@/axios';

import { User, ProfileWithAvatarWithoutLikes } from '@/lib/types';

import { RequestStatus } from '@/pages/friends/find';

const ROUTE = '/friend-requests';

// vvv ------------------data------------------ vvv

type U = User & ProfileWithAvatarWithoutLikes;

const getMyFriends = async () => {
  const { data } = await axiosApiInstance.get<U[]>(`${ROUTE}/accepted`);

  return data;
};

const getOutgoingFriendRequests = async () => {
  const { data } = await axiosApiInstance.get<U[]>(`${ROUTE}/sent`);

  return data;
};

const getIncomingFriendRequests = async () => {
  const { data } = await axiosApiInstance.get<U[]>(`${ROUTE}/incoming`);

  return data;
};

const getRejectedFriendRequests = async () => {
  const { data } = await axiosApiInstance.get<U[]>(`${ROUTE}/rejected`);

  return data;
};

const getNetworkUsersUsernames = async (page: string, username: string) => {
  const { data } = await axiosApiInstance.get<{
    limit: number;
    pages: number;
    users: (U & { requestStatus: RequestStatus })[];
  }>(`${ROUTE}/find?page=${page}${username ? `&username=${username}` : ''}`);

  return data;
};

// ^^^ ------------------data------------------ ^^^

// vvv ------------------actions------------------ vvv

const unfriend = async (username: string) => {
  await axiosApiInstance.patch(`${ROUTE}/unfriend`, { username });
};

const sendFriendRequest = async (username: string) => {
  await axiosApiInstance.post(`${ROUTE}/create`, { username });
};

const acceptFriendRequest = async (username: string) => {
  await axiosApiInstance.patch(`${ROUTE}/accept`, { username });
};

const rejectFriendRequest = async (username: string) => {
  await axiosApiInstance.patch(`${ROUTE}/reject`, { username });
};

const cancelFriendRequest = async (username: string) => {
  await axiosApiInstance.delete(`${ROUTE}/cancel`, {
    data: {
      username
    }
  });
};

// ^^^ ------------------actions------------------ ^^^

export {
  sendFriendRequest,
  getMyFriends,
  getIncomingFriendRequests,
  getOutgoingFriendRequests,
  getRejectedFriendRequests,
  acceptFriendRequest,
  rejectFriendRequest,
  getNetworkUsersUsernames,
  unfriend,
  cancelFriendRequest
};
