import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { Message } from "../models/messages.model.js";
import { User } from "../models/user.model.js";
import { asyncHandler } from "../utils/asyncHandler.js";


const sendMessage = asyncHandler (async (req, res)=>{

  const {content} = req.body;

  const {uniqueLinkId} = req.params;

  if(!content || content == ''){
     throw new ApiError(400, "Content is required!");
  }
  if(!uniqueLinkId){
    throw new ApiError(400, "uniqueLinkId is missing!")
  }

  const userExist = await User.findOne({uniqueLinkId})

  if(!userExist){
      throw new ApiError(404, "User does not exist!")
  }

  const newMessage = await Message.create({content: content, sessionID: "anonymous", receiverID: userExist._id})

  return res.status(200).json(
    new ApiResponse(200, newMessage, "message sent successfully!!")
  )
})
export {sendMessage}
