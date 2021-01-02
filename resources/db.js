const models = require("./mongoose");
const mongoose = require("mongoose");

let url = "mongodb://localhost:27017/Coursework";
mongoose.connect(url, {useUnifiedTopology: true, useNewUrlParser: true}).then(() => {
    console.log("Successfully connect to MongoDB.");
  })
  .catch(err => {
    console.error("Connection error", err);
  });


async function findUserById(id)
{
   await models.User.findById(
   {
       _id: id
   }).exec((err, user) =>
   {
      if(err)
      {
         console.log(err);
         return false;
      }
      if(!user)
      {
         console.log("no user returned");
         return false;
      }
      return user;
   });
   //
   //return name (404 or 200)
}

async function findUserByUsername(username)
{
  try
  {
     let result = await models.USER.findOne({username: username});
     if(!result)
  {
     return false;
  }
  return result;
  }
  catch(err)
  {
     return false;
  }
  

   //
   //return name (404 or 200)
}

async function getUserChats(id)
{
   //Chat.find(
   //return all chats for user.
   //if none exist, getAnonymousChat
}

async function addMessageToChat(chat_id, message)
{

}

async function getChat(chat_id)
{

}

async function getAnonymousChat()
{
   //get random online user. create new chat between them, return chat id;
}

async function registerUser(username, password)
{
   
}

module.exports.findUserByUsername = findUserByUsername;
module.exports.findUserById = findUserById;