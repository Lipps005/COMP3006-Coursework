/* 
 * Author: Samuel Lippett
 * Project: COMP3006 Coursework
 */
const jwt = require("jsonwebtoken");
const express = require("express");
const mongoose = require("mongoose");
const path = require("path");
const routes = require("./routes");
const ACCESS_TOKEN_SECRET = "doubledoubletoilandtrouble";

let port = 9000;

// Initialise the app.
app = express();

// Set up the static files.
app.use(express.static(path.join(__dirname, "static")));

// Enable processing of post forms.
app.use(express.urlencoded({extended: true}));

function authToken(req, res, next) {
   let token = req.headers['authorization'];
   if (!token)
   {
      return res.status(403).send({message: "No token provided!"});
   }
   jwt.verify(token, ACCESS_TOKEN_SECRET, (err, decoded) => {
    if (err) {
      return res.status(401).send({ message: "Unauthorized!" });
    }
    req.body.user_id = decoded.user_id;
    next();
  });
}

function generateAccessToken(user_id) {
   // exp. 30 mins
   return jwt.sign(user_id, ACCESS_TOKEN_SECRET, {expiresIn: '1800s'});
}


// Start the app.
app.listen(port, function () {
   console.log("Listening on " + port);
});


//routes

//login - check if token exists. redirect to chat page if verified.
//on login or token auth, rendering chat page requires returning all chats for the user.
//each contact is the name of the other user in the chat. Contact is a ref. to that shared chat[id].
//select first chat returned and redirect to that url.
//if no chats exist, choose a random user who is logged in and redirect to that url.
app.get("/login");


//chat page - authorize token (if exists) - redirect to login page if not verified or none exists
//verify userid exists
//verify chat exists
//start chat socket
//render all chat messages
app.get("/users/:userid/chat/:chatid");

//verify credentials & generate JWT token. redirect to chat page.
app.post("/api/auth/login");

//logout - delete token, redirect to login page.
app.post("/api/auth/logout");


//post message in chat

app.post("api/:chatid/message");


