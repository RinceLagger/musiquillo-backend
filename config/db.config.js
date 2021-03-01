require("dotenv").config();
const mongoose = require('mongoose');

const dbOptions = {
  useCreateIndex: true,
  useNewUrlParser: true,
  useUnifiedTopology: true,
};

const connectDb = async (drop) =>{
  try{
  const self = await mongoose.connect(process.env.MONGODB_URI, dbOptions);
  if(drop)await self.connection.dropDatabase();
  
  console.log("connected to DB");
  
  
  }catch(err){
    console.error(err);
  }


}

module.exports = connectDb; 