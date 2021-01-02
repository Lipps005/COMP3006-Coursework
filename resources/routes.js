/*
 * Author: Samuel Lippett
 * Project: COMP3006 Coursework
 */
const jwt = require("jsonwebtoken");
const db = require("./db");
const authorization = require("./authorization");




async function loginUserRoute(req, res)
{

}



async function verifyLoginUserRoute(req, res)
{
   let aqz = await db.findUserByUsername(req.body.user_id);
   if (aqz)
   {
      if (aqz.password === req.body.password)
      {
         const token = authorization.generateAccessToken({user_id: aqz.password});
         res.status(200).send(token);
      }
   } 
      res.status(500).send({error: "error verifying user"});

}

module.exports.loginUserRoute = loginUserRoute;
module.exports.verifyLoginUserRoute = verifyLoginUserRoute;
