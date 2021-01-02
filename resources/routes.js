/* 
 * Author: Samuel Lippett
 * Project: COMP3006 Coursework
 */
const jwt = require("jsonwebtoken");
const authorization = require("./authorization");




async function loginUserRoute(req, res)
{
   console.log("here");
   res.status(200).send("valid token! Redirect to chat page");
}



async function verifyLoginUserRoute(req, res)
{
   const token = authorization.generateAccessToken({ user_id: req.body.user_id });
   res.json(token);
}

module.exports.loginUserRoute = loginUserRoute;
module.exports.verifyLoginUserRoute = verifyLoginUserRoute;
