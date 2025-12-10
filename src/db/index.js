import mongoose from "mongoose";
import { DB_NAME } from '../constants.js'



const connectDB = async ()=>{
  try{
     const connectionInstance =await mongoose.connect(`${process.env.MONGO_URI}/${DB_NAME}`)
     console.log(`✅DB connection established successfull, ${connectionInstance.connection.host}`)
  }catch(err){
    console.log(`❌DB connection failed: ${err}`)
    process.exit(1)
  }
}

export {connectDB}

// const connectDB = mongoose.connect(`${process.env.MONGO_URI}/${DB_NAME}`)
