const Room = require("../models/Room.model");
const User = require("../models/user.model");
const Song = require("../models/Song.model");

const isMongoError = ({ code: errorCode }) => errorCode === 11000;

const createRoom = async (username, roomId) => {

  try {
    const room = await Room.findOne({ roomId });
    
   if(!room) {
      //nueva sala
      const { _doc: room } = await Room.create({
        roomId,
        users: [{ username }],
      });
      console.log(room);
      return room.users;
    }
  } catch (e) {
    console.log(e);
   
  }


}




const joinRoom = async (username, roomId) => {
  try {
    const room = await Room.findOne({ roomId });
    console.log(room)
    if (room && room.status !== "start") {
      //identificador de sala ya existente
      return null;
    } else if (room && room.status === "start") {
      //sala creada por el jugador anfitrión
      console.log("introduciendo nuevo player");
      const room = await Room.findOneAndUpdate(
        { roomId },
        { $push: { users: { username } } },
        { new: true }
      );
      console.log(room);
      return room.users;
    } else {
      //nueva sala
      // const { _doc: room } = await Room.create({
      //   roomId,
      //   users: [{ username }],
      // });
      // console.log(room);
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


const getSongs = async (numPlayers) => {
    try{
        const songsArray = await Song.find({});
        
        const songs = songsArray.slice(0,numPlayers);

        //console.log(songs);
        return songs;




    }catch(e){
        console.error(e);
    }



}

const addPoint = async (username, roomId) => {
  try{
      
    const room = await Room.findOne({ roomId });

    let roundWinner = room.roundWinner;

    const userUpdate = room.users.map(user =>{
      if(user.username !==username){
        return user;
      }else{
        if(!roundWinner){//no hay ganador todavía de la ronda
          user.points+=30;
          roundWinner = true;
        }else{
          user.points+=10;
        }
        return user;
      }
    })

    const roomUpdate = await Room.findOneAndUpdate(
      { roomId },
      { users: userUpdate,
        roundWinner},
      { new: true }
    );
    

    //console.log("sumado puntos: ", userUpdate);
    return roomUpdate.users;


  }catch(e){
      console.error(e);
  }

}

  const nextRound = async (roomId)=>{
    try{

      

      const roomUpdate = await Room.findOneAndUpdate(
        { roomId },
        { 
        roundWinner: false,
        $inc: {turn: 1},  },
        { new: true }
      );

      return roomUpdate.turn;

    }catch(e){
      console.error(e);
    }
  }

  const gameOver = async (roomId)=>{
    try{

      

      const {_id: gameId, users} = await Room.findOneAndUpdate(
        { roomId },
        { 
          status: "finished"   },
        { new: true }
      );

      users.forEach(async(user)=>{
        let username = user.username;
        await User.findOneAndUpdate(
          { username },
          { $push: { games: gameId} },
          { new: true })
      });

      

    }catch(e){
      console.error(e);
    }
  }

  const deleteRoom = async (roomId)=>{
    try{

      

      await Room.findOneAndDelete(
        { roomId },
      );

      

    }catch(e){
      console.error(e);
    }
  }

  const deleteUser = async (username, roomId)=>{
    try{

      const room = await Room.findOne({ roomId });

      
  
      const userUpdate = room.users.filter(user =>user.username != username);
  
      const roomUpdate = await Room.findOneAndUpdate(
        { roomId },
        { users: userUpdate,
          },
        { new: true }
      );
      
  
      //console.log("sumado puntos: ", userUpdate);
      return roomUpdate.users;

      

    }catch(e){
      console.error(e);
    }
  }




module.exports = {createRoom, joinRoom, startGame, getSongs, addPoint, nextRound, gameOver, deleteRoom, deleteUser };
