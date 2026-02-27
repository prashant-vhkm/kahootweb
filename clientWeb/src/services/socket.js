import { io } from "socket.io-client";

export const socket = io("https://kahoot-server-w9v0.onrender.com", {
  transports: ["websocket"],
});
