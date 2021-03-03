const Room = require("../models/Room.model");
const User = require("../models/user.model");


const joinRoom = async(username, roomId)=>{

    const room = await Room.findOne({roomId});

    if(room && room.status!=="start"){
        //identificador de sala ya existente
        return null;
    }
    else if(room && room.status==="start"){
        //sala creada por el jugador anfitrión
        const room = await Room.findOneAndUpdate({roomId}, {$push: {users: username} }, {new: true});
        return room.users;
    }
    else{
        //nueva sala
        const {
            _doc: room
          } = await Room.create({roomId,users:[{username}]});
          return room.users;
    }

}

module.exports = {joinRoom};