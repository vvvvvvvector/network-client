import { useRef, useEffect } from 'react';

import { useCommandMenuStore } from '@/zustand/command-menu.store';

export const useFocus = <
  T extends HTMLTextAreaElement | HTMLInputElement
>() => {
  const { commandMenuOpened } = useCommandMenuStore();

  const ref = useRef<T>(null);

  useEffect(() => {
    const onKeyPress = () => {
      ref.current?.focus();
    };

    if (commandMenuOpened) {
      document.removeEventListener('keypress', onKeyPress);
    } else {
      document.addEventListener('keypress', onKeyPress);
    }

    return () => document.removeEventListener('keypress', onKeyPress);
  }, [commandMenuOpened]);

  return ref;
};
