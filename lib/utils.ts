import { type ClassValue, clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

import { env } from '@/lib/env';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function capitalize(str: string) {
  return str[0].toUpperCase() + str.substring(1);
}

export function avatarSource(avatar: string | undefined) {
  if (avatar) return `${env.NEXT_PUBLIC_API_URL}/uploads/avatars/${avatar}`;
}

export function prettifyLastSeenDate(date: string) {
  const diff = new Date().valueOf() - new Date(date).valueOf();

  const inSeconds = diff / 1000;
  // console.log('inSeconds: ', inSeconds);

  if (inSeconds < 60) {
    return 'just now';
  }

  const inMinutes = inSeconds / 60;
  // console.log('inMinutes: ', inMinutes);

  if (inMinutes < 60) {
    const minutes = Math.floor(inMinutes);

    return `${minutes} ${minutes === 1 ? 'minute' : 'minutes'} ago`;
  }

  const inHours = inMinutes / 60;
  // console.log('inHours: ', inHours);

  if (inHours < 21) {
    const hours = Math.floor(inHours);

    return `${hours} ${hours === 1 ? 'hour' : 'hours'} ago`;
  }

  return `${formatDate(date)} at ${formatTime(date)}`;
}

export function formatDate(date: string, month: 'short' | 'long' = 'long') {
  return new Date(date).toLocaleDateString(undefined, {
    day: 'numeric',
    month,
    year: 'numeric'
  });
}

export function formatTime(date: string) {
  return new Date(date).toLocaleTimeString(undefined, {
    hour: '2-digit',
    minute: '2-digit'
  });
}
