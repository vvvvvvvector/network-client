import type { ReactElement, ReactNode } from 'react';
import type { NextPage } from 'next';
import type { AppProps } from 'next/app';
import { Source_Code_Pro } from 'next/font/google';
import { ThemeProviderProps } from 'next-themes/dist/types';

import { Toaster } from '@/components/ui/toaster';
import { ThemeProvider } from '@/components/theme-provider';

import '@/styles/globals.css';

const globalFont = Source_Code_Pro({
  subsets: ['latin']
});

const settings: ThemeProviderProps = {
  themes: ['light', 'dark', 'system'],
  attribute: 'class',
  defaultTheme: 'light',
  enableSystem: true,
  disableTransitionOnChange: false
};

const globalStyles = () => (
  <style jsx global>{`
    html {
      font-family: ${globalFont.style.fontFamily};
    }
  `}</style>
);

export type NextPageWithLayout<P = {}, IP = P> = NextPage<P, IP> & {
  getLayout?: (page: ReactElement) => ReactNode;
};

type AppPropsWithLayout = AppProps & {
  Component: NextPageWithLayout;
};

export default function App({ Component, pageProps }: AppPropsWithLayout) {
  const getLayout = Component.getLayout ?? ((page) => page); // Use the layout defined at the page level, if available

  return (
    <ThemeProvider {...settings}>
      {getLayout(
        <>
          {globalStyles()}
          <Component {...pageProps} />
          <Toaster />
        </>
      )}
    </ThemeProvider>
  );
}
