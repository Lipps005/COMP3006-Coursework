/*
 * Author: Samuel Lippett
 * Project: COMP3006 Coursework
 */

$(document).ready(function () {

   var typing = true;

   function typingDebouncer()
   {
      setTimeout(function () {
         typing = false;
         typingDebouncer();
      }, 500);
   }
   typingDebouncer();
   $("#loginForm").on('change keyup', 'input', function ()
   {
      if (!typing) {
         //check if the form fields are empty, and disable button if so.
         if ($("#user_id").val() !== '' && $("#password").val() !== '')
         {
            $("input[type='submit']").prop('disabled', false);
         } else
         {
            $("input[type='submit']").prop('disabled', true);
            $("input[type='submit']").val("Fill out the form");
         }
         if ($("#user_id").val() !== '')
         {

            $("#password").css("background-color", "white");
            var xhrReq = $.post("/api/validate", {username: $("#user_id").val()})
                    .done(function (data)
                    {
                       if (data.exists === false)
                       {
                          $("#loginForm").attr("action", "/api/signup");
                       } else
                       {
                          $("#loginForm").attr("action", "/api/auth/login");
                       }
                       $("#password").prop('disabled', false);

                       if ($("#password").val() !== '')
                       {
                          $("input[type='submit']").val(data.exists ? "Login" : "Sign Up");
                       }

                    })
                    .fail(function (data, status, error)
                    {

                    });

            typing = true;


         } else
         {
            $("#password").prop('disabled', true);
            $("#password").val("");
            $("#password").css("background-color", " #c0ded9");
         }

            
      }
   });

});
