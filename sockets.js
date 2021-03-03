const Room = require("./models/Room.model");

exports.handleSockets = (io) => {
  io.on("connect", (socket) => {
    socket.on("join", ({ roomId }) => {
      socket.join(roomId);
      socket.emit("joinedRoom", { msg: `just joined room ${roomId}` });
    });

    socket.on("newAudio", ({ sourcePlay, roomId }) => {
      io.to(roomId).emit("newAudio", { sourcePlay });
    });

    // notify users upon disconnection
    socket.on("disconnect", () => {
      socket.broadcast.emit("user disconnected", socket.id);
    });
  });
};
