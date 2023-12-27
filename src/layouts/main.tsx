import { type PropsWithChildren } from 'react';
import Head from 'next/head';

interface MainProps {
  title?: string;
}

export const Main = ({ title, children }: PropsWithChildren<MainProps>) => {
  return (
    <>
      <Head>
        <title>{title}</title>
      </Head>
      {children}
    </>
  );
};
