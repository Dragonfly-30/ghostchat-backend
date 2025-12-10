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

  jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
    if (err) {
      throw new ApiError(403, "token missing or invalid");
    }

    req.User = decoded;
    next()


  }

  )

})

export { auth }
