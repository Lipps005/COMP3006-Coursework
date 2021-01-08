$(document).ready(function () {

   var webWorker = new Worker("/javascript/socketWorker.js");
   var pathArray = window.location.pathname.split('/');
   webWorker.postMessage({client: pathArray[2], recipient: "", message: "", event: "INIT_UXID"});
   webWorker.onmessage = function (event) {
      switch (event.data.event)
      {
         case "INIT_UXID":
            console.log("init " +event.data.payload);
            break;
         case "KEYUPEVENT":
            console.log(event.data.payload);
            $(".contacts-container .contact").each(function () {
               console.log(event.data.payload);
               if ($(this).find(".contact-name-span").text() === event.data.payload)
               {
                  $(this).find(".last-online-span").text("typing ...");
               }

            });
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



});



