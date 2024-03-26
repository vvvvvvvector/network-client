'use server';

import { cookies } from 'next/headers';

import { env } from '@/lib/env';

import { TOKEN_NAME } from '@/lib/constants';

type FetchOptions = Parameters<typeof fetch>[1];

export async function request<T>(
  endpoint: string,
  options: FetchOptions = {}
): Promise<T> {
  const cookiesStore = cookies();
  const token = cookiesStore.get(TOKEN_NAME);

  const res = await fetch(`${env.NEXT_PUBLIC_API_URL}/${endpoint}`, {
    headers: {
      Accept: 'application/json',
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token?.value}`
    },
    ...(options.body && { ...{ body: JSON.stringify(options.body) } }),
    ...options
  });

  return res.json();
}
