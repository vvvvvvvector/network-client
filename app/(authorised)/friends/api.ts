import { request } from '@/app/server';

import type { UserFromListOfUsers } from '@/lib/types';

export async function getMyFriends() {
  return request<UserFromListOfUsers[]>(`friend-requests/accepted`);
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
