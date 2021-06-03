
//INPUT FIELDS
var fname = document.getElementById("fname");
var lname = document.getElementById("Psw");
var ph = document.getElementById("ph");
var passport = document.getElementById("passport");
var myEmail = document.getElementById("Email");
var myInput = document.getElementById("Psw");
var CPsw = document.getElementById("CPsw");

//VALIDATION REQUIREMENTS
var validEmail = document.getElementById("validEmail");
var letter = document.getElementById("letter");
var capital = document.getElementById("capital");
var number = document.getElementById("number");
var length = document.getElementById("length");

// When the user clicks on the password field, show the message box
myEmail.onfocus = function() {
  document.getElementById("message").style.display = "block";
};

// When the user clicks outside of the password field, hide the message box
myEmail.onblur = function() {
  document.getElementById("message").style.display = "none";
};

function ValidateEmail(email)
{
  if (/^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/.test(email))
  {
    return (true);
  }
    return (false);
}

myEmail.onkeyup = function() {
  if(ValidateEmail(myEmail.value)){
    validEmail.classList.remove("invalid");
    validEmail.classList.add("valid");
  } else {
    validEmail.classList.remove("valid");
    validEmail.classList.add("invalid");
  }
};

// When the user clicks on the password field, show the message box
myInput.onfocus = function() {
  document.getElementById("message").style.display = "block";
};

// When the user clicks outside of the password field, hide the message box
myInput.onblur = function() {
  document.getElementById("message").style.display = "none";
};
// When the user starts to type something inside the password field
myInput.onkeyup = function() {
  // Validate lowercase letters
  var lowerCaseLetters = /[a-z]/g;
  if(myInput.value.match(lowerCaseLetters)) {
    letter.classList.remove("invalid");
    letter.classList.add("valid");
  } else {
    letter.classList.remove("valid");
    letter.classList.add("invalid");
  }
// Validate capital letters
  var upperCaseLetters = /[A-Z]/g;
  if(myInput.value.match(upperCaseLetters)) {
    capital.classList.remove("invalid");
    capital.classList.add("valid");
  } else {
    capital.classList.remove("valid");
    capital.classList.add("invalid");
  }

  // Validate numbers
  var numbers = /[0-9]/g;
  if(myInput.value.match(numbers)) {
    number.classList.remove("invalid");
    number.classList.add("valid");
  } else {
    number.classList.remove("valid");
    number.classList.add("invalid");
  }

  // Validate length
  if(myInput.value.length >= 8) {
    length.classList.remove("invalid");
    length.classList.add("valid");
  } else {
    length.classList.remove("valid");
    length.classList.add("invalid");
  }
};



// function signUp(){
//   console.log("Sign up");
//   var check = true;
//   check = check && validEmail.classList.contains("valid");
//   check = check && letter.classList.contains("valid");
//   check = check && capital.classList.contains("valid");
//   check = check && number.classList.contains("valid");
//   check = check && length.classList.contains("valid");
//   check = check && myInput.value === CPsw.value;
//   if(check){
//     // var myObj = {
//     //   firstName: fname.value,
//     //   lastName: lname.value,
//     //   phoneNum: ph.value,
//     //   passport: passport.value,
//     //   email: email.value,
//     //   password: myInput.value
//     // };

//     // xhttp = new XMLHttpRequest();

//     // xhttp.onreadystatechange = function(){
//     //     if(this.readyState == 4 && this.status == 200){
//     //       // window.location.replace("/login.html");
//     //     }
//     // };

//     // xhttp.open("POST","/users/user-signup.ajax", true);
//     // xhttp.setRequestHeader("Content-type", "application/json");
//     // xhttp.send(JSON.stringify(obj));
//     return true;

//   } else {
//     alert("Please check your information and try again!");
//     return false;
//   }

// }


// MATCHING PASSWORDS (password and confirm password)
// function matching_Password(){
//   var password = document.getElementById("Psw").value;
//   var comfirmPassword =document.getElementById("CPsw").value;
//   if( password!= comfirmPassword){
//     alert ("Passwords did not match. Please try again");
//   }
//   else if( password== comfirmPassword){
//     alert ("Passwords match");
//   }
// }


