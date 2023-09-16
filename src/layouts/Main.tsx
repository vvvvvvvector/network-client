import { FC, PropsWithChildren } from 'react';

import Head from 'next/head';

interface MainProps {
  title?: string;
}

export const Main: FC<PropsWithChildren<MainProps>> = ({ title, children }) => {
  return (
    <>
      <Head>
        <title>{title}</title>
      </Head>
      {children}
    </>
  );
};
