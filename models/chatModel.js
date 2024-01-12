const mongoose = require("mongoose");

const chatSchema = new mongoose.Schema(
  {
    sender_id:{
        type:mongoose.Schema.ObjectId,
        ref:"User"
    },
    message:{
        type:String,
        require:true
    },
  }
);

const Chat = mongoose.model("Chat", chatSchema);
module.exports = Chat