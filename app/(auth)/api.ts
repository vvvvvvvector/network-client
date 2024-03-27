import { z } from 'zod';

import { request } from '@/app/server';

const checkAuthSchema = z.object({
  username: z.string().nullish()
});

const isAuthorised = async () => {
  return {
    signedInUserUsername: checkAuthSchema.parse(
      await request('users/me/username')
    ).username
  };
};

export { isAuthorised };
