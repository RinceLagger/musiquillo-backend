const connectDb = require("./db.config");
const mongoose = require("mongoose");

const {songs} = require("./songData");


const Song = require("../models/Song.model");


async function seedDb() {
    try {
      await connectDb();
  
      for (const song of songs) {
       
        const newSong = await Song.create(song);
        console.log(newSong);
      }
  
      mongoose.connection.close();
    } catch (e) {
      console.error(e);
    }
  }
  
  seedDb();