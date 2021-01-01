/* 
 * Author: Samuel Lippett
 * Project: COMP3006 Coursework
 */


const mongoose = require("mongoose");


const User = mongoose.model("User", new mongoose.Schema({
    username: String,
    password: String,
    chat_ids: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref : "Chat"
      }
    ],
    last_active: Date
  })
);

const Chat = mongoose.model("Chat", new mongoose.Schema({
   users: [
      {
         type: mongoose.Schema.Types.ObjectId,
         ref: "User"
      }
   ],
   messages: [
      {
         type: mongoose.Schema.Types.ObjectId,
         ref: "Message"
      }
   ]
})
);


const Message = mongoose.model("Message", new mongoose.Schema({
   origin_user: {type: mongoose.Schema.Types.ObjectId, ref: "User"},
   origin_time : { type : Date, default: Date.now },
   contents: {
      body: String,
      attachments: []
   }
   
})
);

module.exports = User;
module.exports = Chat;
module.exports = Message;
