/* 
 * Author: Samuel Lippett
 * Project: COMP3006 Coursework
 */


const mongoose = require("mongoose");


const USER = mongoose.model("USER", new mongoose.Schema({
   username: String,
   password: String,
   contact_ids: [
      {
         type: mongoose.Schema.Types.ObjectId,
         ref: "USER"
      }
   ],
   socket_id: String,
   last_active: Date
})
        );

const CHAT = mongoose.model("CHAT", new mongoose.Schema({
   users: [
      {
         type: mongoose.Schema.Types.ObjectId,
         ref: "USER"
      }
   ],
   messages: [
      {
         origin_user: {type: mongoose.Schema.Types.ObjectId, ref: "USER"},
         origin_time: {type: Date, default: Date.now},
         contents: {
            body: String,
            attachments: []
         }

      }
   ]
})
        );


//const MESSAGE = mongoose.model("MESSAGE", new mongoose.Schema({
//   origin_user: {type: mongoose.Schema.Types.ObjectId, ref: "USER"},
//   origin_time : { type : Date, default: Date.now },
//   contents: {
//      body: String,
//      attachments: []
//   }
//   
//})
//);

module.exports.USER = USER;
module.exports.CHAT = CHAT;
//module.exports.MESSAGE = MESSAGE;
