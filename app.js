const socketio = require("socket.io");
const { handleSockets } = require("./sockets");
require("dotenv").config();
const express = require("express");
const app = express();

require("./config/db.config")(app);
require("./config/middleware.config")(app);
require("./config/session.config");

const listener = app.listen(process.env.PORT, () => {
  console.log(`connected to server escuchando puerto ${process.env.PORT}`);
});

const io = socketio(listener, {
  cors: {
    origin: "*",
  },
});
handleSockets(io);
