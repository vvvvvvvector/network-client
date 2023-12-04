import { type ClassValue, clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function capitalize(str: string) {
  return str[0].toUpperCase() + str.substring(1);
}

export function avatarSource(avatar: string | undefined) {
  if (avatar)
    return `${process.env.NEXT_PUBLIC_API_URL}/uploads/avatars/${avatar}`;
}

export function formatDate(createdAt: string) {
  const date = new Date(createdAt);

  const result = date.toLocaleDateString(undefined, {
    day: '2-digit',
    month: 'long',
    year: 'numeric'
  });

  return result;
}

export function formatTime(createdAt: string) {
  const date = new Date(createdAt);

  const result = date.toLocaleTimeString(undefined, {
    hour: '2-digit',
    minute: '2-digit'
  });

  return result;
}
