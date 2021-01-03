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
            console.log(newchat);
         }
      }
      else
      {
         res.send(aqz);
      }

   } else
   {
      res.render("home", {});
   }
}


async function verifyLoginUserRoute(req, res)
{
   let aqz = await db.findUserByUsername(req.body.user_id);
   if (aqz)
   {
      if (aqz.password === req.body.password)
      {
         const token = authorization.generateAccessToken({user_id: aqz.id});
         return res.status(200).send(token);
      }
   }
   return res.status(500).send({error: "error verifying user"});

}

module.exports.loginUserRoute = loginUserRoute;
module.exports.verifyLoginUserRoute = verifyLoginUserRoute;
module.exports.userHomeRoute = userHomeRoute;