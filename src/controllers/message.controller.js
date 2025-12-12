import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { Message } from "../models/messages.model.js";
import { User } from "../models/user.model.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { GoogleGenAI } from "@google/genai";

const sendMessage = asyncHandler(async (req, res) => {


  const { content } = req.body;

  const { uniqueLinkId } = req.params;

  if (!content || content == '') {
    throw new ApiError(400, "Content is required!");
  }
  if (!uniqueLinkId) {
    throw new ApiError(400, "uniqueLinkId is missing!")
  }

  const userExist = await User.findOne({ uniqueLinkId })

  if (!userExist) {
    throw new ApiError(404, "User does not exist!")
  }

  let isFlagged;

  try {
    // Initialize the client
    const ai = new GoogleGenAI({});

    // The Prompt
    const prompt = `
        You are a strict content moderation AI. 
        Analyze the following anonymous message for severe hate speech, explicit threats, or highly toxic harassment.
        Message: "${content}"
        
        Reply ONLY with "YES" if it violates safety standards, or "NO" if it is safe.
        Do not explain.
      `;

    // Generate Content
    const result = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: prompt,
    });

    // Extract text (New SDK way)

    const text = result.text ? result.text.trim().toUpperCase() : "NO";
    if (text.includes("YES")) {
      isFlagged = true;
    }

  } catch (error) {
    console.log("AI Check Failed (Saving anyway):", error.message);
    // Optional: isFlagged = true; // If you want to be safe when AI fails
  }


  console.log(isFlagged)

  if(isFlagged){
    throw new ApiError(400, "abusive behavious🔴")
  }
  
  const newMessage = await Message.create({ content: content, sessionID: "anonymous", receiverID: userExist._id, isFlagged: isFlagged })

  return res.status(200).json(
    new ApiResponse(200, newMessage, "message sent successfully!!")
  )
})
export { sendMessage }
