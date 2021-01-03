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

   //
   //return name (404 or 200)
}

async function findUserByUsername(username)
{
   try
   {
      let result = await models.USER.findOne({username: username});
      if (!result)
      {
         return false;
      }
      return result;
   } catch (err)
   {
      return false;
   }


   //
   //return name (404 or 200)
}

async function getUserChats(id)
{
   try
   {
      let result = await models.CHAT.find({users: mongoose.Types.ObjectId(id)});
      if (!result)
      {
         return false;
      }
      return result;
   } catch (err)
   {
      return false;
   }
   //return all chats for user.
   //if none exist, getAnonymousChat
}

async function addMessageToChat(chat_id, message)
{

}

async function getChat(chat_id)
{

}

async function getAnonymousUser(id)
{
   try
   {
      let result = await models.USER.findOne({_id: {$ne: mongoose.Types.ObjectId(id)}}, { _id: 1 });
      console.log(result);
      if (!result)
      {
         return false;
      }
      return result;
   } catch (err)
   {
      return false;
   }
   //get random online user. create new chat between them, return chat id;
}

async function registerUser(username, password)
{

}


async function createChat(id)
{
   
   let anonUser = await getAnonymousUser(id);
   if(!anonUser)
   {
      return false;
   }
   else
   {
      
      const newChat = new models.CHAT({
         users: [mongoose.Types.ObjectId(id), mongoose.Types.ObjectId(anonUser._id)]
      });
      try
      {
         let created = await newChat.save();
         //try updating users. 
         
         return created;
      }catch(err)
      {
         return false;
      }
   }
}

module.exports.findUserByUsername = findUserByUsername;
module.exports.findUserById = findUserById;
module.exports.getUserChats = getUserChats;
module.exports.getAnonymousChat = getAnonymousUser;
module.exports.createChat = createChat;