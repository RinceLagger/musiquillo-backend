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
      },
      imgUser: {
        type: String,
        trim: true,
       
      }
    },
  ],
  turn: {
    type: Number,
    default: 0,
  },
  roundWinner: {
    type: Boolean,
    default: false,
  },
  status: { type: String, enum: ["start","playing", "finished"], default: "start" },
});

module.exports = model("Room", RoomModel);