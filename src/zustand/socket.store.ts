import { create } from 'zustand';
import io, { Socket } from 'socket.io-client';

import { DefaultEventsMap } from '@socket.io/component-emitter';

interface ListenEvents {}

interface EmitEvents {
  echo: (
    messageToServer: string,
    callback: (responseFromServer: string) => void
  ) => void;
}

type SocketState = {
  socket: Socket<DefaultEventsMap, EmitEvents> | null;
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
