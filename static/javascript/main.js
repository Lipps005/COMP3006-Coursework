$(document).ready(function () {

   var typing = true;
   function typingDebouncer()
   {
      $(".typing-bubble").css("visibility", "hidden");
      setTimeout(function () {
         typing = false;
         typingDebouncer();
      }, 3000);
   }

   typingDebouncer();
   var webWorker = new Worker("/javascript/socketWorker.js");
   var pathArray = window.location.pathname.split('/');

   webWorker.postMessage({client: pathArray[2], recipient: "", message: "", event: "INIT_UXID"});
   webWorker.onmessage = function (event) {
      switch (event.data.event)
      {
         case "INIT_UXID":
            console.log("init " + event.data.payload);
            break;
            
         case "KEYUPEVENT":
            console.log(event.data.payload);

            console.log(event.data.payload);
            if (pathArray[4] === event.data.payload)
            {
               if (!typing)
               {
                  $(".typing-bubble").css("visibility", "visible");
                  typing = true;
               }
            } else
            {
               $(".contacts-container .contact").each(function () {
                  if ($(this).find(".contact-name-span").text() === event.data.payload)
                  {
                     let contact = this;
                     $(contact).find(".last-online-span").text("typing ...");
                  }
               });
            }
            break;
            
         case "MESSAGE_RECEIVE":
            console.log(event.data.payload);
            console.log(event.data.payload.client);
            if (pathArray[4] === event.data.payload.client)
            {
               $(".typing-bubble").css("visibility", "hidden");
               $(".typing-bubble").before("<div class='message-container sticky-right received'><span class='message-content'>" + event.data.payload.message + "</span></div>");
               $(".message-log-marquee").scrollTop($(".message-log-marquee")[0].scrollHeight);
            } else
            {
               $(".contacts-container .contact").each(function () {
                  if ($(this).find(".contact-name-span").text() === event.data.payload.client)
                  {
                     let contact = this;
                     $(contact).find(".last-online-span").text(event.data.payload.message);
                  }
               });
            }
            break;
            
         case "USER_DISCONNECT":
            break;
            
         case "USER_CONNECT":
            break;
      }

   };


//change the background color of the active contact
   var pathArray = window.location.pathname.split('/');
   let friend = pathArray[4];
   console.log(friend);
   $(".contacts-container .contact").each(function () {
      if ($(this).find(".contact-name-span").text() === friend)
      {
         $(this).prop("active", true);
         $(this).css("background-color", "#e4e6eb");
      }

   });

//delgate on click event to contact container.
//changes the url to show selected contact, deals with
//fetching the new contacts messages
   $(".contacts-container").on("click", "div", function (e) {
      $(".contacts-container .contact").css("background-color", "white");
      $(this).css("background-color", "#e4e6eb");
      console.log("here");
      e.preventDefault();
      let name = $(this).find("span.contact-name-span").text();
      history.replaceState(name, '', name);

   });

//Changes the message inside the 'send' button to improve accessibility.
   $("input[type='text']").on('change keyup', function () {
      var pathArray = window.location.pathname.split('/');
      webWorker.postMessage({client: pathArray[2], recipient: pathArray[4], message: "", event: "KEYUPEVENT"});
      $("input[type='submit']").prop('disabled', $(this).val() === '');
      $(this).val() === '' ? $("input[type='submit']").val("No Message") : $("input[type='submit']").val("Send");

   });

//Event handler for clicking send button
   $("input[type='submit']").on("click submit", function ()
   {
      let message = $("input[type='text']").val();
      let pathArray = window.location.pathname.split('/');
      webWorker.postMessage({client: pathArray[2], recipient: pathArray[4], message: message, event: "MESSAGE_SENT"});
      $(".typing-bubble").before("<div class='message-container sticky-right sent'><span class='message-content'>" + message + "</span></div>");
      $(".message-log-marquee").scrollTop($(".message-log-marquee")[0].scrollHeight);
      $("input[type='text']").val('').keyup();
   });


});



