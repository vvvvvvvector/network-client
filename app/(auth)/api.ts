import { z } from 'zod';

import { request } from '@/app/server';

const checkAuthSchema = z
  .object({
    username: z.string().nullish()
  })
  .transform(({ username }) => (username ? true : false));

const isAuthorized = async () => {
  return checkAuthSchema.parse(await request('users/me/username'));
};

export { isAuthorized };
