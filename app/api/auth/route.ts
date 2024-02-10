import { z } from 'zod';
import { type NextRequest } from 'next/server';

import { TOKEN_NAME } from '@/lib/constants';

const schema = z.object({
  username: z.string().nullish()
});

export async function GET(request: NextRequest) {
  const token = request.cookies.get(TOKEN_NAME)?.value;

  const res = await fetch(
    `${process.env.NEXT_PUBLIC_API_URL}/users/me/username`,
    {
      headers: {
        Authorization: `Bearer ${token}`
      }
    }
  );

  const json = schema.parse(await res.json());

  if (json.username) {
    return Response.json({ success: true });
  } else {
    return Response.json({
      success: false
    });
  }
}
