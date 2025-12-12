import { ApiError } from "../utils/ApiError.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { Message } from "../models/messages.model.js";


const readMessage = asyncHandler(async (req, res) => {
  const myId = req.user._id;

  const messages = await Message.find({ receiverID: myId }).sort({ createdAt: 1 });

  return res.status(200).json(
    new ApiResponse(200, { data: messages }, "Messages fetched successfully✅")
  );

})

export { readMessage }
