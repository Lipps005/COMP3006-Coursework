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
   try
   {
      let result = await models.USER.findOne({_id: mongoose.Types.ObjectId(id)});
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


async function findUserBySocketId(socketid)
{
   try
   {
      let result = await models.USER.findOne({socket_ids: {$in: [socketid]}});
      console.log("finding user "+result);
      if (!result)
      {
         return false;
      }
      return result;
   } catch (err)
   {
      return false;
   }

}

async function getUserContacts(id)
{
   try
   {
      const result = await models.USER.findOne({_id: mongoose.Types.ObjectId(id)}, {_id: 0, contact_ids: 1});
      console.log("contacts" + result);
      if (!result)
      {
         return false;
      }
      try
      {

         let resultContacts = await models.USER.find({_id: result.contact_ids});
         if (!resultContacts)
         {
            console.log("returning false");
            return false;
         }
         console.log("result contacts: " + resultContacts);
         return resultContacts;
      } catch (err)
      {
         console.log("returning error");
         return false;
      }
   } catch (err)
   {
      return false;
   }
   //return all chats for user.
   //if none exist, getAnonymousChat
}

async function addMessageToChat(client_id, contact_id, message)
{
   const clientid = mongoose.Types.ObjectId(client_id);
   const contactid = mongoose.Types.ObjectId(contact_id);
   try
   {
      const result = await models.CHAT.findOne({users: {$all: [clientid, contactid]}});
      if (!result)
      {
         return false;
      }
      try
      {
         await result.updateOne({$push: {messages: {
                  origin_user: clientid._id,
                  contents: {body: message}

               }}});
         return true;
      } catch (err)
      {
         return false;
      }
   } catch (err)
   {
      return false;
   }
}

async function getChat(client_id, contact_id)
{
   const clientid = mongoose.Types.ObjectId(client_id);
   const contactid = mongoose.Types.ObjectId(contact_id);
   try
   {
      let result = await models.CHAT.findOne({users: {$all: [clientid, contactid]}});
      if (!result)
      {
         return false;
      }
      return result;
   } catch (err)
   {
      return false;
   }
}

async function getAnonymousUser(id)
{
   try
   {
      const result = await getUserContacts(id);
      if (!result)
      {
         return false;
      }
      try
      {
         if (!result.contact_ids)
         {
            result.contact_ids = [];
         }
         result.contact_ids.push(mongoose.Types.ObjectId(id));

         let anonUser = await models.USER.findOne({_id: {$nin: result.contact_ids}});
         if (!anonUser)
         {
            return false;
         }
         return anonUser;
      } catch (err)
      {
         return false;
      }
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
   console.log("anon user " + anonUser.username);
   if (!anonUser)
   {
      return false;
   } else
   {

      const newChat = new models.CHAT({
         users: [mongoose.Types.ObjectId(id), mongoose.Types.ObjectId(anonUser._id)]
      });
      try
      {
         let created = await newChat.save();
         //try updating users. 
         let user1 = await models.USER.findOne({_id: mongoose.Types.ObjectId(anonUser._id)});
         await user1.updateOne({$push: {contact_ids: mongoose.Types.ObjectId(id)}});

         let user2 = await models.USER.findOne({_id: mongoose.Types.ObjectId(id)});
         await user2.updateOne({$push: {contact_ids: mongoose.Types.ObjectId(anonUser._id)}});

         return anonUser;
      } catch (err)
      {
         return false;
      }
   }
}


async function registerSocketID(clientid, socketid)
{

   try
   {
      let user1 = await models.USER.findOne({_id: mongoose.Types.ObjectId(clientid)});
      await user1.updateOne({$push: {socket_ids: socketid}});

      return user1;
   } catch (err)
   {
      console.log("might need to update models");
      return false;
   }
}


//updating a user socket will try to find the user with the old socket id and remove it
async function updateUserSocket(socketid)
{
   try
   {
      let user1 = await models.USER.findOne({socket_ids: {$in: [socketid]}});
      console.log("updating " + user1);
      user1.socket_ids.splice(user1.socket_ids.indexOf(socketid));
      let res = await user1.save();
      console.log("updating " + res);
      return res;


   } catch (err)
   {
      return false;
   }
}

module.exports.findUserByUsername = findUserByUsername;
module.exports.findUserById = findUserById;
module.exports.getUserContacts = getUserContacts;
module.exports.getAnonymousChat = getAnonymousUser;
module.exports.createChat = createChat;
module.exports.getChat = getChat;
module.exports.registerSocketID = registerSocketID;
module.exports.updateUserSocket = updateUserSocket;
module.exports.addMessageToChat = addMessageToChat;
module.exports.findUserBySocketId = findUserBySocketId;