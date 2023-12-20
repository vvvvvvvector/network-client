import { FC } from 'react';
import { useTheme } from 'next-themes';
import { Toaster as SuperCoolSonnerToaster } from 'sonner';

interface Props {
  fontFamily?: string;
}

export const Toaster: FC<Props> = ({ fontFamily }) => {
  const { theme } = useTheme() as {
    theme: 'light' | 'dark' | 'system' | undefined;
  };

  return (
    <SuperCoolSonnerToaster
      richColors
      closeButton
      theme={theme}
      style={{
        fontFamily
      }}
    />
  );
};
