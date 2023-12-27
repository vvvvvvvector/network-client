import { type PropsWithChildren } from 'react';

import { ThemeProvider as NextThemesProvider } from 'next-themes';

import { type ThemeProviderProps } from 'next-themes/dist/types';

const settings: ThemeProviderProps = {
  themes: ['light', 'dark', 'system'],
  attribute: 'class',
  enableSystem: true,
  disableTransitionOnChange: false
};

export function ThemeProvider({ children }: PropsWithChildren) {
  return <NextThemesProvider {...settings}>{children}</NextThemesProvider>;
}
