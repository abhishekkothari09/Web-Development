jQuery(document).ready(function($){
	$(".dropdown-button").dropdown();
	$('.modal').modal();
	$(".signup-toggle").click(function(){
		$(this).hide();
		$(".signupForm").show(300);
		$(".policy").css("visibility","visible");
	});
});

function formvalidation(){
  var username =document.getElementById("name-picked").value;
  var email = document.getElementById("email").value;
  var password = document.getElementById("pass-picked").value;
  var passwordConfirm = document.getElementById("rep-pass").value;
  if(username_check(username)){
    if(email_check(email)){
      if(password_check(password)){
        if(password_match(password,passwordConfirm)){
          return true;
        }
      }
    }
  }
  return false;
}

function username_check(username){
  var username_length=username.length;
  if(username_length==0){
    showMsg("<p>Please enter the username</p>");
    return false;
  } 
  return true;
}

function email_check(email){
  var email_length=email.length;
  if(email_length==0){
    showMsg("<p>Please enter the email</p>");
    return false;
  }
  var form = /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
  var email_form_text=form.test(email)

  if(email_form_text==false){
    showMsg("<p>E-mail id is not is valid format</p>");
    return false;
  }
  return true;
}

function password_check(password){
  if(password.length==0){
    showMsg("<p>Please enter the Password</p>")
    return false;
  }
  var password_Re=/^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#\$%\^&\*])(?=.{8,})/;
  var password_form_text=password_Re.test(password)
  if(password_form_text==false){
    showMsg("<p>Password should contain atleast 1 lowercase character,<br>1 uppercase character,<br>1 numeric character,<br>1 special character,<br> and must be atleast eight characters.</p>");
    return false;
  }
  return true;

}

function password_match(password,passwordConfirm){
  if(passwordConfirm.length==0){
    showMsg("<p>Please fill the repeat password</p>")
    return false;
  }
  if(password!=passwordConfirm){
    showMsg("<p>Passwords does not match</p>")
    return false;
  }
  return true;
}

//  Sign up

function showMsg(htmlmsg) {
  var responseDiv = document.getElementById('ServerResponse');
  responseDiv.style.display = "block";
  responseDiv.innerHTML = htmlmsg;
}

function sendReqForSignup() {
  var username =document.getElementById("name-picked").value;
  var email = document.getElementById("email").value;
  // var fullName = document.getElementById("fullName").value;
  var password = document.getElementById("pass-picked").value;
  var passwordConfirm = document.getElementById("rep-pass").value;
  if(formvalidation()==true){
  var xhr = new XMLHttpRequest();
  xhr.addEventListener("load", signUpResponse);
  xhr.responseType = "json";
  xhr.open("POST", '/apiusers/signup');
  // Send the request
  xhr.setRequestHeader("Content-type", "application/json");
  xhr.send(JSON.stringify({username:username,useremail:email,password:password,passwordConfirm:passwordConfirm}));
  }
}

// Response listener for the Ajax call for getting the shippign cost results
function signUpResponse() {
  var responseDiv = document.getElementById('ServerResponse');
  console.log(this.response);
  var responseHTML = "";

  if (this.status === 201) {
    if (this.response.success) {
      // Change current location of window to response's redirect
      window.location = this.response.redirect;
    } else {
      responseHTML+= this.response.message;
    }
  }
  else {
    // Use a span with dark red text for errors
    responseHTML = "<span class='red-text text-darken-2'>";
    responseHTML += "Error: " + this.response.message;
    responseHTML += "</span>"
  }

  // Update the response div in the webpage and make it visible
  responseDiv.style.display = "block";
  responseDiv.innerHTML = responseHTML;
}

document.addEventListener("DOMContentLoaded", function() {
  document.getElementById("signup").addEventListener("click", sendReqForSignup);
});



// Handle authentication on page load
document.addEventListener("DOMContentLoaded", function() {
  // Check if local storage has token
    document.getElementById("signin").addEventListener("click", sendReqForSignin);
    document.getElementById("pass").addEventListener("keypress", function(event) {
      var key = event.which || event.keyCode;
      if (key === 13) { // 13 is enter
         sendReqForSignin();
      }
    });
  // }
});