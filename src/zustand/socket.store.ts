import { create } from 'zustand';

import io, { Socket } from 'socket.io-client';

type SocketState = {
  socket: Socket | null;
  connect: (token: string) => void;
  disconnect: () => void;
};

export const useSocketStore = create<SocketState>((set) => ({
  socket: null,
  connect: (token: string) =>
    set(() => {
      const socket = io('http://localhost:5120', {
        autoConnect: false,
        auth: {
          token
        }
      });

      socket.connect();

      return { socket };
    }),
  disconnect: () =>
    set((state) => {
      const socket = state.socket;

      if (socket) {
        socket.disconnect();
      }

      return { socket: null };
    })
}));
