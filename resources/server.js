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
const cors = require("cors");
const db = require("./db");
let http = require("http");

let port = 9000;

// Initialise the app.
app = express();

app.use(cors());

// Set up the static files.
app.use(express.static(path.join('../', "static")));

app.use(cookieparser());

// Setup the app to use EJS templates.
app.set("views", path.join('../', "views"));
app.set("view engine", "ejs");


// Enable processing of post forms.
app.use(express.urlencoded({extended: true}));

function nocache(req, res, next) {
   res.header('Cache-Control', 'private, no-cache, no-store, must-revalidate');
   res.header('Expires', '-1');
   next();
}
// Start the app.
app.listen(port, '192.168.1.47', function () {
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

//expects params client_id, friend username
//if contacts are friends, returns chat obj
app.post("/api/nav", routes.returnChatMessages);

//logout - delete token, redirect to login page.
app.post("/api/auth/logout");


//post message in chat outside socket
app.post("api/:chatid/message");


httpserver = http.createServer(app);

var connections = {};

//set up websocket, use cross-origin resource sharing.
const io = require('socket.io')(httpserver, {
   cors: {
      origin: '*'
   }
});

//run server.
httpserver.listen(3000, function () {
   console.log("Listening on 3000");
});



// "On connection" handler.
io.on("connection", function (socket) {
   console.log("a user connected");

// Handler for keyup event from the client.
   socket.on("KEYUPEVENT", async function (msg) {
      var recipient = await db.findUserByUsername(msg.recipient);
      var client = await db.findUserById(msg.client);

      if (!recipient || !client)
      {
         socket.emit("ERROR", "Cannot find that friend :( ");
      } else
      {
         for (var i in recipient.socket_ids)
         {
            socket.to(recipient.socket_ids[i]).emit("KEYUPEVENT", client.username);
         }

      }
   });

   socket.on("MESSAGE_SENT", async function (msg) {
      var recipient = await db.findUserByUsername(msg.recipient);
      var client = await db.findUserById(msg.client);

      if (!recipient || !client)
      {
         socket.emit("ERROR", "Cannot find that friend :( ");
      } else
      {
         //try saving the message to the chat
         var saveMessage = await db.addMessageToChat(client._id, recipient._id, msg.message);
         if (saveMessage)
         {
            msg.client = client.username;
            for (var i in recipient.socket_ids)
            {
               console.log(msg);
               socket.to(recipient.socket_ids[i]).emit("MESSAGE_RECEIVE", msg);
            }
            msg.client = client._id;
            for (var j in client.socket_ids)
            {
               socket.to(client.socket_ids[j]).emit("MESSAGE_SENT", msg);
            }

         }


      }
   });

   socket.on("INIT_UXID", async function (msg) {
      let registration = await db.registerSocketID(msg.client, socket.id);
      socket.emit("INIT_UXID", registration ? true : false);
      if (registration)
      {
         var contacts = await db.getUserContacts(registration._id);
         if (contacts)
         {
            for (var i in contacts)
            {
               //if the contact has socket(s) open, tell send back to user message
               //saying friend is online. 
               if (contacts[i].socket_ids.length > 0)
               {
                  for (var k in registration.socket_ids)
                  {
                     socket.to(registration.socket_ids[k]).emit("USER_CONNECT", contacts[i].username);
                  }
               }
               for (var j in contacts[i].socket_ids)
               {
                  socket.to(contacts[i].socket_ids[j]).emit("USER_CONNECT", registration.username);
               }

            }
         }
      }
   });

   socket.on('disconnect', async function () {
      //find user with socket id that just disconnected.
      //remove socket from user socket list
      //send disconnect message to all of users contacts.
      console.log("user disconnected " + socket.id);
      var user = await db.findUserBySocketId(socket.id);
      console.log("user " + user);
      if (user)
      {
         var updateSockets = await db.updateUserSocket(socket.id);
         if (updateSockets)
         {
            console.log("updated sockets " + updateSockets);
            console.log(updateSockets);
            if (updateSockets.socket_ids.length < 1)
            {
               var contacts = await db.getUserContacts(user._id);
               if (contacts)
               {
                  for (var i in contacts)
                  {
//               if (contacts[i].socket_ids.length < 1)
//               {
//                  for (var k in user.socket_ids)
//                  {
//                     socket.to(user.socket_ids[k]).emit("USER_DISCONNECT", contacts[i].username);
//                  }
//               }
                     for (var j in contacts[i].socket_ids)
                     {
                        socket.to(contacts[i].socket_ids[j]).emit("USER_DISCONNECT", user.username);
                     }

                  }
               }
            }
         }


      }
   });


});
