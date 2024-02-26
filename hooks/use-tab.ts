import { useSearchParams } from 'next/navigation';

export function useTab<T extends Readonly<Array<string>>>(tabName: string) {
  const searchParams = useSearchParams();

  const params = new URLSearchParams(searchParams?.toString());

  return params.get(tabName) as T[number];
}
