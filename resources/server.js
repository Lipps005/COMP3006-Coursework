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
const cookieparser = require("cookie-parser");

let port = 9000;

// Initialise the app.
app = express();

// Set up the static files.
app.use(express.static(path.join(__dirname, "static")));

app.use(cookieparser());

app.set("views", path.join("../", "views"));
app.set("view engine", "ejs");

// Enable processing of post forms.
app.use(express.urlencoded({extended: true}));

function nocache(req, res, next) {
  res.header('Cache-Control', 'private, no-cache, no-store, must-revalidate');
  res.header('Expires', '-1');
  next();
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
app.get("/login", nocache, routes.loginUserRoute);


//chat page - authorize token (if exists) - redirect to login page if not verified or none exists
//verify userid exists
//verify chat exists
//start chat socket
//render all chat messages
app.get("/users/:userid/chat/:friendusername", nocache, routes.userChatRoute);

app.get("/users/:userid", nocache, routes.userHomeRoute);

//verify credentials & generate JWT token. redirect to chat page.
app.post("/api/auth/login", nocache, routes.verifyLoginUserRoute);

//logout - delete token, redirect to login page.
app.post("/api/auth/logout");


//post message in chat outside socket

app.post("api/:chatid/message");