import clientSocket from 'socket.io-client';

export const API_URL = "http://localhost:5555";
const socket = clientSocket(`${API_URL}/calc`, { transports: ['websocket', 'polling', 'flashsocket'] });

export const subscribe = (newCallback:any) => {
  socket.on("calc", (result) => {
    result = JSON.parse(result);
    newCallback(result);
  });
}