import { request } from '@/app/server';

import type { UserFromListOfUsers } from '@/lib/types';

export async function getMyFriends() {
  return request<UserFromListOfUsers[]>(`friend-requests/accepted`);
}
