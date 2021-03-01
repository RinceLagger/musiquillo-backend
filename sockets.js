const Room = require("./models/Room.model");

exports.handleSockets = (io) => {
  io.on("connect", (socket) => {
    socket.on("join", ({ roomId }) => {
      socket
        .join(roomId)
        .emit("joinedRoom", { msg: `just joined room ${roomId}` });
    });

    socket.on("newAudio", ({ blob, roomId }) => {
      
        io.to(roomId).emit("newAudio", { blob });
    });
  });
};