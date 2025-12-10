import jwt from "jsonwebtoken"
import bcrypt from "bcrypt"
import { asyncHandler } from "../utils/asyncHandler.js"
import { ApiError } from "../utils/ApiError.js"
import { User } from "../models/user.model.js"
import { ApiResponse } from "../utils/ApiResponse.js"


const loginUser = asyncHandler(async (req, res) => {
  const { email, password } = req.body;
  const userExist = await User.findOne({ email });
  if (!userExist) {
    throw new ApiError(404, "User doesn't Exists!")
  }

  const passwordMatch = await bcrypt.compare(password, userExist.passwordHash)

  if (!passwordMatch) {
    throw new ApiError(400, "Wrong password!")
  }

  const token = jwt.sign({ _id: userExist._id, email: userExist.email }, process.env.JWT_SECRET || "fallback-secret", { expiresIn: '1h' });
  // res.json({ message: 'Login successful', token });
  //
  const loggedInUser = await User.findById(userExist._id).select("-passwordHash");

  // Option A: Send Token in Body (Simplest for Curl/Postman)
  return res.status(200).json(
    new ApiResponse(200, { user: loggedInUser, token }, "Login successful")
  );
})

export { loginUser }
