import { type ClassValue, clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function capitalize(str: string) {
  return str[0].toUpperCase() + str.substring(1);
}

export function avatarSource(avatar?: string) {
  if (avatar)
    return `${process.env.NEXT_PUBLIC_API_URL}/uploads/avatars/${avatar}`;

  return undefined;
}
