import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { Message } from "../models/messages.model.js";
import { User } from "../models/user.model.js";
import { asyncHandler } from "../utils/asyncHandler.js";
// import { GoogleGenAI } from "@google/genai";
import { Groq } from 'groq-sdk';

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
    const groq = new Groq();

    const prompt = `
        You are a strict content moderation AI. 
        Analyze the following anonymous message for severe hate speech, explicit threats, or highly toxic harassment.
        Message: "${content}"
        
        Reply ONLY with "YES" if it violates safety standards, or "NO" if it is safe.
        Do not explain.`;

    const chatCompletion = await groq.chat.completions.create({
      "messages": [
        {
          "role": "user",
          "content": prompt
        }
      ],
      "model": "llama-3.3-70b-versatile",
      "temperature": 0,
      "max_completion_tokens": 1024,
      "top_p": 1,
      "stream": false,
      "stop": null
    });

    // 2. Extract the actual text response
    const aiResponse = chatCompletion.choices[0]?.message?.content || "";

    // 3. Clean it up (remove spaces/newlines) and check
    console.log("AI Response:", aiResponse); // Debug log

    if (aiResponse.trim().toUpperCase().includes("YES")) {
      isFlagged = true;
    } else {
      isFlagged = false;
    }
  } catch (err) {
    console.log("AI Check Failed (Saving anyway):", error.message);

  }

  // try {
  //   // Initialize the client
  //   const ai = new GoogleGenAI({});

  //   // The Prompt
  //   const prompt = `
  //       You are a strict content moderation AI. 
  //       Analyze the following anonymous message for severe hate speech, explicit threats, or highly toxic harassment.
  //       Message: "${content}"

  //       Reply ONLY with "YES" if it violates safety standards, or "NO" if it is safe.
  //       Do not explain.
  //     `;

  //   // Generate Content
  //   const result = await ai.models.generateContent({
  //     model: "gemini-2.5-flash",
  //     contents: prompt,
  //   });

  //   // Extract text (New SDK way)

  //   const text = result.text ? result.text.trim().toUpperCase() : "NO";
  //   if (text.includes("YES")) {
  //     isFlagged = true;
  //   }

  // } catch (error) {
  //   console.log("AI Check Failed (Saving anyway):", error.message);
  //   // Optional: isFlagged = true; // If you want to be safe when AI fails
  // }



  console.log(isFlagged)

  if (isFlagged) {
    throw new ApiError(400, "abusive behavious🔴")
  }

  const newMessage = await Message.create({ content: content, sessionID: "anonymous", receiverID: userExist._id, isFlagged: isFlagged })

  return res.status(200).json(
    new ApiResponse(200, newMessage, "message sent successfully!!")
  )
})
export { sendMessage }
