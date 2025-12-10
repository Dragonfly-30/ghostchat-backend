import mongoose, { Schema, model } from "mongoose";


const messageSchema = new Schema({
  receiverID: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  sessionID: {
    type: String,
    required: true,
  },
  content: {
    type: String,
    required: true,
    trim: true
  },
  isFlagged: {
    type: Boolean, // this is for ai if it flags the message
    default: false
  },
  isBlocked: {
    type: Boolean, //this is for if it blocks the message
    default: false
  },
  metadata: {
    userAgent: {
      type: String,
    },
    ipHash: {
      type: String,
    }
  }

}, { timestamps: true })



const Message = mongoose.model('Message', messageSchema)

export {Message}


