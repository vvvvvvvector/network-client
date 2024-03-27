import type { AuthorisedUser } from '@/lib/types';

import { request } from '@/app/server';

export async function getAuthorisedUserData() {
  return request<AuthorisedUser>('users/me');
}
