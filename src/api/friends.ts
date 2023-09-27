import { axiosApiInstance } from '@/axios';

const sendFriendRequest = async (username: string) => {
  await axiosApiInstance.post('/friend-requests/create', { username });
};

const acceptFriendRequest = async (username: string) => {
  await axiosApiInstance.patch('/friend-requests/accept', { username });
};

const rejectFriendRequest = async (username: string) => {
  await axiosApiInstance.patch('/friend-requests/reject', { username });
};

const getMyFriends = async () => {
  const { data } = await axiosApiInstance.get('/friend-requests/accepted');

  return data;
};

const getOutgoingFriendRequests = async () => {
  const { data } = await axiosApiInstance.get('/friend-requests/sent');

  return data;
};

const getIncomingFriendRequests = async () => {
  const { data } = await axiosApiInstance.get('/friend-requests/incoming');

  return data;
};

const getRejectedFriendRequests = async () => {
  const { data } = await axiosApiInstance.get('/friend-requests/rejected');

  return data;
};

export {
  sendFriendRequest,
  getMyFriends,
  getIncomingFriendRequests,
  getOutgoingFriendRequests,
  getRejectedFriendRequests,
  acceptFriendRequest,
  rejectFriendRequest,
};
