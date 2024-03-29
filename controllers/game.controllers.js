const Room = require("../models/Room.model");
const User = require("../models/user.model");
const Song = require("../models/Song.model");

const isMongoError = ({ code: errorCode }) => errorCode === 11000;

const createRoom = async (username, roomId, img) => {
  try {
    const room = await Room.findOne({ roomId });
    console.log("imagen", img);
    if (!room) {
      //nueva sala
      const { _doc: room } = await Room.create({
        roomId,
        users: [{ username, imgUser: img }],
      });
      console.log(room);
      return room.users;
    }
  } catch (e) {
    console.log(e);
  }
};

const joinRoom = async (username, roomId, img) => {
  try {
    console.log("imagen", img);
    if (Number.isNaN(parseInt(roomId, 10))) {
      return "wrongCode";
    }
    const room = await Room.findOne({ roomId });

    console.log("num players",room.users.length);
    if (room && room.status !== "start") {
      //identificador de sala ya existente
      return null;
    } else if (room.users.length > 5) {
      //max 6 jugadores por juego
      
      return "roomFull";
    } else if (room && room.status === "start") {
      //sala creada por el jugador anfitrión
      
      const room = await Room.findOneAndUpdate(
        { roomId },
        { $push: { users: { username, imgUser: img } } },
        { new: true }
      );
      console.log(room);
      return room.users;
    } else {
      return "wrongCode";
    }
  } catch (e) {
    console.log(e);
    if (isMongoError(e)) return "wrongCode";
  }
};

const startGame = async (roomId) => {
  try {
    console.log("pasamos room a status playing");
    const room = await Room.findOneAndUpdate(
      { roomId },
      { status: "playing" },
      { new: true }
    );
    return room.turn;
  } catch (e) {
    console.error(e);
  }
};

function shuffle(a) {
  var j, x, i;
  for (i = a.length - 1; i > 0; i--) {
    j = Math.floor(Math.random() * (i + 1));
    x = a[i];
    a[i] = a[j];
    a[j] = x;
  }
}

const getSongs = async (numPlayers) => {
  try {
    const songsArray = await Song.find({});

    shuffle(songsArray);

    const songs = songsArray.slice(0, numPlayers);

    return songs;
  } catch (e) {
    console.error(e);
  }
};

const addPoint = async (username, roomId, turn) => {
  try {
    const room = await Room.findOne({ roomId });

    let roundWinner = room.roundWinner;

    const userUpdate = room.users.map((user) => {
      if (user.username !== username) {
        return user;
      } else {
        if (!roundWinner) {
          //no hay ganador todavía de la ronda
          user.points += 30;
          roundWinner = true;
        } else {
          user.points += 10;
        }
        return user;
      }
    });

    //cada vez que alguien acierta se premia al cantante
    userUpdate[turn].points += 5;

    const roomUpdate = await Room.findOneAndUpdate(
      { roomId },
      { users: userUpdate, roundWinner },
      { new: true }
    );

    return roomUpdate.users;
  } catch (e) {
    console.error(e);
  }
};

const nextRound = async (roomId) => {
  try {
    const roomUpdate = await Room.findOneAndUpdate(
      { roomId },
      {
        roundWinner: false,
        $inc: { turn: 1 },
      },
      { new: true }
    );

    return roomUpdate.turn;
  } catch (e) {
    console.error(e);
  }
};

const gameOver = async (roomId) => {
  try {
    const { _id: gameId, users } = await Room.findOneAndUpdate(
      { roomId },
      {
        status: "finished",
      },
      { new: true }
    );

    users.forEach(async (user) => {
      let username = user.username;
      await User.findOneAndUpdate(
        { username },
        { $push: { games: gameId } },
        { new: true }
      );
    });
  } catch (e) {
    console.error(e);
  }
};

const deleteRoom = async (roomId) => {
  try {
    await Room.findOneAndDelete({ roomId });
  } catch (e) {
    console.error(e);
  }
};

const deleteUser = async (username, roomId) => {
  try {
    const room = await Room.findOne({ roomId });

    const userUpdate = room.users.filter((user) => user.username != username);

    const roomUpdate = await Room.findOneAndUpdate(
      { roomId },
      { users: userUpdate },
      { new: true }
    );

    return roomUpdate.users;
  } catch (e) {
    console.error(e);
  }
};

module.exports = {
  createRoom,
  joinRoom,
  startGame,
  getSongs,
  addPoint,
  nextRound,
  gameOver,
  deleteRoom,
  deleteUser,
};
