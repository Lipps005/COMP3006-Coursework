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
   if (req.body.user !== null)
   {
      let aqz = await db.getUserChats(req.body.user.user_id);
      console.log(aqz);
      if (!aqz || aqz.length < 1)
      {
         let newchat = await db.createChat(req.body.user.user_id);
         if(newchat)
         {
            console.log("new chat:");
            console.log( newchat._id);
            req.app.set("chats", newchat);
            res.redirect("/users/"+req.body.user.user_id+"/chat/"+newchat._id);
         }
      }
      else
      {
         console.log("all chats:");
         console.log(aqz);
         req.app.set("chats", aqz);
         res.redirect("/users/"+req.body.user.user_id+"/chat/"+aqz[0]._id);
      }

   } else
   {
      res.redirect("/login");
      res.render("home", {});
   }
}


async function userChatRoute(req, res)
{
      authorization.authToken(req, res);
   if (req.body.user !== null)
   {
      res.render("user", {chats: req.app.get("chats")});

   } else
   {
      res.redirect("/login");
   }
   
}

async function verifyLoginUserRoute(req, res)
{
   res.clearCookie('authcookie');
   let aqz = await db.findUserByUsername(req.body.user_id);
   if (aqz)
   {
      console.log("here");
      if (aqz.password === req.body.password)
      {
         const token = authorization.generateAccessToken({user_id: aqz._id});
         console.log("here");
         res.cookie('authcookie',token,{expiresIn:36000,httpOnly:true});
         res.redirect("/users/" + aqz._id);
         return;
      }
   }
   res.status(500).redirect("/login");

}

module.exports.loginUserRoute = loginUserRoute;
module.exports.verifyLoginUserRoute = verifyLoginUserRoute;
module.exports.userHomeRoute = userHomeRoute;
module.exports.userChatRoute = userChatRoute;