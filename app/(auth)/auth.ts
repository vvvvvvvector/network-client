import { cookies } from 'next/headers';
import { z } from 'zod';

import { TOKEN_NAME } from '@/lib/constants';

const checkAuthSchema = z
  .object({
    username: z.string().nullish()
  })
  .transform(({ username }) => (username ? true : false));

const isAuthorized = async () => {
  const token = cookies().get(TOKEN_NAME)?.value;

  const res = await fetch(
    `${process.env.NEXT_PUBLIC_API_URL}/users/me/username`,
    {
      headers: {
        Authorization: `Bearer ${token}`
      }
    }
  );

  return checkAuthSchema.parse(await res.json());
};

export { isAuthorized };
