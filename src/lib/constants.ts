export const TOKEN_NAME = process.env.NEXT_PUBLIC_TOKEN_NAME || 'token';

export const DROPDOWN_MENU_ICON_STYLES = 'mr-2 h-4 w-4';

export const ICON_INSIDE_BUTTON_SIZE = 17;

export const PAGES = {
  SIGN_IN: '/',
  SIGN_UP: '/signup',
  MESSENGER: '/messenger',
  MESSENGER_CHAT: '/messenger/chat',
  NEWS: '/news',
  MY_PROFILE: '/profile',
  FRIENDS_ALL: '/friends',
  FRIENDS_FIND: '/friends/find',
  FRIENDS_REQUESTS: '/friends/requests'
} as const;
