import jwt from "jsonwebtoken"

import { User } from "../models/user.model.js"
import { asyncHandler } from "../utils/asyncHandler.js"
import { ApiError } from "../utils/ApiError.js";


const auth = asyncHandler(async (req, res, next) => {

  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  if (!token) {
    throw new ApiError(401, "Token missing");
  }



  let decoded;
  try {
    decoded = jwt.verify(token, process.env.JWT_SECRET);
  } catch (error) {
    // We catch it here to ensure we send a 401, not a 500
    throw new ApiError(401, "Token is invalid or expired");
  }
  const user = await User.findById(decoded._id);
  if (!user) throw new ApiError(401, "User no longer exists")

  req.user = decoded;
  next()


})

export { auth }
