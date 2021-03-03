const { joinRoom } = require("./controllers/game.controllers");

exports.handleSockets = (io) => {
  io.on("connect", (socket) => {
    socket.on("join", ({ username, roomId }) => {
      socket.join(roomId);
      const players = joinRoom(username, roomId);

      if (!players) {
        io.to(roomId).emit("duplicatedRoom", {});
        socket.leave(roomId);
      } else {
        io.to(roomId).emit("players", { players });
      }

      //socket.emit("joinedRoom", { msg: `just joined room ${roomId}` });
    });

    //recibe un audio y lo retrasmite a todos los de la misma sala
    socket.on("newAudio", ({ sourcePlay, roomId }) => {
      io.to(roomId).emit("newAudio", { sourcePlay });
    });

    // notify users upon disconnection
    socket.on("disconnect", () => {
      socket.broadcast.emit("user disconnected", socket.id);
      //si se desconecta durante una partida un usuario, avisamos a todos
      //y se termina la partida
    });
  });
};
