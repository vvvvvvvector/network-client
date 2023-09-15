import { Inter } from 'next/font/google';
import Head from 'next/head';

import type { AppProps } from 'next/app';

import '@/styles/globals.scss';

const inter = Inter({
  subsets: ['latin'],
});

export default function App({ Component, pageProps }: AppProps) {
  return (
    <>
      <Head>
        <title>network-client</title>
      </Head>
      <main className={`${inter.className}`}>
        <Component {...pageProps} />
      </main>
    </>
  );
}
