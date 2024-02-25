import { env } from '@/lib/env';

export const TOKEN_NAME = env.NEXT_PUBLIC_TOKEN_NAME || 'token';

export const DROPDOWN_MENU_ICON_STYLES = 'mr-2 size-4';

export const ICON_INSIDE_BUTTON_SIZE = 'size-4';

export const PAGES = {
  SIGN_IN: '/',
  SIGN_UP: '/signup',
  MESSENGER: '/messenger',
  MESSENGER_CHAT: '/messenger/chat',
  NEWS: '/news',
  MY_PROFILE: '/profile',
  FRIENDS: '/friends',
  FRIENDS_FIND: '/friends/find',
  FRIENDS_REQUESTS: '/friends/requests',
  PHOTOS: '/photos'
} as const;

export const MAIN_NAV_PAGES = [
  PAGES.MY_PROFILE,
  PAGES.NEWS,
  PAGES.MESSENGER,
  PAGES.FRIENDS,
  PAGES.PHOTOS
] as const;
