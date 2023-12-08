import { create } from 'zustand';
import io, { Socket } from 'socket.io-client';

import { Message } from '@/lib/types';

interface ListenEvents {
  'receive-message': (message: Message) => void;
  'user-connected': (username: string) => void;
  'user-disconnected': (username: string) => void;
}

interface EmitEvents {
  'send-message': (
    message: {
      chatId: string;
      content: string;
      receiver: string;
    },
    cb: (responseFromServer: Message) => void
  ) => void;
  'is-friend-online': (username: string, cb: (online: boolean) => void) => void;
}

export type SocketType = Socket<ListenEvents, EmitEvents>;

type SocketState = {
  socket: SocketType | null;
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
