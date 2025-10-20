import { io } from "socket.io-client";

const API_URL = import.meta.env.VITE_API_URL;

const socketfrontend = io(API_URL, {
  transports: ["websocket"],
  autoConnect: true,
});

export default socketfrontend;
