
var appdiv = new Vue({
    el: "#app",
    data: {
        email: "",
        password: "",
        invalid: "hidden"
    },
    methods: {
        logIn: function(){
            xhttp = new XMLHttpRequest();

            xhttp.onreadystatechange = function(){
                if(this.readyState == 4 && this.status == 200){
                   window.location.replace('/');
                } else if (this.readyState == 4 && this.status == 500){
                    alert("Internal Server Error. Please try again later.");
                } else if (this.readyState == 4 && this.status == 401){
                    console.log("FAILED LOGIN");
                    appdiv.invalid = "visible";
                }
            };


            xhttp.open("POST","/users/login.ajax", true);

            xhttp.setRequestHeader("Content-type", "application/json");

            xhttp.send(JSON.stringify({email: this.email, password: this.password}));
        }
    }
});


function onGoogleSignIn(googleUser) {
  console.log("RAN");
  var profile = googleUser.getBasicProfile();
  console.log('ID: ' + profile.getId()); // Do not send to your backend! Use an ID token instead.
  console.log('Name: ' + profile.getName());
  console.log('Image URL: ' + profile.getImageUrl());
  console.log('Email: ' + profile.getEmail()); // This is null if the 'email' scope is not present.

  var id_token = googleUser.getAuthResponse().id_token;

  var xhr = new XMLHttpRequest();
  xhr.open('POST', '/users/tokenLogin.ajax');

  xhr.onreadystatechange = function() {
    if (this.readyState == 4 && this.status == 200) {
      window.location.replace('/');
    } else  if (this.readyState == 4 && this.status == 404) {
      window.location.replace('/signupOID.html');
    }
  };

  xhr.setRequestHeader('Content-Type', 'application/json');
  xhr.send(JSON.stringify({'idtoken': id_token}));

}
