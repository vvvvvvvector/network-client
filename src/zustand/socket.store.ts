import { create } from 'zustand';
import io, { Socket } from 'socket.io-client';

import { Message } from '@/lib/types';

type ListenEvents = {
  typing: () => void;
  'typing-stop': () => void;
  'receive-private-message': (message: Message) => void;
  'network-user-online': (username: string) => void;
  'network-user-offline': (username: string) => void;
};

type EmitEvents = {
  typing: (data: { to: string }) => void;
  'typing-stop': (data: { to: string }) => void;
  'is-friend-online': (username: string, cb: (online: boolean) => void) => void;
  'send-private-message': (
    message: {
      chatId: string;
      content: string;
      receiver: string;
    },
    cb: (responseFromServer: Message) => void
  ) => void;
  'which-friends-online': (
    users: string[],
    cb: (connectionsInformation: {
      [username: string]: 'online' | 'offline';
    }) => void
  ) => void;
};

export type TSocket = Socket<ListenEvents, EmitEvents>;

type SocketState = {
  socket: TSocket;
  connect: (token: string) => void;
  disconnect: () => void;
};

export const useSocketStore = create<SocketState>((set) => ({
  socket: io('http://localhost:5120', {
    autoConnect: false
  }),
  connect: (token: string) =>
    set((state) => {
      const socket = state.socket;

      socket.auth = { token };

      socket.connect();

      return { socket };
    }),
  disconnect: () =>
    set((state) => {
      const socket = state.socket;

      socket.disconnect();

      return { socket };
    })
}));
