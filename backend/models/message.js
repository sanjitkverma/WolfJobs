const mongoose = require("mongoose");

const messageSchema = new mongoose.Schema({
  fromUser: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    ref: "User"
  },
  toUser: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    ref: "User"
  },
  message: {
    type: String,
    required: true,
  },
  applicationId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Application",
    required: true
  },
}, {
  timestamps: true // Enables createdAt and updatedAt fields
});

const Message = mongoose.model("Message", messageSchema);

module.exports = Message;
