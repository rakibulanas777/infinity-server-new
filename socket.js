const io = require("socket.io");

let socketIo;

module.exports = {
  init: (httpServer) => {
    socketIo = io(httpServer);
    return socketIo;
  },
  getIO: () => {
    if (!socketIo) {
      throw new Error("Socket.io not initialized");
    }
    return socketIo;
  },
};
