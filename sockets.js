const {
  joinRoom,
  startGame,
  getSongs,
  addPoint,
  nextRound,
  gameOver
} = require("./controllers/game.controllers");

exports.handleSockets = (io) => {
  io.on("connect", (socket) => {
    console.log(socket.id);
    socket.on("join", async ({ username, roomId }) => {
      socket.join(roomId);
      const players = await joinRoom(username, roomId);
      const rooms = io.of("/").adapter.rooms;
      console.log("rooms", rooms);

      if (!players) {
        io.to(roomId).emit("duplicatedRoom", {});
        socket.leave(roomId);
      } else if (players === "wrongCode") {
        io.to(roomId).emit("wrongCode", {});
        socket.leave(roomId);
      } else {
        console.log("players", players);
        io.to(roomId).emit("players", { players });
      }

      //
    });

    socket.on("start", async ({ username, roomId, players }) => {
      const turn = await startGame(roomId);
      const songs = await getSongs(players);
      io.to(roomId).emit("start", { turn, songs });
    });

    //recibe un audio y lo retrasmite a todos los de la misma sala
    socket.on("newAudio", ({ blob, roomId }) => {
      console.log(blob)
      io.to(roomId).emit("newAudio", { blob });
      setTimeout(() => {
        io.to(roomId).emit("timeOver", {});
      }, 30000);
    });

    socket.on("point", async ({ username, roomId }) => {
      const players = await addPoint(username, roomId);
      console.log("sumar punto", players);
      io.to(roomId).emit("updatePoints", { players });
    });

    socket.on("nextRound", async ({  roomId, numPlayers }) => {

      const turno = await nextRound(roomId);
      if(turno<numPlayers){//aún no se ha acabado la partida, 1 turno por jugador
        
        setTimeout(() => {
          io.to(roomId).emit("nextRound", {turno});
        }, 10000);
      }else{
        console.log("juego terminado")
        gameOver(roomId);
        setTimeout(() => {
          io.to(roomId).emit("showWinner", {});
        }, 10000);
      }


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
