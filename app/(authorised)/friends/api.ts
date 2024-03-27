import { request } from '@/app/server';

import type { RequestStatus } from '@/axios/friends';

import type { UserFromListOfUsers } from '@/lib/types';

export async function getMyFriends() {
  return request<UserFromListOfUsers[]>(`friend-requests/accepted`);
}

export async function getNetworkUsersUsernames(
  page: string,
  searchValue?: string
) {
  const searchQuery = searchValue ? `&username=${searchValue}` : '';
  return request<{
    limit: number;
    pages: number;
    users: (UserFromListOfUsers & { requestStatus: RequestStatus })[];
  }>(`friend-requests/find?page=${page}` + searchQuery);
}

export async function getIncomingFriendRequests() {
  return request<UserFromListOfUsers[]>(`friend-requests/incoming`);
}

export async function getOutgoingFriendRequests() {
  return request<UserFromListOfUsers[]>(`friend-requests/sent`);
}

export async function getRejectedFriendRequests() {
  return request<UserFromListOfUsers[]>(`friend-requests/rejected`);
}
