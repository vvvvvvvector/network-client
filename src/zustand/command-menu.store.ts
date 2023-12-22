import { create } from 'zustand';

type CommandMenuState = {
  commandMenuOpened: boolean;
  toogle: () => void;
  setCommandMenuOpened: (opened: boolean) => void;
};

export const useCommandMenuStore = create<CommandMenuState>((set) => ({
  commandMenuOpened: false,
  setCommandMenuOpened: (opened: boolean) =>
    set(() => {
      return { commandMenuOpened: opened };
    }),
  toogle: () =>
    set((state) => {
      return { commandMenuOpened: !state.commandMenuOpened };
    })
}));
