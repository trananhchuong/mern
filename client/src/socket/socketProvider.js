import React, { createContext, useContext, useEffect, useState } from 'react';
import io from 'socket.io-client';
import { URL } from '../api';


export const socketContext = createContext();

export const SocketProvider = ({children}) => {
  const [socket, _] = useState(() => {
    return io(URL, {
      reconnection: false, 
      path: "/appsocket",
      transports: ['websocket'],
      rejectUnauthorized: false,
      secure: true
    });
    
  });
  useEffect(() => {
    return function cleanup() {
      socket.close();
    }
  }, []);

  return (
    <socketContext.Provider value={socket}>
      {children}
    </socketContext.Provider>
  )
}

export const useSocket = (setEvent, removeEvent) => {
  const socket = useContext(socketContext);
  useEffect(() => {
    if(typeof setEvent == 'function'){
      setEvent(socket);
      return () => {
        if(typeof removeEvent == 'function'){
          removeEvent(socket);
        }
        
      }
    }
    
  }, []);

  return socket;
}