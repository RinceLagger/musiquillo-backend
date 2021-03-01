require("dotenv").config();
const express = require("express");
const app = express();
const bodyParser = require("body-parser");
const connectDb = require("./config/db.config");
const cors = require("cors");
const socketio = require("socket.io");
const { json } = express;
const morgan = require("morgan");
const { handleSockets } = require("./sockets");
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static(`${__dirname}/public`));
app.use(cors());
app.use(json());
app.use(morgan("dev"));

connectDb();

const start = () => {
    try {
      
      const listener = app.listen(process.env.PORT, () => {
        console.log(`connected to server`);
      });
      const io = socketio(listener);
      handleSockets(io);
    } catch (e) {
      console.error(e);
    }
  };
  
  start();