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
  games: [{ type: Schema.Types.ObjectId, ref: "Room" }],
});

module.exports = mongoose.model("User", UserSchema);