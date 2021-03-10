const { Schema, model } = require("mongoose");

const RoomModel = new Schema({
  roomId: {
    type: Number,
    require: true,
    
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
  },
  status: { type: String, enum: ["start","playing", "finished"], default: "start" },
});

module.exports = model("Room", RoomModel);