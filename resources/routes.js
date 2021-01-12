/*
 * Author: Samuel Lippett
 * Project: COMP3006 Coursework
 */
const jwt = require("jsonwebtoken");
const session = require("express-session");
const db = require("./db");
const authorization = require("./authorization");


async function loginUserRoute(req, res, next)
{
   authorization.authToken(req, res);
   if (req.body.user !== null)
   {
      res.redirect("/users/" + req.body.user.user_id);

   } else
   {
      res.render("home", {});
   }
   
}


async function userHomeRoute(req, res)
{

   console.log("redirected here!");
   authorization.authToken(req, res);
   if (req.body.user !== null && req.params.userid === req.body.user.user_id)
   {
      let aqz = await db.getUserContacts(req.body.user.user_id);
      console.log(aqz);
      if (!aqz || aqz.length < 1)
      {
         let contactId = await db.createChat(req.body.user.user_id);
         console.log(contactId);
         if (contactId)
         {
            console.log("new chat:");
            console.log(contactId.username);
            res.redirect("/users/" + req.body.user.user_id + "/chat/" + contactId.username);
         } else
         {
            res.status("500").send("whoops! Looks like there arent any other users!");
         }
      } else
      {
         console.log("all chats:");
         console.log(aqz);
         res.redirect("/users/" + req.body.user.user_id + "/chat/" + aqz[0].username);
      }

   } else
   {
      res.clearCookie('authcookie');
      res.redirect("/login");
   }
}


async function userChatRoute(req, res)
{
   authorization.authToken(req, res);
   console.log(req.params.userid);
   if (req.body.user !== null && req.params.userid === req.body.user.user_id)
   {
      const friend = req.params.friendusername;

      let aqz = await db.findUserByUsername(friend);
      let user = await db.findUserById(req.params.userid);

      console.log("friend" + aqz);
      console.log("user" + user.username);
      if (aqz && user)
      {
         if (user.contact_ids.includes(aqz._id))
         {
            //friends. can continue.
            let chat = await db.getChat(req.params.userid, aqz._id);
            let contacts = await db.getUserContacts(req.params.userid);
            console.log(chat);
            console.log(contacts);
            res.render("user", {"contacts": contacts, "messages": chat.messages, "currentuser": req.params.userid});
         } else
         {
            res.status("403").send("whoops! You cant talk to that person!");
         }
      } else
      {
         res.status("500");
      }
      //check user is part of chat id
      //return chat and all messages
      res.render("user", {});
   } else
   {
      res.clearCookie('authcookie');
      res.redirect("/login");
   }
}

async function returnChatMessages(req, res)
{
   authorization.authToken(req, res);
   if (req.body.user !== null && req.body.user.user_id === req.body.client_id)
   {
      const friend = req.body.contact_username;

      let aqz = await db.findUserByUsername(friend);
      let user = await db.findUserById(req.body.client_id);

      if (aqz && user)
      {
         if (user.contact_ids.includes(aqz._id))
         {
            //friends. can continue.
            let chat = await db.getChat(req.body.client_id, aqz._id);

            res.send({"messages": chat.messages, "contact_id": aqz._id});
         } else
         {
            res.status("403").send("whoops! You cant talk to that person!");
         }
      } else
      {
         res.status("500");
      }
   } else
   {
      res.status("403").send("Not Authorized!");
   }
}

async function verifyLoginUserRoute(req, res)
{
   res.clearCookie('authcookie');
   let aqz = await db.findUserByUsername(req.body.user_id);
   if (aqz)
   {
      let comp = await authorization.compareHashes(aqz.password, req.body.password);
      console.log(comp);
      if (comp)
      {
         const token = authorization.generateAccessToken({user_id: aqz._id});
         console.log("here");
         res.cookie('authcookie', token, {expiresIn: 36000, httpOnly: true});
         res.redirect("/users/" + aqz._id);
         return;
      }
   }
   res.redirect("/login");

}

async function checkUserExists(req, res)
{
   let aqz = await db.findUserByUsername(req.body.username);
   if (aqz)
   {
      res.status("200").send({username: req.body.username, exists: true});
   } else
   {
      res.status("200").send({username: req.body.username, exists: false});
   }
}

async function signupUser(req, res)
{

   let aqz = await db.findUserByUsername(req.body.user_id);
   console.log(aqz);
   if (!aqz)
   {
      const password = await authorization.hashPassword(req.body.password);
      let register = await db.registerUser(req.body.user_id, password);
      if (register)
      {
         const token = authorization.generateAccessToken({user_id: register._id});
         res.cookie('authcookie', token, {expiresIn: 36000, httpOnly: true});
         res.redirect("/users/" + register._id);
         return;
      }
   } else
   {
      res.status("401").send("User exists. Please Login instead.");
   }

}

module.exports.loginUserRoute = loginUserRoute;
module.exports.verifyLoginUserRoute = verifyLoginUserRoute;
module.exports.userHomeRoute = userHomeRoute;
module.exports.userChatRoute = userChatRoute;
module.exports.returnChatMessages = returnChatMessages;
module.exports.checkUserExists = checkUserExists;
module.exports.signupUser = signupUser;