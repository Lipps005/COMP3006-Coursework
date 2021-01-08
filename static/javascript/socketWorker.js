/* 
 * Author: Samuel Lippett
 * Project: COMP3006 Coursework
 */
importScripts('client-dist/socket.io.min.js');
const socket = io("http://localhost:3000");

class WorkerEvents
{
   static KEYUPEVENT = "KEYUPEVENT";
   static MESSAGE_SEND  = "MESSAGE_SEND";
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

socket.on("ERROR", (msg) =>
{
   console.log(msg);
});
