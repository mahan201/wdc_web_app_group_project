

var appdiv = new Vue({
    el: "#app",
    data: {
        venueSelected: false,
        tokenId: "",
        companyName: "",
        phoneNum: "",
        buildingName: "",
        street: "",
        zipCode: "",
        city: "",
        country: "",
        passport: "",
        invalid: "hidden",
        invalidMessage: "",
        lng: 0,
        lat: 0,


    },
    methods: {
        signUpUser: function(){

            xhttp = new XMLHttpRequest();

            xhttp.onreadystatechange = function(){
                if(this.readyState == 4 && this.status == 200){
                   window.location.replace('/');
                } else if (this.readyState == 4 && this.status == 500){
                    alert("Internal Server Error. Please try again later.");
                } else if (this.readyState == 4 && this.status == 400){
                    console.log("FAILED SIGNUP");
                    appdiv.invalidMessage = "Email address is already in use!";
                    appdiv.invalid = "visible";
                }
            };


            xhttp.open("POST","/users/token-user-signup.ajax", true);

            xhttp.setRequestHeader("Content-type", "application/json");

            xhttp.send(JSON.stringify({
              idtoken: this.tokenId,
              phoneNum: this.phoneNum,
              passport: this.passport
            }));
        },

        signUpVenue: function(){

            xhttp = new XMLHttpRequest();

            xhttp.onreadystatechange = function(){
              if(this.readyState == 4 && this.status == 200){
                var result = JSON.parse(this.response);

                appdiv.lng = result[0].lon;
                appdiv.lat = result[0].lat;
                appdiv.signUpVenueSend();
              } else if (this.readyState == 4 && this.status == 404){
                appdiv.invalidMessage = "Please reformat your address fields.";
                appdiv.invalid = "visible";
              }
            };

            var address = [this.buildingName,this.street,this.zipCode,this.city,this.country].reduce((acc,val) => acc = acc + val + ", ", "");
            address = address.slice(0,address.length-2);

            xhttp.open("GET","https://us1.locationiq.com/v1/search.php?key=pk.4e874fdbdccdbc06c6bf9becc4b7fadf&format=json&q=" + encodeURIComponent(address), true);

            xhttp.send();
        },

        signUpVenueSend: function(){
          xhttp = new XMLHttpRequest();

            xhttp.onreadystatechange = function(){
                if(this.readyState == 4 && this.status == 200){
                   window.location.replace('/login.html');
                } else if (this.readyState == 4 && this.status == 500){
                    alert("Internal Server Error. Please try again later.");
                } else if (this.readyState == 4 && this.status == 400){
                    console.log("FAILED SIGNUP");
                    appdiv.invalidMessage = "Email address is already in use!";
                    appdiv.invalid = "visible";
                }
            };


            xhttp.open("POST","/users/toke-venue-signup.ajax", true);

            xhttp.setRequestHeader("Content-type", "application/json");

            xhttp.send(JSON.stringify({
              idtoken: this.tokenId,
              phoneNum: this.phoneNum,
              companyName: this.companyName,
              buildingName: this.buildingName,
              street: this.street,
              zipCode: this.zipCode,
              city: this.city,
              country: this.country,
              lng: this.lng,
              lat: this.lat
            }));
        }
    }
});

function onGoogleSignIn(googleUser) {
  console.log("RAN");
  var profile = googleUser.getBasicProfile();

  appdiv.tokenId = googleUser.getAuthResponse().id_token;
}

makeRequest("GET","users/details.ajax",{},function(result){
    console.log(JSON.parse(result));
    if(result.loggedIn){
      window.location.replace('/');
    }
});
