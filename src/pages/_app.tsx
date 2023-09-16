import type { ReactElement, ReactNode } from 'react';
import type { NextPage } from 'next';
import type { AppProps } from 'next/app';

import { Toaster } from '@/components/ui/toaster';

import '@/styles/globals.css';

import { Source_Code_Pro } from 'next/font/google';

const globalFont = Source_Code_Pro({
  subsets: ['latin'],
});

export type NextPageWithLayout<P = {}, IP = P> = NextPage<P, IP> & {
  getLayout?: (page: ReactElement) => ReactNode;
};

type AppPropsWithLayout = AppProps & {
  Component: NextPageWithLayout;
};

export default function App({ Component, pageProps }: AppPropsWithLayout) {
  const getLayout = Component.getLayout ?? ((page) => page); // Use the layout defined at the page level, if available

  return getLayout(
    <>
      <style jsx global>{`
        html {
          font-family: ${globalFont.style.fontFamily};
        }
      `}</style>
      <Component {...pageProps} />
      <Toaster />
    </>
  );
}
