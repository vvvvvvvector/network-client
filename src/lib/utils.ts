import { type ClassValue, clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function capitalize(str: string) {
  return str[0].toUpperCase() + str.substring(1);
}

export function avatarSource(avatar: string | null) {
  if (avatar)
    return `${process.env.NEXT_PUBLIC_API_URL}/uploads/avatars/${avatar}`;
}

export function formatDate(createdAt: string) {
  const getMonth = (month: number) => {
    switch (month) {
      case 1:
        return 'January';
      case 2:
        return 'February';
      case 3:
        return 'March';
      case 4:
        return 'April';
      case 5:
        return 'May';
      case 6:
        return 'June';
      case 7:
        return 'July';
      case 8:
        return 'August';
      case 9:
        return 'September';
      case 10:
        return 'October';
      case 11:
        return 'November';
      case 12:
        return 'December';
      default:
        return 'Error';
    }
  };

  const date = new Date(createdAt);

  const day = date.getDate();
  const month = date.getMonth() + 1;
  const year = date.getFullYear();

  return `${day} ${getMonth(month)} ${year}`;
}
