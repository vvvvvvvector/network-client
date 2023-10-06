import { type ClassValue, clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function capitalize(str: string) {
  return str[0].toUpperCase() + str.substring(1);
}

export function firstLetterToUpperCase(str: string | undefined) {
  if (str) {
    return str[0].toLocaleUpperCase();
  }

  return 'x';
}
