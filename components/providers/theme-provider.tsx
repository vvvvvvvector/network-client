'use client';

import { ThemeProvider as NextThemesProvider } from 'next-themes';

import { type ThemeProviderProps } from 'next-themes/dist/types';

const settings: ThemeProviderProps = {
  themes: ['light', 'dark', 'system'],
  attribute: 'class',
  enableSystem: true,
  disableTransitionOnChange: false
};

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  return <NextThemesProvider {...settings}>{children}</NextThemesProvider>;
}
