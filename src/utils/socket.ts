// lib/socket.ts
import { io } from "socket.io-client";

const apiUrl = "https://learn-server-fmbt.onrender.com";
const socket = io(apiUrl, {
  transports: ["websocket"],
  autoConnect: false,
});

export const connectSocket = (): Promise<void> => {
  return new Promise((resolve) => {
    if (socket.connected) {
      return resolve(); // already connected
    }

    const userData = localStorage.getItem("user");
    const user = userData ? JSON.parse(userData) : null;

    if (user?.id) {
      socket.connect();

      socket.once("connect", () => {
        console.log("🔌 Connected with ID:", socket.id);
        socket.emit("joinRoom", user.id);
        resolve();
      });
    } else {
      resolve(); // skip connection
    }
  });
};



export default socket;
