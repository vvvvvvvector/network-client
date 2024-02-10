import type { Viewport } from 'next';
import { Source_Code_Pro } from 'next/font/google';

import { ThemeProvider } from '@/components/providers/theme-provider';
import { Toaster } from '@/components/toaster';

import { cn } from '@/lib/utils';

import '@/styles/globals.css';

const globalFont = Source_Code_Pro({
  subsets: ['latin']
});

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  userScalable: false
};

export default function RootLayout({
  children
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang='en'>
      <body className={cn(`${globalFont.className}`)}>
        <ThemeProvider>
          {children}
          <Toaster fontFamily={globalFont.style.fontFamily} />
        </ThemeProvider>
      </body>
    </html>
  );
}
