$(document).ready(function () {

   //scroll to bottom of message marquee
   $(".message-log-marquee").scrollTop($(".message-log-marquee")[0].scrollHeight);

   //define function for debouncing quick keypress events
   var typing = true;
   var contacttyping = true;
   function typingDebouncer()
   {
      $(".typing-bubble").css("visibility", "hidden");
      setTimeout(function () {
         typing = false;
         typingDebouncer();
      }, 5000);
   }
   function contactDebouncer()
   {
      setTimeout(function () {
         contacttyping = false;
         contactDebouncer();
      }, 2000);
   }
 
   //start debouncer
   typingDebouncer();
   contactDebouncer();

   //start webworker
   var webWorker = new Worker("/javascript/socketWorker.js");

   //get URL and send client id to webworker.
   var pathArray = window.location.pathname.split('/');
   webWorker.postMessage({client: pathArray[2], recipient: "", message: "", event: "INIT_UXID"});

   //when webworker posts message to main js, use switch statement to
   //process socket events.
   webWorker.onmessage = function (event) {
      switch (event.data.event)
      {
         case "INIT_UXID":
            console.log("init " + event.data.payload);
            break;

         case "KEYUPEVENT":
            var pathArray = window.location.pathname.split('/');
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
                  if ($(this).attr('id') === event.data.payload)
                  {
                     if(!contacttyping)
                     {
                     var contact = $(this);
                     contact.find(".last-online-span").addClass("contact-typing");
                     setTimeout(function(){contact.find(".last-online-span").removeClass("contact-typing"); }, 1000);
                     contacttyping = true;
                  }
                  }
               });
            }
            break;

         case "MESSAGE_RECEIVE":
            var pathArray = window.location.pathname.split('/');
            console.log(event.data.payload);
            console.log(pathArray[4]);
            if (pathArray[4] === event.data.payload.client)
            {
               $(".typing-bubble").css("visibility", "hidden");
               $(".typing-bubble").before("<div class='message-container sticky-left received'><span class='message-content'>" + event.data.payload.message + "</span></div>");
               $(".message-log-marquee").scrollTop($(".message-log-marquee")[0].scrollHeight);
            } else
            {
               $(".contacts-container .contact").each(function () {
                  console.log($(this).attr('id'));
                  if ($(this).attr('id') === event.data.payload.client)
                  {
                     let contact = this;
                     $(contact).find(".last-online-span").text(event.data.payload.message);
                  }
               });
            }
            break;

         case "MESSAGE_SENT":
            var pathArray = window.location.pathname.split('/');
            if (pathArray[2] === event.data.payload.client)
            {
               $(".typing-bubble").before("<div class='message-container sticky-right sent'><span class='message-content'>" + event.data.payload.message + "</span></div>");
               $(".message-log-marquee").scrollTop($(".message-log-marquee")[0].scrollHeight);
            }

         case "USER_DISCONNECT":
            $(".contacts-container .contact").each(function () {
               if ($(this).attr('id') === event.data.payload)
               {
                  let contact = this;
                  $(contact).find(".last-online-span").text("offline");
               }
            });
            break;

         case "USER_CONNECT":
            $(".contacts-container > .contact").each(function () {
               console.log($(this).attr('id'));
               console.log()
               if ($(this).attr('id') === event.data.payload)
               {
                  let contact = this;
                  $(contact).find(".last-online-span").text("online");
               }
            });
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
   $(".contacts-container").on("click", ".contact", function (e)
   {
      var pathArray = window.location.pathname.split('/');
      var name = $(this).attr('id');
      if (name !== pathArray[4])
      {
         var xhrReq = $.post("/api/nav", {client_id: pathArray[2], contact_username: name})
                 .done(function (data)
                 {
                    $(".contacts-container > .contact").each(function () {
                       console.log(this);
                       if ($(this).attr('id') === name)
                       {
                          $(this).focus();
                          $(this).prop("active", true);
                          $(this).css("background-color", "#e4e6eb");
                       } else
                       {
                          $(this).prop("active", false);
                          $(this).css("background-color", "white");
                       }

                    });
                    $(".message-log-marquee").remove(".message-container");
                    for (var i = 0; i < data.messages.length; i++) {
                       if (data.messages[i].origin_user === pathArray[2])
                       {
                          $(".typing-bubble").before("<div class='message-container sticky-right sent'><span class='message-content'>" + data.messages[i].contents.body + "</span></div>");
                          $(".message-log-marquee").scrollTop($(".message-log-marquee")[0].scrollHeight);
                       } else
                       {
                          $(".typing-bubble").before("<div class='message-container sticky-left received'><span class='message-content'>" + data.messages[i].contents.body + "</span></div>");
                          $(".message-log-marquee").scrollTop($(".message-log-marquee")[0].scrollHeight);
                       }


                    }
                    e.preventDefault();
                    history.replaceState(name, '', name);
                 })
                 .fail(function (data, status, error)
                 {
                    console.log("error status: " + status + " /n + error: " + error);
                 });

      }
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
      if($("input[type='text']").val())
      {
         let message = $("input[type='text']").val();
         let pathArray = window.location.pathname.split('/');
         webWorker.postMessage({client: pathArray[2], recipient: pathArray[4], message: message, event: "MESSAGE_SENT"});
         $(".typing-bubble").before("<div class='message-container sticky-right sent'><span class='message-content'>" + message + "</span></div>");
         $(".message-log-marquee").scrollTop($(".message-log-marquee")[0].scrollHeight);
         $("input[type='text']").val('').keyup();
      }
   });
   
   $(".message-container").on("click", "i", function ()
   {
      $(this).closest(".message-container").remove();
   });
});



