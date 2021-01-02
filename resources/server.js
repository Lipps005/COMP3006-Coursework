/* 
 * Author: Samuel Lippett
 * Project: COMP3006 Coursework
 */
const jwt = require("jsonwebtoken");
const express = require("express");
const mongoose = require("mongoose");
const path = require("path");
const routes = require("./routes");
const authorization = require("./authorization");

let port = 9000;

// Initialise the app.
app = express();

// Set up the static files.
app.use(express.static(path.join(__dirname, "static")));
app.set("views", path.join(__dirname, "views"));

// Enable processing of post forms.
app.use(express.urlencoded({extended: true}));

 app.use(function(req, res, next) {
    res.header(
      "Access-Control-Allow-Headers",
      "x-access-token, Origin, Content-Type, Accept"
    );
    next();
  });
  
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
app.get("/login", authorization.authToken, routes.loginUserRoute);


//chat page - authorize token (if exists) - redirect to login page if not verified or none exists
//verify userid exists
//verify chat exists
//start chat socket
//render all chat messages
app.get("/users/:userid/chat/:chatid");

//verify credentials & generate JWT token. redirect to chat page.
app.post("/api/auth/login", routes.verifyLoginUserRoute);

//logout - delete token, redirect to login page.
app.post("/api/auth/logout");


//post message in chat outside socket

app.post("api/:chatid/message");


