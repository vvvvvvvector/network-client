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

    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        ref.current?.blur();
      } else if (e.key === 'Backspace' || e.key === 'Delete') {
        ref.current?.focus();
      }
    };

    if (commandMenuOpened) {
      document.removeEventListener('keypress', onKeyPress);
      document.removeEventListener('keydown', onKeyDown);
    } else {
      document.addEventListener('keypress', onKeyPress);
      document.addEventListener('keydown', onKeyDown);
    }

    return () => {
      document.removeEventListener('keypress', onKeyPress);
      document.removeEventListener('keydown', onKeyDown);
    };
  }, [commandMenuOpened]);

  return ref;
};
