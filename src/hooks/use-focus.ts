import { useRef, useEffect } from 'react';

export const useFocus = <
  T extends HTMLTextAreaElement | HTMLInputElement
>() => {
  const ref = useRef<T>(null);

  useEffect(() => {
    const onKeyPress = () => {
      ref.current?.focus();
    };

    document.addEventListener('keypress', onKeyPress);

    return () => {
      document.removeEventListener('keypress', onKeyPress);
    };
  }, []);

  return ref;
};
