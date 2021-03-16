const socketio = require("socket.io");
const { handleSockets } = require("./sockets");
require("dotenv").config();
const express = require("express");
const app = express();
const AuthRouter = require('./routes/auth.routes')
require("./config/db.config")();

require("./config/session.config")(app);
require("./config/middleware.config")(app);

app.use("/",AuthRouter)

const listener = app.listen(process.env.PORT, () => {
  console.log(`connected to server escuchando puerto ${process.env.PORT}`);
});

const io = socketio(listener, {
  cors: {
    origin: process.env.ORIGIN,
  },
});
handleSockets(io);
