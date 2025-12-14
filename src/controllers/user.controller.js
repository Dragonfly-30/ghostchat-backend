import { ApiError } from "../utils/ApiError.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { User } from "../models/user.model.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { validationResult } from "express-validator";

const registerUser = asyncHandler(async (req, res) => {
  // const fullName = req.body.fullName;
  // const email = req.body.email;
  // const password = req.body.passwordHash;
  //
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    // If validation fails, return 400 Bad Request with the specific error
    return res.status(400).json({ errors: errors.array() });
  }

  const { fullName, email, password } = req.body;


  const userExist = await User.findOne({ email });

  if (userExist) {
    throw new ApiError(409, "User already exists!")
  }


  const cleanName = fullName.toLowerCase().replace(/\s+/g, ''); // Remove spaces
  const randomString = Math.random().toString(36).substring(2, 7); // Random junk
  const uniqueLinkId = `${cleanName}-${randomString}`;

  const newUser = await User.create({ fullName, email, passwordHash: password, uniqueLinkId })

  const createdUser = await User.findById(newUser._id).select("-passwordHash");

  if (!createdUser) {
    throw new ApiError(500, "something went wrong while registering user!")
  }

  return res.status(200).json(
    new ApiResponse(200, newUser, "User created successfully!")
  )

})

export { registerUser }
