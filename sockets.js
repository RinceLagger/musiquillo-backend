const { joinRoom } = require("./controllers/game.controllers");

exports.handleSockets = (io) => {
  io.on("connect", (socket) => {
    console.log(socket.id)
    socket.on("join", async({ username, roomId }) => {
      socket.join(roomId);
      const players = await joinRoom(username, roomId)
      const rooms = io.of("/").adapter.rooms;
      console.log("rooms", rooms)

      if (!players) {
        io.to(roomId).emit("duplicatedRoom", {});
        socket.leave(roomId);
      }else if(players === "wrongCode"){
        io.to(roomId).emit("wrongCode", {});
        socket.leave(roomId);
      }
      
      else {
        console.log("players", players)
        io.to(roomId).emit("players", { players });
      }

      //
    });

    //recibe un audio y lo retrasmite a todos los de la misma sala
    socket.on("newAudio", ({ sourcePlay, roomId }) => {
      io.to(roomId).emit("newAudio", { sourcePlay });
    });

    // socket.on("message", ({ message }) => {
    //   console.log(message)
    //   socket.broadcast.emit("message", { message });
    // });

    // notify users upon disconnection
    socket.on("disconnect", () => {
      socket.broadcast.emit("user disconnected", socket.id);
      //si se desconecta durante una partida un usuario, avisamos a todos
      //y se termina la partida
    });
  });
};
