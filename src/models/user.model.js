import mongoose from "mongoose";
import bcrypt from 'bcrypt'

const saltRound = 5;

const { Schema, model } = mongoose;

const userSchema = new Schema({
  fullName: {
    type: String,
    required: true,
    trim: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
    lowercase: true,
    trim: true
  },
  passwordHash: {
    type: String,
    required: [true, 'password is required']
  },
  uniqueLinkId: {
    type: String,
    required: true,
    unique: true,
    index: true
  }
}, { timestamps: true })

userSchema.pre('save', async function(next) {
  if (!this.isModified('passwordHash')) return next();
  try {
    const hash = await bcrypt.hash(this.passwordHash, saltRound)
    this.passwordHash = hash;
    next();
  } catch (err) {
    const hashingError = new Error("❌Password hashing failed during user save!")
    hashingError.cause = err;
    next(hashingError)
    // next(new Error("Password hashing failed.", { cause: err })); better framing of the whole thingn
  }
})

const User = mongoose.model('User', userSchema)

export {User}
