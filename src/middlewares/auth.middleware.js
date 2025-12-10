import jwt from "jsonwebtoken"

import { User } from "../models/user.model.js"
import { asyncHandler } from "../utils/asyncHandler.js"



const auth = asyncHandler(async (req, res, next) => {

  const authHeader = req.headers.authorization || '';
    
  
})


