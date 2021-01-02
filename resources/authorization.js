/* 
 * Author: Samuel Lippett
 * Project: COMP3006 Coursework
 */
const jwt = require("jsonwebtoken");
const ACCESS_TOKEN_SECRET = "doubledoubletoilandtrouble";

function authToken(req, res, next) {
   let token = req.headers['x-access-token'];
   if (!token)
   {
      return res.status(403).send({ message: "No token provided!" });
   }
   console.log(token);
   jwt.verify(token, ACCESS_TOKEN_SECRET, (err, decoded) => {
    if (err) {
      return res.status(401).send({ message: "Unauthorised Access!" });;
    }
    req.body.user_id = decoded.user_id;
    next();
  });
}

//express routes - pathways into application. 
function generateAccessToken(id) {
   // exp. 30 mins
   return jwt.sign({user_id: id}, ACCESS_TOKEN_SECRET, {expiresIn: '1800s'});
}

module.exports.authToken = authToken;
module.exports.generateAccessToken = generateAccessToken;

