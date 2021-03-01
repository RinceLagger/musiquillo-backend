const { Schema, model } = require("mongoose");

const roomModel = new Schema({
  title: {
    type: String,
  },
  users: [
    {
      name: {
        type: String,
      },
    },
  ],
});

module.exports = model("room", roomModel);