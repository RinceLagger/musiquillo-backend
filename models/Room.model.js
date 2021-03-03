const { Schema, model } = require("mongoose");

const RoomModel = new Schema({
  title: {
    type: String,
    require: true,
    unique: true,
  },
  users: [
    {
      username: {
        type: String,
      },
      points: {
        type: Number,
        default: 0,
      }
    },
  ],
  turn: {
    type: Number,
    default: 0,
  }
});

module.exports = model("Room", RoomModel);