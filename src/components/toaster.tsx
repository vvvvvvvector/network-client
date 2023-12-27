import { useTheme } from 'next-themes';
import { Toaster as AmazingSonnerToaster } from 'sonner';

interface Props {
  fontFamily?: string;
}

export const Toaster = ({ fontFamily }: Props) => {
  const { theme } = useTheme() as {
    theme: 'light' | 'dark' | 'system' | undefined;
  };

  return (
    <AmazingSonnerToaster
      richColors
      closeButton
      theme={theme}
      style={{
        fontFamily
      }}
    />
  );
};
