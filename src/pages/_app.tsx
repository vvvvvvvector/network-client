import { Source_Code_Pro } from 'next/font/google';
import Head from 'next/head';
import type { AppProps } from 'next/app';

import { Toaster } from '@/components/ui/toaster';

import '@/styles/globals.css';

const globalFont = Source_Code_Pro({
  subsets: ['latin'],
});

export default function App({ Component, pageProps }: AppProps) {
  return (
    <>
      <Head>
        <title>network-client</title>
      </Head>
      <main className={`${globalFont.className} main`}>
        <Component {...pageProps} />
      </main>
      <Toaster />
    </>
  );
}
