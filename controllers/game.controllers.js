const Room = require("../models/Room.model");
const User = require("../models/user.model");


const isMongoError = ({ code: errorCode }) => errorCode === 11000;


const joinRoom = async(username, roomId)=>{
    try{
        const room = await Room.findOne({roomId});

    if(room && room.status!=="start"){
        //identificador de sala ya existente
        return null;
    }
    else if(room && room.status==="start"){
        //sala creada por el jugador anfitrión
        console.log("introduciendo nuevo player")
        const room = await Room.findOneAndUpdate({roomId}, {$push: {users: {username}} }, {new: true});
        console.log(room)
        return room.users;
    }
    else{
        //nueva sala
        const {
            _doc: room
          } = await Room.create({roomId,users:[{username}]});
          console.log(room)
          return room.users;
    }
    }catch(e){
        console.log(e)
        if(isMongoError(e)) return "wrongCode";
        
    }
    

}

module.exports = {joinRoom};