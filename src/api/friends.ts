import { axiosApiInstance } from '@/axios';

import { User, ProfileWithAvatar } from '@/lib/types';

import { RequestStatus } from '@/pages/friends/find';

// vvv ------------------data------------------ vvv

const getMyFriends = async () => {
  const { data } = await axiosApiInstance.get<(User & ProfileWithAvatar)[]>(
    '/friend-requests/accepted'
  );

  return data;
};

const getOutgoingFriendRequests = async () => {
  const { data } = await axiosApiInstance.get<
    { receiver: User & ProfileWithAvatar }[]
  >('/friend-requests/sent');

  return data;
};

const getIncomingFriendRequests = async () => {
  const { data } = await axiosApiInstance.get<
    { sender: User & ProfileWithAvatar }[]
  >('/friend-requests/incoming');

  return data;
};

const getRejectedFriendRequests = async () => {
  const { data } = await axiosApiInstance.get<
    { sender: User & ProfileWithAvatar }[]
  >('/friend-requests/rejected');

  return data;
};

const getNetworkUsersUsernames = async (page: string, username: string) => {
  const { data } = await axiosApiInstance.get<{
    limit: number;
    pages: number;
    users: (User & ProfileWithAvatar & { requestStatus: RequestStatus })[];
  }>(
    `/friend-requests/find?page=${page}${
      username ? `&username=${username}` : ''
    }`
  );

  return data;
};

// ^^^ ------------------data------------------ ^^^

// vvv ------------------actions------------------ vvv

const unfriend = async (username: string) => {
  await axiosApiInstance.patch('/friend-requests/unfriend', { username });
};

const sendFriendRequest = async (username: string) => {
  await axiosApiInstance.post('/friend-requests/create', { username });
};

const acceptFriendRequest = async (username: string) => {
  await axiosApiInstance.patch('/friend-requests/accept', { username });
};

const rejectFriendRequest = async (username: string) => {
  await axiosApiInstance.patch('/friend-requests/reject', { username });
};

const cancelFriendRequest = async (username: string) => {
  await axiosApiInstance.delete('/friend-requests/cancel', {
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
