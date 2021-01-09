/* 
 * Author: Samuel Lippett
 * Project: COMP3006 Coursework
 */
importScripts('client-dist/socket.io.min.js');
const socket = io("http://192.168.1.47:3000");

class WorkerEvents
{
   static KEYUPEVENT = "KEYUPEVENT";
   static MESSAGE_SEND = "MESSAGE_SEND";
   static MESSAGE_SEND = "MESSAGE_RECEIVE";
   static INIT_UXID = "INIT_UXID";
   static ERROR = "ERROR";
}




onmessage = (ep) => {
   console.log(ep.data.event);
   socket.emit(ep.data.event, ep.data);
};

socket.on("INIT_UXID", (msg) =>
        {
           postMessage({event: "INIT_UXID", payload: msg});
        });

socket.on("KEYUPEVENT", (msg) =>
        {
           console.log("receiving keyup");
           postMessage({event: "KEYUPEVENT", payload: msg});
        });

socket.on("MESSAGE_RECEIVE", (msg) =>
        {
           postMessage({event: "MESSAGE_RECEIVE", payload: msg});
        });

socket.on("USER_CONNECT", (msg) =>
        {
           console.log("user connected");
           postMessage({event: "USER_CONNECT", payload: msg});
        });

socket.on("USER_DISCONNECT", (msg) =>
        {
           console.log("user disconnect");
           postMessage({event: "USER_DISCONNECT", payload: msg});
        });

socket.on("ERROR", (msg) =>
        {
           console.log(msg);
        });
