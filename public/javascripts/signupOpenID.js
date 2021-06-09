

var appdiv = new Vue({
    el: "#app",
    data: {
        venueSelected: false,
        firstName: "",
        lastName: "",
        companyName: "",
        phoneNum: "",
        buildingName: "",
        street: "",
        zipCode: "",
        city: "",
        country: "",
        passport: "",
        email: "",
        password: "",
        confirmPassword: "",
        invalid: "hidden",
        invalidMessage: "",
        lng: 0,
        lat: 0,

        showRequirements: "none"

    },
    computed: {
        emailValid: function(){
          return /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/.test(this.email);
        },
        lowerValid: function(){
          return /[a-z]/g.test(this.password);
        },
        capitalValid: function(){
          return /[A-Z]/g.test(this.password);
        },
        numberValid: function(){
          return /[0-9]/g.test(this.password);
        },
        lengthValid: function(){
          return (this.password.length >= 8);
        }
    },
    methods: {
        signUpUser: function(){
            if(this.password !== this.confirmPassword){
              this.invalidMessage = "Password must match!";
              this.invalid = "visible";
            }

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


            xhttp.open("POST","/users/user-signup.ajax", true);

            xhttp.setRequestHeader("Content-type", "application/json");

            xhttp.send(JSON.stringify({
              firstName: this.firstName,
              lastName: this.lastName,
              phoneNum: this.phoneNum,
              passport: this.passport,
              email: this.email,
              password: this.password
            }));
        },

        signUpVenue: function(){
            if(this.password !== this.confirmPassword){
              this.invalidMessage = "Password must match!";
              this.invalid = "visible";
              return;
            }

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


            xhttp.open("POST","/users/venue-signup.ajax", true);

            xhttp.setRequestHeader("Content-type", "application/json");

            xhttp.send(JSON.stringify({
              firstName: this.firstName,
              lastName: this.lastName,
              phoneNum: this.phoneNum,
              email: this.email,
              password: this.password,
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




