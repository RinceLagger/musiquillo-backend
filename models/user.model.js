const mongoose = require("mongoose");

const UserSchema = new mongoose.Schema({
  username: {
    type: String,
    require: true,
    unique: true,
  },
  email: {
    type: String,
    require: true,
    unique: true,
  },
  hashedPassword: {
    type: String,
    require: true,
  },
  imgUser: {
    type: String,
    trim: true,
   
  },
  games: [{ type: mongoose.Schema.Types.ObjectId, ref: "Room" }],
});

module.exports = mongoose.model("User", UserSchema);
