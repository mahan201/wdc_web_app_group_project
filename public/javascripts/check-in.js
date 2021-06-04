
var session = {};

makeRequest("GET","users/details.ajax",{},function(result){
    appdiv.received = true;
    session = JSON.parse(result);
});

var appdiv = new Vue({
    el: "#app",
    data: {
        received: false,
        showLogout: false,
        codes: [],
        failed: false,
        passed: false,
        code: "",
        email: "",
        fName: "",
        lName: "",
        pNum: "",
        IDNum: ""
    },
    computed: {
        signedIn: function(){
            if(this.received){
                return session.loggedIn;
            }
        },
        firstName: function(){
            if(this.received){
                return session.firstName;
            }
        }
    },
    methods: {
        checkIn: function(event){
            var valid = false;
            var venueEmail = "";
            this.codes.forEach(function(venue) {
                if(venue.checkInCode === appdiv.code){
                  valid = true;
                  venueEmail = venue.email;
                }
            });
            if(valid){

                var details = {venue: venueEmail};

                if(!this.signedIn){
                    details.email = this.email;
                    details.firstName = this.fName;
                    details.lastName = this.lName;
                    details.phoneNum = this.pNum;
                    details.passport = this.IDNum;
                }

                //Code to send the data to the server.
                xhttp = new XMLHttpRequest();

                xhttp.onreadystatechange = function(){
                    if(this.readyState == 4 && this.status == 200){
                       appdiv.passed = true;
                       appdiv.failed = false;
                    } else if (this.readyState == 4 && this.status == 500){
                        this.failed = true;
                        this.passed = false;
                    }
                };

                xhttp.open("POST","/users/check-in.ajax", true);

                xhttp.setRequestHeader("Content-type","application/json");

                xhttp.send(JSON.stringify(details));
            } else {
                this.failed = true;
                this.passed = false;
            }

        }
    }
});

makeRequest("GET","users/check-in-codes.ajax",{},function(result){
        appdiv.codes = JSON.parse(result);
    });