const { Schema, model } = require("mongoose");

const SongModel = new Schema({
    name: String,
    hiddenName: String,
  },);

  
module.exports = model("Song", SongModel);