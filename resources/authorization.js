/* 
 * Author: Samuel Lippett
 * Project: COMP3006 Coursework
 */
const jwt = require("jsonwebtoken");
const ACCESS_TOKEN_SECRET = "doubledoubletoilandtrouble";

function authToken(req, res) {
   //retreive token from http header
   let token = req.headers['x-access-token'];
   if (!token)
   {
      //respond 403 if no token
      return req.body.user = null;
   }
   
   //verify token using secret
   jwt.verify(token, ACCESS_TOKEN_SECRET, (err, decoded) => {
    if (err) {
       
      return req.body.user = null;
    }
    //retreive user id and pass control onto route.
    req.body.user = decoded.user_id;
  });
  
}

//express routes - pathways into application. 
function generateAccessToken(id) {
   // exp. 30 mins
   return jwt.sign({user_id: id}, ACCESS_TOKEN_SECRET, {expiresIn: '1800s'});
}




module.exports.authToken = authToken;
module.exports.generateAccessToken = generateAccessToken;

