import { useEffect, useState } from 'react';

import { TSocket } from '@/zustand/socket.store';

export const useConnectionsInformation = (
  socket: TSocket,
  init: {
    [username: string]: 'online' | 'offline';
  }
) => {
  const [connectionsInformation, setConnectionsInformation] = useState(init);

  useEffect(() => {
    const onUserConnection = (username: string) => {
      if (username in connectionsInformation) {
        setConnectionsInformation((rest) => ({
          ...rest,
          [username]: 'online'
        }));
      }
    };

    const onUserDisconnection = (username: string) => {
      if (username in connectionsInformation) {
        setConnectionsInformation((rest) => ({
          ...rest,
          [username]: 'offline'
        }));
      }
    };

    socket.emit(
      'which-friends-online',
      Object.keys(connectionsInformation),
      (users) => {
        setConnectionsInformation(users);
      }
    );

    socket.on('network-user-online', onUserConnection);
    socket.on('network-user-offline', onUserDisconnection);

    return () => {
      socket.off('network-user-online', onUserConnection);
      socket.off('network-user-offline', onUserConnection);
    };
  }, []);

  return connectionsInformation;
};
