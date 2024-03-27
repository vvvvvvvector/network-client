import { request } from '@/app/server';

import { NetworkUser } from '@/lib/types';

export async function getNetworkUserPubliclyAvailableData(username: string) {
  return request<NetworkUser>(`users/${username}`);
}
