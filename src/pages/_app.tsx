import type { ReactElement, ReactNode } from 'react';
import type { NextPage } from 'next';
import type { AppProps } from 'next/app';
import { Source_Code_Pro } from 'next/font/google';

import { Toaster } from '@/components/ui/toaster';
import { ThemeProvider } from '@/components/theme-provider';

import '@/styles/globals.css';

const globalFont = Source_Code_Pro({
  subsets: ['latin']
});

export type NextPageWithLayout<P = {}, IP = P> = NextPage<P, IP> & {
  getLayout?: (page: ReactElement) => ReactNode;
};

type AppPropsWithLayout = AppProps & {
  Component: NextPageWithLayout;
};

export default function App({ Component, pageProps }: AppPropsWithLayout) {
  const getLayout = Component.getLayout ?? ((page) => page); // Use the layout defined at the page level, if available

  return (
    <ThemeProvider
      attribute='class'
      defaultTheme='light'
      enableSystem
      disableTransitionOnChange
    >
      {getLayout(
        <>
          <style jsx global>{`
            html {
              font-family: ${globalFont.style.fontFamily};
            }
          `}</style>
          <Component {...pageProps} />
          <Toaster />
        </>
      )}
    </ThemeProvider>
  );
}
